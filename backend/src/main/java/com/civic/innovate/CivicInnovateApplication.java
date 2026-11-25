package com.civic.innovate;

import com.civic.innovate.service.AuthService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CivicInnovateApplication {

    public static void main(String[] args) {
        SpringApplication.run(CivicInnovateApplication.class, args);
    }

    @Bean
    CommandLineRunner bootstrapOfficial(AuthService authService) {
        return args -> authService.bootstrapOfficialAccount();
    }
}