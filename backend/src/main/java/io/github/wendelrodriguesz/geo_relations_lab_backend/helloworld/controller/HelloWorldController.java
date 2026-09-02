package io.github.wendelrodriguesz.geo_relations_lab_backend.helloworld.controller;

import io.github.wendelrodriguesz.geo_relations_lab_backend.helloworld.entity.User;
import io.github.wendelrodriguesz.geo_relations_lab_backend.helloworld.service.HelloWorldService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/hello-world")
public class HelloWorldController {
    @Autowired
    private HelloWorldService helloWorldService;

    @GetMapping
    public User[] helloWorldGet() {
        return helloWorldService.getUsers();
    }

    @PostMapping
    public User helloWorldPost(@RequestBody User user) {
        return helloWorldService.createUser(user);
    }

    @GetMapping("/{id}")
    public User helloWorld(@PathVariable String id) {
        return helloWorldService.getUser(id);
    }
    @PutMapping("/{id}")
    public User helloWorldPut(@PathVariable String id, @RequestBody User user) {
        return helloWorldService.updateUser(id, user);
    }
}
