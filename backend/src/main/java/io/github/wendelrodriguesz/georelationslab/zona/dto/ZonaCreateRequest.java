package io.github.wendelrodriguesz.georelationslab.zona.dto;

import io.github.wendelrodriguesz.georelationslab.zona.model.Coordenada;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ZonaCreateRequest(
        @NotEmpty(message = "O nome da zona não pode ser vazio")
        String nome,

        String cor,

        @NotNull(message = "As coordenadas da zona não podem ser nulas")
        List<Coordenada> coordenadas
){ }
