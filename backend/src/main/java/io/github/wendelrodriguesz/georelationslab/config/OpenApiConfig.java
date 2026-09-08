package io.github.wendelrodriguesz.georelationslab.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI geoRelationsOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Geo Relations Lab API")
                        .description(
                                "API REST para persistência de locais, relações e zonas geográficas."
                        )
                        .version("1.0.0")
                );
    }
}