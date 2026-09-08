package io.github.wendelrodriguesz.georelationslab.relacao.dto;

import java.util.UUID;


public record RelacaoResponse(
        UUID id,
        String nome,
        String descricao,
        String tipo,
        String cor,
        UUID origemId,
        UUID destinoId
) {
}
