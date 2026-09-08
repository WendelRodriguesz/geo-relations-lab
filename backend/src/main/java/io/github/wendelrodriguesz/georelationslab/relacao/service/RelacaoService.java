package io.github.wendelrodriguesz.georelationslab.relacao.service;

import io.github.wendelrodriguesz.georelationslab.exception.ResourceNotFoundException;
import io.github.wendelrodriguesz.georelationslab.local.model.Local;
import io.github.wendelrodriguesz.georelationslab.local.repository.LocalRepository;
import io.github.wendelrodriguesz.georelationslab.relacao.dto.RelacaoCreateRequest;
import io.github.wendelrodriguesz.georelationslab.relacao.dto.RelacaoResponse;
import io.github.wendelrodriguesz.georelationslab.relacao.dto.RelacaoUpdateRequest;
import io.github.wendelrodriguesz.georelationslab.relacao.model.Relacao;
import io.github.wendelrodriguesz.georelationslab.relacao.repository.RelacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.awt.*;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RelacaoService {
    private final RelacaoRepository relacaoRepository;
    private final LocalRepository localRepository;

    private RelacaoResponse toResponse(Relacao relacao) {
        return new RelacaoResponse(relacao.getId(), relacao.getNome(), relacao.getDescricao(), relacao.getTipo(), relacao.getCor(), relacao.getOrigem().getId(), relacao.getDestino().getId());
    }

    private Local buscarLocal(UUID id, String mensagem) {
        return localRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException( mensagem));
    }

    private record LocaisRelacao(Local origem, Local destino) {
    }

    private LocaisRelacao buscarEValidarLocais(UUID origemId, UUID destinoId) {
        if (origemId.equals(destinoId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Origem e destino não podem ser iguais");
        }

        Local origem = buscarLocal(origemId, "Local de origem não encontrado");

        Local destino = buscarLocal(destinoId, "Local de destino não encontrado");

        return new LocaisRelacao(origem, destino);
    }

    @Transactional(readOnly = true)
    public List<RelacaoResponse> listarRelacoes() {
        return relacaoRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public RelacaoResponse verRelacaoPorId(UUID id) {
        Relacao relacao = relacaoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Relação não encontrada"));
        return toResponse(relacao);
    }

    @Transactional(readOnly = true)
    public List<RelacaoResponse> verRelacaoPorOrigem(UUID origemId) {
        return relacaoRepository.findByOrigem_Id(origemId).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<RelacaoResponse> verRelacaoPorDestino(UUID destinoId) {
        return relacaoRepository.findByDestino_Id(destinoId).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<RelacaoResponse> verRelacaoPorOrigemEDestino(UUID origemId, UUID destinoId) {
        return relacaoRepository.findByOrigem_IdAndDestino_Id(origemId, destinoId).stream().map(this::toResponse).toList();
    }

    @Transactional
    public RelacaoResponse criarRelacao(RelacaoCreateRequest request) {

        LocaisRelacao locais = buscarEValidarLocais(request.origemId(), request.destinoId());

        if (relacaoRepository.existsByOrigem_IdAndDestino_Id(locais.origem.getId(), locais.destino.getId())) {
            throw new ResourceNotFoundException( "Já existe uma relação entre esses locais");
        }

        Relacao relacao = new Relacao(request.nome(), request.descricao(), request.tipo(), request.cor(), locais.origem(), locais.destino());

        Relacao salva = relacaoRepository.save(relacao);

        return toResponse(salva);
    }

    @Transactional
    public RelacaoResponse atualizarRelacao(UUID id, RelacaoUpdateRequest request) {
        Relacao relacao = relacaoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException( "Relação não encontrada"));
        LocaisRelacao locais = buscarEValidarLocais(request.origemId() != null ? request.origemId() : relacao.getOrigem().getId(), request.destinoId() != null ? request.destinoId() : relacao.getDestino().getId());

        if (relacaoRepository.existsByOrigem_IdAndDestino_IdAndIdNot(locais.origem().getId(),
                locais.destino().getId(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe uma relação entre esses locais");
        }

        relacao.atualizar(request.nome(), request.descricao(), request.tipo(), request.cor(), locais.origem(), locais.destino());

        return toResponse(relacao);
    }

    @Transactional
    public void deletarRelacao(UUID id) {
        Relacao relacao = relacaoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException( "Relação não encontrada"));
        relacaoRepository.delete(relacao);
    }
}
