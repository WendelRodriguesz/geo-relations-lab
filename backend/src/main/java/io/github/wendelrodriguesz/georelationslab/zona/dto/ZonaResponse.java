package io.github.wendelrodriguesz.georelationslab.zona.dto;

import io.github.wendelrodriguesz.georelationslab.zona.model.Coordenada;

import java.util.List;
import java.util.UUID;

public record ZonaResponse(
        UUID id,
        String nome,
        String cor,
        List<CoordenadaResponse> coordenadas
){ }
