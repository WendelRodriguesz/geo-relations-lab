package io.github.wendelrodriguesz.georelationslab.relacao.repository;

import io.github.wendelrodriguesz.georelationslab.relacao.model.Relacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RelacaoRepository extends JpaRepository<Relacao, UUID> {
    List<Relacao> findByOrigem_Id(UUID origemId);

    List<Relacao> findByDestino_Id(UUID destinoId);

    List<Relacao> findByOrigem_IdAndDestino_Id(UUID origemId, UUID destinoId);

    boolean existsByOrigem_IdAndDestino_Id(UUID origemId, UUID destinoId); // ver se existe uma relação duplicada

    boolean existsByOrigem_IdAndDestino_IdAndIdNot(UUID origemId, UUID destinoId, UUID id);
}
