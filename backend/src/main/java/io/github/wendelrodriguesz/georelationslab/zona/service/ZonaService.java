package io.github.wendelrodriguesz.georelationslab.zona.service;

import io.github.wendelrodriguesz.georelationslab.exception.ResourceNotFoundException;
import io.github.wendelrodriguesz.georelationslab.zona.dto.CoordenadaResponse;
import io.github.wendelrodriguesz.georelationslab.zona.dto.ZonaCreateRequest;
import io.github.wendelrodriguesz.georelationslab.zona.dto.ZonaResponse;
import io.github.wendelrodriguesz.georelationslab.zona.dto.ZonaUpdateRequest;
import io.github.wendelrodriguesz.georelationslab.zona.model.Zona;
import io.github.wendelrodriguesz.georelationslab.zona.repository.ZonaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class ZonaService {
    private final ZonaRepository zonaRepository;

    private ZonaResponse toResponse(Zona zona) {
        List<CoordenadaResponse> coordenadas = zona.getCoordenadas()
                .stream()
                .map(coordenada -> new CoordenadaResponse(
                        coordenada.getLongitude(),
                        coordenada.getLatitude()
                ))
                .toList();

        return new ZonaResponse(
                zona.getId(),
                zona.getNome(),
                zona.getCor(),
                coordenadas
        );
    }

    @Transactional
    public ZonaResponse criarZona(ZonaCreateRequest request) {
        Zona zona = new Zona(request.nome(), request.cor(), request.coordenadas());
        Zona savedZona = zonaRepository.save(zona);
        return toResponse(savedZona);
    }

    @Transactional(readOnly = true)
    public List<ZonaResponse> listarTodasAsZonas() {
        return zonaRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ZonaResponse verZonaPorId(UUID id) {
        Zona zona = zonaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(
                        "Zona não encontrada"
                ));
        return toResponse(zona);
    }

    @Transactional
    public ZonaResponse atualizarZona(UUID id, ZonaUpdateRequest request) {
        Zona zona = zonaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(
                        "Zona não encontrada"
                ));
        zona.atualizar(request.nome(), request.cor(), request.coordenadas());
        Zona updatedZona = zonaRepository.save(zona);
        return toResponse(updatedZona);
    }

    @Transactional
    public void deletarZona(UUID id) {
        Zona zona = zonaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(
                        "Zona não encontrada"
                ));
        zonaRepository.delete(zona);
    }
}
