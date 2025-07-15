package com.hellotimeman;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class BuildInfoLoader {
    public void printInfoData() {
        try (InputStream input = Main.class.getResourceAsStream("/build.properties")) {
            if (input != null) {
                Properties properties = new Properties();
                properties.load(input);

                String version = properties.getProperty("version", "unknown");
                String buildTime = properties.getProperty("buildTime", "unknown");

                System.setProperty("app.version", version);
                System.setProperty("app.buildTime", buildTime);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
