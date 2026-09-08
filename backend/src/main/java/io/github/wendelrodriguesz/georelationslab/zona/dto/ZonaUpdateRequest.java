package io.github.wendelrodriguesz.georelationslab.zona.dto;

import java.util.List;

import io.github.wendelrodriguesz.georelationslab.zona.model.Coordenada;
import jakarta.validation.constraints.Size;

public record ZonaUpdateRequest(
        String nome,
        String cor,
        @Size(
                min = 3,
                message = "A zona deve possuir pelo menos 3 coordenadas"
        )
        List<Coordenada> coordenadas
        ) {

}
