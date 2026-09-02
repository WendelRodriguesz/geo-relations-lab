package io.github.wendelrodriguesz.geo_relations_lab_backend.helloworld.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class User {
    private String id;
    private String name;
    private String email;
}
