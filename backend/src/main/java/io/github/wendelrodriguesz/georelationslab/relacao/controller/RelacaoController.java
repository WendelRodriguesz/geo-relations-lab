package io.github.wendelrodriguesz.georelationslab.relacao.controller;

import io.github.wendelrodriguesz.georelationslab.relacao.dto.RelacaoCreateRequest;
import io.github.wendelrodriguesz.georelationslab.relacao.dto.RelacaoResponse;
import io.github.wendelrodriguesz.georelationslab.relacao.dto.RelacaoUpdateRequest;
import io.github.wendelrodriguesz.georelationslab.relacao.service.RelacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/relacoes")
@RequiredArgsConstructor
public class RelacaoController {
    private final RelacaoService relacaoService;

    @GetMapping()
    public List<RelacaoResponse> listarRelacoes() {
        return relacaoService.listarRelacoes();
    }

    @PostMapping()
    public RelacaoResponse criarRelacao(@Valid @RequestBody RelacaoCreateRequest request) {
        return relacaoService.criarRelacao(request);
    }

    @PatchMapping("/{id}")
    public RelacaoResponse atualizarRelacao(@PathVariable UUID id, @Valid @RequestBody RelacaoUpdateRequest request) {
        return relacaoService.atualizarRelacao(id, request);
    }

    @DeleteMapping("/{id}")
    public void deletarRelacao(@PathVariable UUID id) {
        relacaoService.deletarRelacao(id);
    }

    @GetMapping("/{id}")
    public RelacaoResponse verRelacaoPorId(@PathVariable UUID id) {
        return relacaoService.verRelacaoPorId(id);
    }

    @GetMapping("/origem/{origemId}")
    public List<RelacaoResponse> verRelacaoPorOrigem(@PathVariable UUID origemId) {
        return relacaoService.verRelacaoPorOrigem(origemId);
    }

    @GetMapping("/destino/{destinoId}")
    public List<RelacaoResponse> verRelacaoPorDestino(@PathVariable UUID destinoId) {
        return relacaoService.verRelacaoPorDestino(destinoId);
    }

    @GetMapping("/origem-destino/{origemId}/{destinoId}")
    public List<RelacaoResponse> verRelacaoPorOrigemEDestino(@PathVariable UUID origemId, @PathVariable UUID destinoId) {
        return relacaoService.verRelacaoPorOrigemEDestino(origemId, destinoId);
    }

}
