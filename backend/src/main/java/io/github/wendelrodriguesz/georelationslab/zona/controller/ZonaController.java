package io.github.wendelrodriguesz.georelationslab.zona.controller;

import io.github.wendelrodriguesz.georelationslab.zona.dto.ZonaCreateRequest;
import io.github.wendelrodriguesz.georelationslab.zona.dto.ZonaResponse;
import io.github.wendelrodriguesz.georelationslab.zona.dto.ZonaUpdateRequest;
import io.github.wendelrodriguesz.georelationslab.zona.service.ZonaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/zonas")
@RequiredArgsConstructor
public class ZonaController {
    private final ZonaService zonaService;

    @PostMapping
    public ZonaResponse criarZOna(@Valid @RequestBody ZonaCreateRequest request) {
        return zonaService.criarZona(request);
    }

    @GetMapping
    public List<ZonaResponse> listarTodasAsZonas() {
        return zonaService.listarTodasAsZonas();
    }

    @GetMapping("/{id}")
    public ZonaResponse verZonaPorId(@PathVariable UUID id) {
        return zonaService.verZonaPorId(id);
    }

    @PatchMapping("/{id}")
    public ZonaResponse atualizarZona(@PathVariable UUID id, @RequestBody ZonaUpdateRequest request){
        return zonaService.atualizarZona(id, request);
    }

    @DeleteMapping("/{id}")
    public void deletarZona(@PathVariable UUID id) {
        zonaService.deletarZona(id);
    }
}
