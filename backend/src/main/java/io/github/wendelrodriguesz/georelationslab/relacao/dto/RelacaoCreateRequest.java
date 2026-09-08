package io.github.wendelrodriguesz.georelationslab.relacao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record RelacaoCreateRequest(
        @NotBlank(message = "O nome é obrigatório")
        String nome,

        String descricao,
        String tipo,
        String cor,

        @NotNull(message = "O ID de origem é obrigatório")
        UUID origemId,

        @NotNull(message = "O ID de destino é obrigatório")
        UUID destinoId
) {
}
