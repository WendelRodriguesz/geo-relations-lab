package io.github.wendelrodriguesz.georelationslab.local.repository;

import io.github.wendelrodriguesz.georelationslab.local.model.Local;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface LocalRepository extends JpaRepository<Local, UUID> {

}
