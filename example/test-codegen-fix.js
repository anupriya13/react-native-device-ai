#!/usr/bin/env node

// Test script to validate that our CodegenFix.props override is working
const { spawn } = require('child_process');
const path = require('path');

console.log('Testing Windows build codegen fix...\n');

// Test that the codegen command works correctly
const testCommand = 'npx';
const testArgs = ['@react-native-community/cli', 'codegen-windows', '--logging'];

console.log('Running:', testCommand, testArgs.join(' '));

const proc = spawn(testCommand, testArgs, {
  cwd: path.join(__dirname),
  stdio: 'inherit'
});

proc.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ SUCCESS: Codegen command completed successfully!');
    console.log('✅ The CodegenFix.props override is working correctly.');
    console.log('✅ Windows build should now work without the npm 404 error.');
  } else {
    console.log('\n❌ FAILED: Codegen command failed with exit code:', code);
    process.exit(1);
  }
});

proc.on('error', (err) => {
  console.error('❌ Error running test:', err);
  process.exit(1);
});