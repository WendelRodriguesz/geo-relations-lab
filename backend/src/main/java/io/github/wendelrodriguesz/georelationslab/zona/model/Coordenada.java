package io.github.wendelrodriguesz.georelationslab.zona.model;

import jakarta.persistence.Embeddable;
import lombok.Getter;

@Getter
@Embeddable // Coordenada pode fazer parte do estado persistente de outra Entity.
public class Coordenada {
    private Double longitude;
    private Double latitude;
}
