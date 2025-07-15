#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🕐 Installing hello-time-man...');

const platform = process.platform;
const binDir = path.join(__dirname, '..', 'bin');
const libDir = path.join(__dirname, '..', 'lib');

// 폴더 생성
if (!fs.existsSync(binDir)) fs.mkdirSync(binDir, { recursive: true });
if (!fs.existsSync(libDir)) fs.mkdirSync(libDir, { recursive: true });

const binaryName = platform === 'win32' ? 'hello-time-man.exe' : 'hello-time-man';
const targetBinary = path.join(binDir, binaryName);

// JAR 파일 확인
const prebuiltJar = path.join(libDir, 'hello-time-man.jar');
if (!fs.existsSync(prebuiltJar)) {
    console.error('❌ JAR file not found in package');
    console.error('This is a packaging issue. Please report at:');
    console.error('https://github.com/rojojun/hello-time-man/issues');
    process.exit(1);
}

console.log('📦 Installing JAR version...');
const stats = fs.statSync(prebuiltJar);
console.log(`📊 JAR size: ${Math.round(stats.size / 1024)}KB`);

// 실행 스크립트 생성
const script = platform === 'win32' ? createWindowsScript() : createUnixScript();
fs.writeFileSync(targetBinary, script);
if (platform !== 'win32') fs.chmodSync(targetBinary, '755');

console.log('✅ Installation completed!');
console.log('🚀 Try: hello or hello-time-man');

function createUnixScript() {
    return `#!/usr/bin/env bash
# hello-time-man launcher script

if ! command -v java &> /dev/null; then
    echo "❌ Java 11+ required but not found."
    echo "   Download: https://adoptium.net/"
    echo "   macOS: brew install openjdk"
    echo "   Ubuntu: sudo apt install openjdk-11-jre"
    exit 1
fi

# npm 글로벌 설치 경로에서 JAR 찾기
SCRIPT_DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"

if [[ "$SCRIPT_DIR" == */bin ]]; then
    # 글로벌 설치 (예: /opt/homebrew/bin)
    NPM_ROOT="$(npm root -g 2>/dev/null || echo '/opt/homebrew/lib/node_modules')"
    JAR_PATH="$NPM_ROOT/hello-time-man/lib/hello-time-man.jar"
else
    # 로컬 설치
    JAR_PATH="$SCRIPT_DIR/../lib/hello-time-man.jar"
fi

if [ ! -f "$JAR_PATH" ]; then
    echo "❌ JAR file not found at: $JAR_PATH"
    echo "   Try reinstalling: npm install -g hello-time-man"
    exit 1
fi

exec java -jar "$JAR_PATH" "$@"
`;
}

function createWindowsScript() {
    return `@echo off
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java 11+ required. Download: https://adoptium.net/
    exit /b 1
)

for /f "tokens=*" %%i in ('npm root -g 2^>nul') do set NPM_ROOT=%%i
if "%NPM_ROOT%"=="" set NPM_ROOT=%APPDATA%\\npm\\node_modules

set JAR_PATH=%NPM_ROOT%\\hello-time-man\\lib\\hello-time-man.jar
if not exist "%JAR_PATH%" (
    echo ❌ JAR not found. Try: npm install -g hello-time-man
    exit /b 1
)

java -jar "%JAR_PATH%" %*
`;
}
