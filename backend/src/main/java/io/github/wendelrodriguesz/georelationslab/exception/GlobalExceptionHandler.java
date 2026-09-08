package io.github.wendelrodriguesz.georelationslab.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice // Procura exceções durante as requisições dos Controllers, e ve se essa classe sabe transformar
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class) // executa se a exceção for do tipo ResourceNotFoundException
    public ProblemDetail handleResourceNotFound(
            ResourceNotFoundException exception
    ) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND,
                exception.getMessage()
        );

        problem.setTitle("Recurso não encontrado");

        return problem;
    }
}