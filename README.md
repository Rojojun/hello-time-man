# Hello-Time-man!!
A blazing fast CLI tool that shows **current time** with friendly greetings.

Built with Java + GraalVM for maximum performance

**☕️ NO JAVA INSTALLATION REQUIRED**

## Installation
```bash
npm install -g hello-time-man
```

## Usage
```bash
# basic usage
hello

# or full command
hello-time-man

# Different formats
hello-time-man --format full
hello-time-man --format short --timezone UTC

# Help
hello-time-man --help
```

## Features
* Lighting fast: Native binary, starts in 45ms
* Timezone support: Any timezone you want (Only on Earth)
* Multiple formats: from simple to detailed
* Friendly greeting: changes based on time of day
* Cross-platform: works on macOS, Linux, Windows
* No dependencies: No Java installation needed

## Options
* `--format <type>`: Time format (full, long, medium, short, iso)
* `--timezone <tz>`: Timezone (e.g., UTC, Asia/Seoul, America/New_York)
* `--locale <locale>`: Locale (e.g., ko-KR, en-US, ja-JP)
* `--help`: Show help
* `--version`: Show version

## Example Output
```
👋 Good morning!

🌅 Current time: July 13, 2025 at 9:30:45 AM KST
🇰🇷 Timezone: Asia/Seoul

💪 Happy Monday! Start your week strong!
```

## License
MIT 