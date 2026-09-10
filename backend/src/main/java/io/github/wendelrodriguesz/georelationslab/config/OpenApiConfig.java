package io.github.wendelrodriguesz.georelationslab.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @io.swagger.v3.oas.annotations.info.Info(
                title = "Geo Relations Lab API",
                version = "1.0.0",
                description = """
                        API REST do Geo Relations Lab responsável pela persistência
                        e gerenciamento de locais, relações e zonas geográficas.

                        O backend utiliza Spring Boot, Spring Data JPA/Hibernate e
                        PostgreSQL, substituindo a persistência anteriormente simulada
                        pelo JSON Server.

                        As relações referenciam os locais de origem e destino, enquanto
                        as zonas armazenam coordenadas ordenadas utilizadas para
                        reconstrução dos polígonos no frontend.
                        """,
                contact = @Contact(
                        name = "Wendel Rodrigues"
                )
        )
)
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