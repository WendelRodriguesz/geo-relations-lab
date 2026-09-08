package io.github.wendelrodriguesz.georelationslab.relacao.model;

import io.github.wendelrodriguesz.georelationslab.local.model.Local;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;


@Entity
@Table(
        name = "relacoes",
        uniqueConstraints = {
                @UniqueConstraint( // Só exite uma relação entre dois locais, na mesma direção (atualmente) A,B != B,A
                        name = "uk_relacoes_origem_destino",
                        columnNames = {"origem_id", "destino_id"}
                )
        }
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Relacao {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome;

    private String descricao;

    @Column(nullable = false)
    private String tipo = "NAO_INFORMADO";

    @Column(nullable = false)
    private String cor = "#2563eb";

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "origem_id", nullable = false)
    private Local origem;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "destino_id", nullable = false)
    private Local destino;

    public Relacao(String nome, String descricao, String tipo, String cor, Local origem, Local destino) {
        this.nome = nome;
        this.descricao = descricao;
        this.tipo = tipo != null ? tipo : "NAO_INFORMADO";
        this.cor = cor != null ? cor : "#2563eb";
        this.origem = origem;
        this.destino = destino;
    }

    public void atualizar(String nome, String descricao, String tipo, String cor, Local origem, Local destino) {
        this.nome = nome != null ? nome : this.nome;
        this.descricao = descricao != null ? descricao : this.descricao;
        this.tipo = tipo != null ? tipo : this.tipo;
        this.cor = cor != null ? cor : this.cor;
        this.origem = origem != null ? origem : this.origem;
        this.destino = destino != null ? destino : this.destino;
    }
}
