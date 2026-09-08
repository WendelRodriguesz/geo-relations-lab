package io.github.wendelrodriguesz.georelationslab.local.dto;
import java.util.UUID;

public record LocalResponse(
    UUID id,
    String nome,
    String descricao,
    String tipo,
    Double longitude,
    Double latitude
) {}
