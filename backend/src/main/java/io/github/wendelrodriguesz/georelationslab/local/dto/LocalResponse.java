package io.github.wendelrodriguesz.georelationslab.local.dto;

import io.github.wendelrodriguesz.georelationslab.local.model.TipoLocal;
import java.util.UUID;

public record LocalResponse(
    UUID id,
    String nome,
    String descricao,
    TipoLocal tipo,
    Double longitude,
    Double latitude
) {}
