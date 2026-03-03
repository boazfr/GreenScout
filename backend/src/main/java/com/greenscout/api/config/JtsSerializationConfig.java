package com.greenscout.api.config;

import com.bedatadriven.jackson.datatype.jts.JtsModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JtsSerializationConfig {

    @Bean
    public JtsModule jtsModule() {
        return new JtsModule();
    }
}
