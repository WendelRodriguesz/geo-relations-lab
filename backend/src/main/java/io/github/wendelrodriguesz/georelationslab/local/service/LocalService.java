package io.github.wendelrodriguesz.georelationslab.local.service;

import io.github.wendelrodriguesz.georelationslab.exception.BusinessConflictException;
import io.github.wendelrodriguesz.georelationslab.exception.ResourceNotFoundException;
import io.github.wendelrodriguesz.georelationslab.local.dto.LocalCreateRequest;
import io.github.wendelrodriguesz.georelationslab.local.dto.LocalResponse;
import io.github.wendelrodriguesz.georelationslab.local.dto.LocalUpdateRequest;
import io.github.wendelrodriguesz.georelationslab.local.model.Local;
import io.github.wendelrodriguesz.georelationslab.local.repository.LocalRepository;
import io.github.wendelrodriguesz.georelationslab.relacao.repository.RelacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LocalService {
    private final LocalRepository localRepository;
    private final RelacaoRepository relacaoRepository;

    private LocalResponse toResponse(Local local) {
        return new LocalResponse(
                local.getId(),
                local.getNome(),
                local.getDescricao(),
                local.getTipo(),
                local.getLongitude(),
                local.getLatitude()
        );
    }

    private Local toEntity(LocalCreateRequest request) {
        return new Local(
                request.nome(),
                request.descricao(),
                request.tipo(),
                request.longitude(),
                request.latitude()
        );
    }

    @Transactional()
    public LocalResponse criar(LocalCreateRequest request) {
        Local local = toEntity(request);
        Local salvo = localRepository.save(local);
        return toResponse(salvo);
    }

    @Transactional(readOnly = true)
    public List<LocalResponse> verLocais(){
        return localRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public LocalResponse verLocalPorId(UUID id){
        Local local = localRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Local não encontrado"
                ));
        return toResponse(local);
    }

    @Transactional()
    public LocalResponse atualizar(UUID id, LocalUpdateRequest request){
        Local localAntigo = localRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Local não encontrado"
                ));

        // Atualize os dados do objeto existente
        localAntigo.atualizar(
                request.nome(),
                request.descricao(),
                request.tipo(),
                request.longitude(),
                request.latitude()
        );

        // O metodo save() fará o UPDATE no banco
        Local localAtualizado = localRepository.save(localAntigo);

        return toResponse(localAtualizado);
    }

    @Transactional()
    public void deletar(UUID id) {
        Local local = localRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Local não encontrado"
                ));

        boolean possuiRelacoes =
                relacaoRepository.existsByOrigem_IdOrDestino_Id(id, id);

        if (possuiRelacoes) {
            throw new BusinessConflictException(
                    "Não é possível excluir o local porque existem relações vinculadas a ele"
            );
        }

        localRepository.delete(local);
    }
}
