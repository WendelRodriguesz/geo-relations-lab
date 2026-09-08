package io.github.wendelrodriguesz.georelationslab.zona.dto;

import io.github.wendelrodriguesz.georelationslab.zona.model.Coordenada;

import java.util.List;

public record ZonaUpdateRequest(
        String nome,
        String cor,
        List<Coordenada> coordenadas
){}