package io.github.wendelrodriguesz.georelationslab.local.dto;

import io.github.wendelrodriguesz.georelationslab.local.model.TipoLocal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LocalUpdateRequest(
    String nome,

    String descricao,

    TipoLocal tipo,

    Double longitude,
    Double latitude
) {}
