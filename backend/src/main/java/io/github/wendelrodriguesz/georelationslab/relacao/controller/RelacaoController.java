package io.github.wendelrodriguesz.georelationslab.relacao.controller;

import io.github.wendelrodriguesz.georelationslab.relacao.dto.RelacaoCreateRequest;
import io.github.wendelrodriguesz.georelationslab.relacao.dto.RelacaoResponse;
import io.github.wendelrodriguesz.georelationslab.relacao.dto.RelacaoUpdateRequest;
import io.github.wendelrodriguesz.georelationslab.relacao.service.RelacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(
        name = "Relações",
        description = "Gerenciamento das relações entre locais cadastrados."
)
@RestController
@RequestMapping("/relacoes")
@RequiredArgsConstructor
public class RelacaoController {
    private final RelacaoService relacaoService;

    @GetMapping()
    public List<RelacaoResponse> listarRelacoes() {
        return relacaoService.listarRelacoes();
    }

    @Operation(
            summary = "Cria uma relação entre dois locais"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Relação criada com sucesso"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Dados da requisição inválidos"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Local de origem ou destino não encontrado"
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Origem e destino são iguais ou a relação já existe"
            )
    })
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping()
    public RelacaoResponse criarRelacao(@Valid @RequestBody RelacaoCreateRequest request) {
        return relacaoService.criarRelacao(request);
    }

    @PatchMapping("/{id}")
    public RelacaoResponse atualizarRelacao(@PathVariable UUID id, @RequestBody RelacaoUpdateRequest request) {
        return relacaoService.atualizarRelacao(id, request);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
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
