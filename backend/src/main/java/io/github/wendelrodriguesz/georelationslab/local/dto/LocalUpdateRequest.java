package io.github.wendelrodriguesz.georelationslab.local.dto;


public record LocalUpdateRequest(
    String nome,

    String descricao,

    String tipo,

    Double longitude,
    Double latitude
) {}
