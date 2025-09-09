#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🕐 Installing hello-time-man...');

// JAR 파일 확인
const libDir = path.join(__dirname, '..', 'lib');
const jarPath = path.join(libDir, 'hello-time-man.jar');

if (!fs.existsSync(jarPath)) {
    console.error('❌ JAR file not found in package');
    console.error(`   Expected at: ${jarPath}`);
    console.error('This is a packaging issue. Please report at:');
    console.error('https://github.com/rojojun/hello-time-man/issues');
    process.exit(1);
}

// JAR 파일 정보 출력
const stats = fs.statSync(jarPath);
console.log('📦 JAR version installed');
console.log(`📊 JAR size: ${Math.round(stats.size / 1024)}KB`);

// bin 파일 확인
const binPath = path.join(__dirname, '..', 'bin', 'hello');
if (!fs.existsSync(binPath)) {
    console.error('❌ Executable not found in package');
    console.error(`   Expected at: ${binPath}`);
    process.exit(1);
}

// Unix 시스템에서 실행 권한 부여
if (process.platform !== 'win32') {
    try {
        fs.chmodSync(binPath, '755');
        console.log('✅ Execute permission granted (Unix/macOS)');
    } catch (err) {
        console.warn('⚠️  Could not set execute permission:', err.message);
    }
}

console.log('✅ Installation completed!');
console.log('');
console.log('🚀 Usage:');
console.log('  hello                    # Show current time');
console.log('  hello --help             # Show help');
console.log('  hello --format short     # Short format');
console.log('  hello --timezone UTC     # Specific timezone');
console.log('  hello --debug            # Debug information');
console.log('');
console.log('💡 Tip: Both "hello" and "hello-time-man" commands work the same way');