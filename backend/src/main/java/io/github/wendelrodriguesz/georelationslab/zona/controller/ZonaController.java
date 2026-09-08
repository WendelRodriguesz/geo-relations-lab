package io.github.wendelrodriguesz.georelationslab.zona.controller;

import io.github.wendelrodriguesz.georelationslab.zona.dto.ZonaCreateRequest;
import io.github.wendelrodriguesz.georelationslab.zona.dto.ZonaResponse;
import io.github.wendelrodriguesz.georelationslab.zona.dto.ZonaUpdateRequest;
import io.github.wendelrodriguesz.georelationslab.zona.service.ZonaService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(
        name = "Zonas",
        description = "Operações de gerenciamento de zonas geográficas"
)
@RestController
@RequestMapping("/zonas")
@RequiredArgsConstructor
public class ZonaController {
    private final ZonaService zonaService;

    @ResponseStatus(HttpStatus.CREATED)
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

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public void deletarZona(@PathVariable UUID id) {
        zonaService.deletarZona(id);
    }
}
