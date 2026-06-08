package com.lms.lmsservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@org.springframework.cloud.client.discovery.EnableDiscoveryClient
public class LmsServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(LmsServiceApplication.class, args);
	}

}
