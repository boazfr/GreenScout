package com.greenscout.api.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class JtsSerializationConfig {
    // JTS Point serialization is now handled by ActivityLocationDto.
    // The broken com.bedatadriven:jackson-datatype-jts dependency has been removed.
}
