#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🕐 Installing hello-time-man...');

const platform = process.platform;
const binDir = path.join(__dirname, '..', 'bin');
const libDir = path.join(__dirname, '..', 'lib');

// 폴더 생성
if (!fs.existsSync(binDir)) fs.mkdirSync(binDir, { recursive: true });
if (!fs.existsSync(libDir)) fs.mkdirSync(libDir, { recursive: true });

// JAR 파일 확인
const prebuiltJar = path.join(libDir, 'hello-time-man.jar');
if (!fs.existsSync(prebuiltJar)) {
    console.error('[ERROR] JAR file not found in package');
    console.error('[ERROR] This is a packaging issue. Please report at:');
    console.error('[ERROR] https://github.com/rojojun/hello-time-man/issues');
    process.exit(1);
}

console.log('[INFO] Installing JAR version...');
const stats = fs.statSync(prebuiltJar);
console.log(`[INFO] JAR size: ${Math.round(stats.size / 1024)}KB`);

// 크로스 플랫폼 실행기 생성 (Node.js 기반)
const launcherScript = createNodeLauncher();
const launcherPath = path.join(binDir, 'hello');

fs.writeFileSync(launcherPath, launcherScript);

// Unix에서는 실행 권한 부여
if (platform !== 'win32') {
    fs.chmodSync(launcherPath, '755');
}

console.log('[INFO] Installation completed!');
console.log('[INFO] Try: hello or hello-time-man');

function createNodeLauncher() {
    return `#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function checkJava() {
    return new Promise((resolve) => {
        const java = spawn('java', ['-version'], { 
            stdio: 'pipe',
            shell: process.platform === 'win32'
        });
        java.on('close', (code) => resolve(code === 0));
        java.on('error', () => resolve(false));
    });
}

function findJarPath() {
    // 상대 경로로 JAR 찾기 (설치 구조에 따라)
    const possiblePaths = [
        path.join(__dirname, '..', 'lib', 'hello-time-man.jar'),
        path.join(__dirname, '..', '..', '..', 'hello-time-man', 'lib', 'hello-time-man.jar'),
        // 글로벌 설치 시 npm root 기반 경로
        path.join(require.main.filename, '..', '..', 'lib', 'hello-time-man.jar')
    ];
    
    return possiblePaths.find(p => fs.existsSync(p));
}

async function main() {
    // Java 설치 확인
    if (!(await checkJava())) {
        console.error('❌ Java 11+ required but not found.');
        console.error('   Download: https://adoptium.net/');
        
        // 플랫폼별 설치 가이드
        switch (process.platform) {
            case 'darwin':
                console.error('   macOS: brew install openjdk');
                break;
            case 'linux':
                console.error('   Ubuntu: sudo apt install openjdk-11-jre');
                console.error('   CentOS: sudo yum install java-11-openjdk');
                break;
            case 'win32':
                console.error('   Windows: winget install Eclipse.Temurin.11.JRE');
                break;
        }
        process.exit(1);
    }
    
    // JAR 파일 찾기
    const jarPath = findJarPath();
    if (!jarPath) {
        console.error('❌ JAR file not found.');
        console.error('   Try reinstalling: npm install -g hello-time-man');
        process.exit(1);
    }
    
    // Java 실행
    const java = spawn('java', ['-jar', jarPath, ...process.argv.slice(2)], {
        stdio: 'inherit',
        shell: process.platform === 'win32'
    });
    
    java.on('exit', (code) => process.exit(code || 0));
    java.on('error', (err) => {
        console.error('❌ Error running Java:', err.message);
        process.exit(1);
    });
}

main().catch(err => {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
});
`;
}