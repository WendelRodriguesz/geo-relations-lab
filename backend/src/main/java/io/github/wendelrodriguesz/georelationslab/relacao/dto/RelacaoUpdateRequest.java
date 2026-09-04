package io.github.wendelrodriguesz.georelationslab.relacao.dto;

import io.github.wendelrodriguesz.georelationslab.relacao.model.TipoRelacao;

import java.util.UUID;

public record RelacaoUpdateRequest(
        UUID id,
        String nome,
        String descricao,
        TipoRelacao tipo,
        String cor,
        UUID origemId,
        UUID destinoId
) {
}
