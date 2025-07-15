#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Testing hello-time-man...');

try {
    // 바이너리 경로 찾기
    const binaryName = process.platform === 'win32' ? 'hello-time-man.exe' : 'hello-time-man';
    const binaryPath = path.join(__dirname, '..', 'bin', binaryName);
    
    console.log('📍 Testing binary at:', binaryPath);
    
    // 기본 실행 테스트
    console.log('🔹 Testing basic execution...');
    const basic = execSync(`"${binaryPath}"`, { encoding: 'utf8', timeout: 10000 });
    console.log('✅ Basic execution works');
    
    // 도움말 테스트
    console.log('🔹 Testing help command...');
    const help = execSync(`"${binaryPath}" --help`, { encoding: 'utf8', timeout: 10000 });
    console.log('✅ Help command works');
    
    // 옵션 테스트
    console.log('🔹 Testing options...');
    const options = execSync(`"${binaryPath}" --format short --timezone UTC`, { encoding: 'utf8', timeout: 10000 });
    console.log('✅ Options work correctly');
    
    console.log('🎉 All tests passed!');
    
} catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
}
