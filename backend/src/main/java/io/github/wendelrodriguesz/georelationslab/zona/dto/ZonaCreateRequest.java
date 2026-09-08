package io.github.wendelrodriguesz.georelationslab.zona.dto;

import java.util.List;

import io.github.wendelrodriguesz.georelationslab.zona.model.Coordenada;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ZonaCreateRequest(
        @NotEmpty(message = "O nome da zona não pode ser vazio")
        String nome,
        String cor,

        @NotNull(message = "As coordenadas da zona não podem ser nulas")
        @Size(
                min = 3,
                message = "A zona deve possuir pelo menos 3 coordenadas"
        )
        List<Coordenada> coordenadas
        ) {

}
