package com.hellotimeman;

import picocli.CommandLine;
import picocli.CommandLine.Command;
import picocli.CommandLine.Option;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.Locale;

@Command(
        name = "hello-time-man",
        description = "🕐 Shows current time with a friendly greeting",
        version = "1.1.2",
        mixinStandardHelpOptions = true
)
public class Main implements Runnable {

    @Option(
            names = {"-f", "--format"},
            description = "Time format (full, long, medium, short, iso)",
            defaultValue = "medium"
    )
    private String format;

    @Option(
            names = {"-z", "--timezone"},
            description = "Timezone (e.g., UTC, Asia/Seoul, America/New_York)",
            defaultValue = "system"
    )
    private String timezone;

    @Option(
            names = {"-l", "--locale"},
            description = "Locale (e.g., ko-KR, en-US, ja-JP)",
            defaultValue = "system"
    )
    private String locale;

    @Option(
            names = {"--emoji"},
            description = "Show time with an emoji",
            defaultValue = "true"
    )
    private boolean showEmoji;

    public static void main(String[] args) {
        BuildInfoLoader loader = new BuildInfoLoader();
        loader.printInfoData();

        int exitCode = new CommandLine(new Main()).execute(args);
        System.exit(exitCode);
    }

    @Override
    public void run() {
        try {
            showCurrentTime();
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            System.exit(1);
        }
    }

    private void showCurrentTime() {
        // 인사말 선택
        String greeting = getGreeting();

        // 시간대 설정
        ZoneId zoneId = getZoneId();

        // 로케일 설정
        Locale userLocale = getLocale();

        // 현재 시간 가져오기
        LocalDateTime now = LocalDateTime.now(zoneId);

        // 포맷 설정
        DateTimeFormatter formatter = getFormatter(userLocale);
        String formattedTime = now.format(formatter);

        // 이모지 추가
        String timeEmoji = showEmoji ? getTimeEmoji(now.getHour()) : "";
        String zoneEmoji = showEmoji ? getZoneEmoji(zoneId.getId()) : "";

        // 출력
        System.out.println();
        System.out.println("👋 " + greeting + "!");
        System.out.println();
        System.out.println(timeEmoji + " Current time: " + formattedTime);
        System.out.println(zoneEmoji + " Timezone: " + zoneId.getId());

        if (showEmoji) {
            System.out.println();
            System.out.println(getDayMessage(now));
        }

        System.out.println();
    }

    private String getGreeting() {
        LocalDateTime now = LocalDateTime.now();
        int hour = now.getHour();

        if (hour < 6) return "Good night";
        else if (hour < 12) return "Good morning";
        else if (hour < 18) return "Good afternoon";
        else return "Good evening";
    }

    private ZoneId getZoneId() {
        if ("system".equals(timezone)) {
            return ZoneId.systemDefault();
        }

        try {
            return ZoneId.of(timezone);
        } catch (Exception e) {
            System.err.println("⚠️  Invalid timezone: " + timezone + ". Using system default.");
            return ZoneId.systemDefault();
        }
    }

    private Locale getLocale() {
        if ("system".equals(locale)) {
            return Locale.getDefault();
        }

        try {
            String[] parts = locale.split("-");
            if (parts.length == 2) {
                return new Locale(parts[0], parts[1]);
            } else {
                return new Locale(locale);
            }
        } catch (Exception e) {
            System.err.println("⚠️  Invalid locale: " + locale + ". Using system default.");
            return Locale.getDefault();
        }
    }

    private DateTimeFormatter getFormatter(Locale userLocale) {
        switch (format.toLowerCase()) {
            case "full":
                return DateTimeFormatter.ofLocalizedDateTime(FormatStyle.FULL).withLocale(userLocale);
            case "long":
                return DateTimeFormatter.ofLocalizedDateTime(FormatStyle.LONG).withLocale(userLocale);
            case "short":
                return DateTimeFormatter.ofLocalizedDateTime(FormatStyle.SHORT).withLocale(userLocale);
            case "iso":
                return DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            case "custom":
                return DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss E", userLocale);
            default: // medium
                return DateTimeFormatter.ofLocalizedDateTime(FormatStyle.MEDIUM).withLocale(userLocale);
        }
    }

    private String getTimeEmoji(int hour) {
        if (hour >= 6 && hour < 12) return "🌅";      // 아침
        else if (hour >= 12 && hour < 18) return "☀️";  // 오후
        else if (hour >= 18 && hour < 22) return "🌆";  // 저녁
        else return "🌙";                               // 밤
    }

    private String getZoneEmoji(String zoneId) {
        if (zoneId.contains("Seoul") || zoneId.contains("Asia")) return "🇰🇷";
        else if (zoneId.contains("Tokyo")) return "🇯🇵";
        else if (zoneId.contains("New_York") || zoneId.contains("America")) return "🇺🇸";
        else if (zoneId.contains("London") || zoneId.contains("Europe")) return "🇬🇧";
        else if (zoneId.contains("UTC")) return "🌍";
        else return "🌐";
    }

    private String getDayMessage(LocalDateTime now) {
        String dayOfWeek = now.getDayOfWeek().toString().toLowerCase();

        switch (dayOfWeek) {
            case "monday":
                return "💪 Happy Monday! Start your week strong!";
            case "tuesday":
                return "🚀 Tuesday vibes! Keep going!";
            case "wednesday":
                return "⚡ Hump day! You're halfway there!";
            case "thursday":
                return "🌟 Thursday energy! Almost weekend!";
            case "friday":
                return "🎉 TGIF! Weekend is coming!";
            case "saturday":
                return "😎 Saturday chill! Enjoy your weekend!";
            case "sunday":
                return "☕ Sunday relaxation! Rest and recharge!";
            default:
                return "✨ Have a wonderful day!";
        }
    }
}