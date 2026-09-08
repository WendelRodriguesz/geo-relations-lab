package io.github.wendelrodriguesz.georelationslab.zona.repository;


import io.github.wendelrodriguesz.georelationslab.zona.model.Zona;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ZonaRepository extends JpaRepository<Zona, UUID> {
}
