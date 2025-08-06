package com.lifegroups.aplicativo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.lifegroups.aplicativo")
public class AplicativoApplication {

    public static void main(String[] args) {
        SpringApplication.run(AplicativoApplication.class, args);
    }
}