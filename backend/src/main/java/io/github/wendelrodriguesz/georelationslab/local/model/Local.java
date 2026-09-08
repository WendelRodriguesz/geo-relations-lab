package io.github.wendelrodriguesz.georelationslab.local.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity // Registra como tipo persistente JPA
@Table(name = "locais") // Definide o nome da tabela do DB
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Local {
    @Id                         // Define a PK
    @GeneratedValue(strategy = GenerationType.UUID)
   private UUID id;

    @Column(nullable = false)
   private String nome;

   private String descricao;

    @Column(nullable = false)
   private String tipo = "NAO_INFORMADO";

    @Column(nullable = false)
   private Double longitude;

    @Column(nullable = false)
   private Double latitude;

    public Local(String nome, String descricao, String tipo, Double longitude, Double latitude) {
        this.nome = nome;
        this.descricao = descricao;
        this.tipo = tipo != null ? tipo : "NAO_INFORMADO";
        this.longitude = longitude;
        this.latitude = latitude;
    }

    public void atualizar(
            String nome,
            String descricao,
            String tipo,
            Double longitude,
            Double latitude
    ) {
        this.nome = nome != null ? nome : this.nome;
        this.descricao = descricao != null ? descricao : this.descricao;
        this.tipo = tipo != null ? tipo : this.tipo;
        this.longitude = longitude != null ? longitude : this.longitude;
        this.latitude = latitude != null ? latitude : this.latitude;
    }
}
