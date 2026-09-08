package io.github.wendelrodriguesz.georelationslab.zona.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Table(name = "zonas")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
public class Zona {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String cor = "#2563eb";

    @ElementCollection // esta coleção contém valores, e não outras Entities.
    @CollectionTable( // armazene a coleção nesta tabela separada e vincule-a à Zona por zona_id.
            name = "coordenadas",
            joinColumns = @JoinColumn(name = "zona_id")
    )
    @OrderColumn(name = "ordem") // garante que a ordem das coordenadas seja preservada na lista.
    private List<Coordenada> coordenadas;

    public Zona(String nome, String cor, List<Coordenada> coordenadas) {
        this.nome = nome;
        this.cor = cor;
        this.coordenadas = coordenadas;
    }

    public void atualizar(String nome, String cor, List<Coordenada> coordenadas) {
        this.nome = nome != null ? nome : this.nome;
        this.cor = cor != null ? cor : this.cor;
        this.coordenadas = coordenadas != null ? coordenadas : this.coordenadas;
    }
}
