#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

/**
 * Windows Build Hang Prevention and Detection Script
 * 
 * This script prevents common Windows build hanging issues by:
 * 1. Pre-validating build environment
 * 2. Monitoring build progress with timeout
 * 3. Automatically recovering from hang conditions
 * 4. Providing detailed diagnostics
 */

class WindowsBuildManager {
    constructor() {
        this.buildTimeout = 10 * 60 * 1000; // 10 minutes max build time
        this.progressTimeout = 2 * 60 * 1000; // 2 minutes without progress = hang
        this.lastProgressTime = Date.now();
        this.buildProcess = null;
        this.progressMarkers = [
            'Determining projects to restore',
            'Restoring NuGet packages',
            'Building ReactNativeDeviceAi',
            'Generating Code',
            'Compiling',
            'Linking'
        ];
    }

    /**
     * Pre-build validation to prevent hanging
     */
    validateBuildEnvironment() {
        console.log('🔍 Validating Windows build environment...');
        
        const checks = [
            {
                name: 'Visual Studio processes',
                check: () => this.checkVisualStudioProcesses(),
                fix: () => this.killVisualStudioProcesses()
            },
            {
                name: 'MSBuild lock files',
                check: () => this.checkMSBuildLocks(),
                fix: () => this.clearMSBuildLocks()
            },
            {
                name: 'NuGet cache',
                check: () => this.checkNuGetCache(),
                fix: () => this.clearNuGetCache()
            },
            {
                name: 'Build output directories',
                check: () => this.checkBuildOutputs(),
                fix: () => this.clearBuildOutputs()
            },
            {
                name: 'Package lock files',
                check: () => this.checkPackageLocks(),
                fix: () => this.clearPackageLocks()
            }
        ];

        let issues = [];
        for (const check of checks) {
            try {
                if (!check.check()) {
                    console.log(`⚠️  Issue found: ${check.name}`);
                    check.fix();
                    console.log(`✅ Fixed: ${check.name}`);
                }
            } catch (error) {
                issues.push(`${check.name}: ${error.message}`);
            }
        }

        if (issues.length > 0) {
            console.log('⚠️  Some validation issues could not be fixed:');
            issues.forEach(issue => console.log(`   - ${issue}`));
        }

        console.log('✅ Build environment validation complete');
    }

    /**
     * Check for conflicting Visual Studio processes
     */
    checkVisualStudioProcesses() {
        try {
            const output = execSync('tasklist /FI "IMAGENAME eq devenv.exe" /FO CSV', { encoding: 'utf8' });
            return !output.includes('devenv.exe');
        } catch {
            return true; // Assume OK if can't check
        }
    }

    /**
     * Kill Visual Studio processes that might interfere
     */
    killVisualStudioProcesses() {
        try {
            execSync('taskkill /F /IM devenv.exe /T', { stdio: 'ignore' });
            console.log('   Closed Visual Studio processes');
        } catch {
            // Process not running, ignore
        }
    }

    /**
     * Check for MSBuild lock files
     */
    checkMSBuildLocks() {
        const lockPatterns = [
            'windows/**/*.lock',
            'windows/**/obj/**/*',
            'windows/**/bin/**/*'
        ];

        for (const pattern of lockPatterns) {
            const lockPath = path.resolve(pattern);
            if (fs.existsSync(lockPath)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Clear MSBuild lock files
     */
    clearMSBuildLocks() {
        const lockDirs = [
            'windows/ReactNativeDeviceAiExample/obj',
            'windows/ReactNativeDeviceAiExample/bin',
            'windows/x64',
            'windows/Win32',
            'windows/ARM64'
        ];

        for (const dir of lockDirs) {
            try {
                if (fs.existsSync(dir)) {
                    fs.rmSync(dir, { recursive: true, force: true });
                    console.log(`   Cleared: ${dir}`);
                }
            } catch (error) {
                console.log(`   Warning: Could not clear ${dir}: ${error.message}`);
            }
        }
    }

    /**
     * Check NuGet cache issues
     */
    checkNuGetCache() {
        // Always return false to force cache clearing (preventive measure)
        return false;
    }

    /**
     * Clear NuGet cache
     */
    clearNuGetCache() {
        try {
            execSync('nuget locals all -clear', { stdio: 'ignore' });
            console.log('   Cleared NuGet cache');
        } catch {
            console.log('   Warning: Could not clear NuGet cache (nuget CLI not found)');
        }
    }

    /**
     * Check build output directories
     */
    checkBuildOutputs() {
        const outputDirs = [
            'windows/x64/Debug',
            'windows/x64/Release'
        ];

        for (const dir of outputDirs) {
            if (fs.existsSync(dir)) {
                const files = fs.readdirSync(dir);
                if (files.some(f => f.endsWith('.pdb') || f.endsWith('.idb'))) {
                    return false; // Has debug files that might cause conflicts
                }
            }
        }
        return true;
    }

    /**
     * Clear build outputs
     */
    clearBuildOutputs() {
        this.clearMSBuildLocks(); // Same logic
    }

    /**
     * Check for package lock conflicts
     */
    checkPackageLocks() {
        const lockFiles = [
            'package-lock.json',
            'yarn.lock'
        ];

        // Check if both exist (conflict)
        const existingLocks = lockFiles.filter(f => fs.existsSync(f));
        return existingLocks.length <= 1;
    }

    /**
     * Clear conflicting package locks
     */
    clearPackageLocks() {
        // Keep npm lock, remove yarn lock if both exist
        if (fs.existsSync('package-lock.json') && fs.existsSync('yarn.lock')) {
            fs.unlinkSync('yarn.lock');
            console.log('   Removed conflicting yarn.lock');
        }
    }

    /**
     * Start monitored build process
     */
    startMonitoredBuild() {
        console.log('🚀 Starting monitored Windows build...');
        
        const buildCommand = 'npx';
        const buildArgs = ['@react-native-community/cli', 'run-windows', '--logging', '--no-packager'];

        this.buildProcess = spawn(buildCommand, buildArgs, {
            stdio: 'pipe',
            shell: true
        });

        // Set up progress monitoring
        this.setupProgressMonitoring();

        // Set up timeout monitoring
        this.setupTimeoutMonitoring();

        return new Promise((resolve, reject) => {
            this.buildProcess.on('close', (code) => {
                if (code === 0) {
                    console.log('✅ Windows build completed successfully!');
                    resolve();
                } else {
                    console.log(`❌ Windows build failed with code ${code}`);
                    reject(new Error(`Build failed with code ${code}`));
                }
            });

            this.buildProcess.on('error', (error) => {
                console.log(`❌ Build process error: ${error.message}`);
                reject(error);
            });
        });
    }

    /**
     * Set up progress monitoring to detect hangs
     */
    setupProgressMonitoring() {
        let lastOutput = '';
        
        this.buildProcess.stdout.on('data', (data) => {
            const output = data.toString();
            console.log(output);
            
            // Check for progress markers
            if (this.progressMarkers.some(marker => output.includes(marker))) {
                this.lastProgressTime = Date.now();
                console.log('📈 Build progress detected');
            }
            
            lastOutput = output;
        });

        this.buildProcess.stderr.on('data', (data) => {
            const output = data.toString();
            console.error(output);
            
            // Update progress time on any output
            this.lastProgressTime = Date.now();
        });
    }

    /**
     * Set up timeout monitoring
     */
    setupTimeoutMonitoring() {
        // Overall build timeout
        setTimeout(() => {
            if (this.buildProcess && !this.buildProcess.killed) {
                console.log('⏰ Build timeout reached, terminating...');
                this.buildProcess.kill('SIGTERM');
            }
        }, this.buildTimeout);

        // Progress timeout (detect hangs)
        const progressCheck = setInterval(() => {
            const timeSinceProgress = Date.now() - this.lastProgressTime;
            
            if (timeSinceProgress > this.progressTimeout) {
                console.log('🚫 Build appears to be hanging (no progress for 2 minutes)');
                console.log('💡 Attempting to recover...');
                
                if (this.buildProcess && !this.buildProcess.killed) {
                    this.buildProcess.kill('SIGTERM');
                    clearInterval(progressCheck);
                    
                    // Attempt recovery
                    setTimeout(() => {
                        console.log('🔄 Restarting build after hang detection...');
                        this.retryBuild();
                    }, 5000);
                }
            }
        }, 30000); // Check every 30 seconds

        // Clear interval when process ends
        this.buildProcess.on('close', () => {
            clearInterval(progressCheck);
        });
    }

    /**
     * Retry build after hang detection
     */
    async retryBuild() {
        console.log('🔄 Performing recovery build...');
        
        // Clean environment again
        this.validateBuildEnvironment();
        
        // Try manual MSBuild approach
        try {
            console.log('📦 Attempting manual MSBuild...');
            const msbuildCmd = 'msbuild windows\\ReactNativeDeviceAiExample.sln /p:Configuration=Debug /p:Platform=x64 /m:1 /verbosity:minimal';
            execSync(msbuildCmd, { 
                stdio: 'inherit', 
                timeout: 5 * 60 * 1000 // 5 minute timeout
            });
            console.log('✅ Manual build successful!');
        } catch (error) {
            console.log(`❌ Manual build also failed: ${error.message}`);
            console.log('💡 Try running: npm run clean-all && npm install && npm run windows-safe');
        }
    }

    /**
     * Main execution function
     */
    async run() {
        try {
            console.log('🔧 Windows Build Hang Prevention & Monitoring');
            console.log('=' .repeat(50));
            
            // Pre-build validation
            this.validateBuildEnvironment();
            
            console.log('');
            
            // Start monitored build
            await this.startMonitoredBuild();
            
        } catch (error) {
            console.log(`\n❌ Build process failed: ${error.message}`);
            console.log('\n💡 Troubleshooting suggestions:');
            console.log('   1. Close Visual Studio completely');
            console.log('   2. Run: npm run clean-all');
            console.log('   3. Restart computer if issues persist');
            console.log('   4. Try: npm run windows-manual');
            
            process.exit(1);
        }
    }
}

// Run if called directly
if (require.main === module) {
    const buildManager = new WindowsBuildManager();
    buildManager.run();
}

module.exports = WindowsBuildManager;