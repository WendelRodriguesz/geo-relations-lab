package io.github.wendelrodriguesz.georelationslab.zona.dto;

import java.util.List;
import java.util.UUID;

public record ZonaResponse(
        UUID id,
        String nome,
        String cor,
        List<CoordenadaResponse> coordenadas
){ }
