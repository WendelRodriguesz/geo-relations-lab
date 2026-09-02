package io.github.wendelrodriguesz.geo_relations_lab_backend.helloworld.service;

import io.github.wendelrodriguesz.geo_relations_lab_backend.helloworld.entity.User;
import org.springframework.stereotype.Service;

@Service
public class HelloWorldService {
    private int nextId = 0;
    private User users[] = new User[5];

    public User getUser(String id) {
        for (int i = 0; i < users.length; i++) {
            if (users[i] != null && users[i].getId().equals(id)) {
                return users[i];
            }
        }
        return null;
    }

    public User[] getUsers() {
        return users;
    }

    public User createUser(User user) {
        user.setId(String.valueOf(nextId++));
        users[nextId - 1] = user;
        return user;
    }

    public User updateUser(String id, User user) {
        for (int i = 0; i < users.length; i++) {
            if (users[i] != null && users[i].getId().equals(id)) {
                users[i] = user;
                users[i].setId(id);
                return user;
            }
        }
        return null;
    }
}
