package io.github.wendelrodriguesz.georelationslab.local.dto;

import io.github.wendelrodriguesz.georelationslab.local.model.TipoLocal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LocalCreateRequest(
        @NotBlank(message = "O nome do local não pode ser nulo ou vazio")
    String nome,

    String descricao,

    TipoLocal tipo,

    @NotNull(message = "A longitude do local não pode ser nula")
    Double longitude,
    @NotNull(message = "A latitude do local não pode ser nula")
    Double latitude
) {}
