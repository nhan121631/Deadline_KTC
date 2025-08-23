package com.example.backend_deadline;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class BackendDeadlineApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendDeadlineApplication.class, args);
	}

}
