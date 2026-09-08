package io.github.wendelrodriguesz.georelationslab.local.controller;

import io.github.wendelrodriguesz.georelationslab.local.dto.LocalCreateRequest;
import io.github.wendelrodriguesz.georelationslab.local.dto.LocalResponse;
import io.github.wendelrodriguesz.georelationslab.local.dto.LocalUpdateRequest;
import io.github.wendelrodriguesz.georelationslab.local.service.LocalService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(
        name = "Locais",
        description = "Operações de cadastro e gerenciamento de locais"
)
@RestController
@RequestMapping("/locais")
@RequiredArgsConstructor // O Lombok cria o construtor automaticamente
public class LocalController {
    private final LocalService localService;

    @GetMapping
    public List<LocalResponse> verLocais() {
        return localService.verLocais();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public LocalResponse criarLocal(@Valid @RequestBody LocalCreateRequest request){
        return localService.criar(request);
    }

    @GetMapping("/{id}")
    public LocalResponse verLocalPorId(@PathVariable UUID id){
        return localService.verLocalPorId(id);
    }

    @PatchMapping("/{id}")
    public LocalResponse atualizarLocal(@PathVariable UUID id, @RequestBody LocalUpdateRequest request){
        return localService.atualizar(id, request);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarLocal(@PathVariable UUID id) {
        localService.deletar(id);

        return ResponseEntity.noContent().build();
    }
}
