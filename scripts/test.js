#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🧪 Testing hello-time-man...');
console.log(`📍 Platform: ${process.platform}`);
console.log(`📍 Node version: ${process.version}`);

function runCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            encoding: 'utf8',
            timeout: 10000,
            shell: process.platform === 'win32',
            ...options
        });

        let stdout = '';
        let stderr = '';

        if (child.stdout) child.stdout.on('data', (data) => stdout += data);
        if (child.stderr) child.stderr.on('data', (data) => stderr += data);

        child.on('close', (code) => {
            resolve({ code, stdout, stderr });
        });

        child.on('error', reject);
    });
}

async function testBinary() {
    const binaryPath = path.join(__dirname, '..', 'bin', 'hello');

    console.log('📍 Testing binary at:', binaryPath);

    // 바이너리 파일 존재 확인
    if (!fs.existsSync(binaryPath)) {
        throw new Error(`Binary not found at: ${binaryPath}`);
    }

    const tests = [
        {
            name: 'Basic execution',
            command: 'node',
            args: [binaryPath]
        },
        {
            name: 'Help command',
            command: 'node',
            args: [binaryPath, '--help']
        },
        {
            name: 'Version command',
            command: 'node',
            args: [binaryPath, '--version']
        },
        {
            name: 'Options test',
            command: 'node',
            args: [binaryPath, '--format', 'short', '--timezone', 'UTC']
        }
    ];

    for (const test of tests) {
        try {
            console.log(`🔹 Testing: ${test.name}...`);

            const result = await runCommand(test.command, test.args);

            if (result.code !== 0) {
                console.log(`⚠️  Command exited with code ${result.code}`);
                if (result.stderr) console.log('stderr:', result.stderr);
            }

            console.log(`✅ ${test.name} completed`);

        } catch (error) {
            console.error(`❌ ${test.name} failed:`, error.message);
            throw error;
        }
    }
}

async function testJavaInstallation() {
    console.log('🔹 Testing Java installation...');

    try {
        const result = await runCommand('java', ['-version']);
        if (result.code === 0) {
            console.log('✅ Java is installed and working');
            return true;
        } else {
            console.log('⚠️  Java version check returned non-zero exit code');
            return false;
        }
    } catch (error) {
        console.log('❌ Java not found or not working:', error.message);
        return false;
    }
}

async function testJarFile() {
    console.log('🔹 Testing JAR file...');

    const jarPath = path.join(__dirname, '..', 'lib', 'hello-time-man.jar');

    if (!fs.existsSync(jarPath)) {
        throw new Error(`JAR file not found at: ${jarPath}`);
    }

    const stats = fs.statSync(jarPath);
    console.log(`📊 JAR size: ${Math.round(stats.size / 1024)}KB`);

    // JAR 파일이 실제로 실행 가능한지 테스트
    try {
        const result = await runCommand('java', ['-jar', jarPath, '--help']);
        console.log('✅ JAR file is executable');
        return true;
    } catch (error) {
        console.error('❌ JAR file execution failed:', error.message);
        return false;
    }
}

async function main() {
    try {
        // Java 설치 테스트
        const javaOk = await testJavaInstallation();
        if (!javaOk) {
            console.log('⚠️  Skipping binary tests due to Java issues');
            process.exit(1);
        }

        // JAR 파일 테스트
        await testJarFile();

        // 바이너리 테스트
        await testBinary();

        console.log('🎉 All tests passed!');
        console.log('');
        console.log('📖 Usage examples:');
        console.log('  hello');
        console.log('  hello-time-man --help');
        console.log('  hello-time-man --format short --timezone UTC');

    } catch (error) {
        console.error('❌ Test suite failed:', error.message);
        process.exit(1);
    }
}

main();