# Geo Relations Lab

Aplicação **Full Stack** para criação e visualização de relações entre pontos geográficos.

O sistema permite cadastrar locais diretamente em um mapa, criar relações entre eles, definir zonas geográficas e visualizar os mesmos dados tanto espacialmente, com **MapLibre**, quanto como um grafo utilizando **React Flow**.

O projeto possui frontend em **Next.js + React + TypeScript** e backend REST em **Java + Spring Boot**, com persistência em **PostgreSQL**.

## Funcionalidades

* cadastro de locais a partir de pontos selecionados no mapa;
* visualização de locais através de marcadores;
* criação de relações entre locais;
* representação das relações como linhas geográficas;
* criação de zonas através de polígonos;
* identificação de locais dentro de uma zona;
* visualização de locais e relações como grafo;
* CRUD REST de Locais, Relações e Zonas;
* persistência dos dados em PostgreSQL;
* validações e regras de negócio no backend;
* tratamento padronizado de erros HTTP;
* documentação da API com OpenAPI/Swagger.

## Tecnologias

### Frontend

* Next.js
* React
* TypeScript
* MapLibre GL JS
* React Flow
* Tailwind CSS
* shadcn/ui
* Radix UI

### Backend

* Java
* Spring Boot
* Spring Web / MVC
* Spring Data JPA
* Hibernate
* Jakarta Validation
* Lombok
* OpenAPI / Swagger
* PostgreSQL

## Arquitetura

```text
┌─────────────────────────────┐
│          Frontend           │
│ Next.js + React + TypeScript│
│ MapLibre + React Flow       │
└─────────────┬───────────────┘
              │ REST
              ▼
┌─────────────────────────────┐
│          Backend            │
│        Spring Boot          │
│                             │
│ Controller                  │
│     ↓                       │
│ Service                     │
│     ↓                       │
│ Repository                  │
└─────────────┬───────────────┘
              │ JPA / Hibernate
              ▼
┌─────────────────────────────┐
│         PostgreSQL          │
└─────────────────────────────┘
```

O domínio permanece independente das bibliotecas de visualização.

```text
PostgreSQL
    ↓
REST API
    ↓
Estado React
    ↓
Local / Relação / Zona
    ↓
┌─────────────┬─────────────┐
│             │             │
MapLibre   React Flow       UI
```

Dessa forma, objetos específicos de MapLibre ou React Flow não são armazenados como dados de domínio.

## Modelagem

### Local

Representa um ponto geográfico com nome, descrição, tipo, longitude e latitude.

### Relação

Conecta dois locais através de suas IDs.

As coordenadas não são duplicadas na relação: a linha exibida no mapa é derivada das coordenadas dos locais de origem e destino.

### Zona

Representa um polígono formado por uma lista ordenada de coordenadas.

A ordem dos pontos é preservada no banco para permitir a reconstrução correta da geometria no frontend.

## Regras implementadas

Entre as regras tratadas pelo backend:

* origem e destino de uma relação precisam existir;
* um local não pode se relacionar consigo mesmo;
* relações duplicadas são rejeitadas;
* um local relacionado não pode ser excluído enquanto possuir relações vinculadas;
* zonas precisam possuir coordenadas suficientes para formar um polígono válido;
* erros de validação, recursos inexistentes e conflitos possuem respostas HTTP específicas.

## API

Principais recursos:

```http
GET    /locais
POST   /locais
PATCH  /locais/{id}
DELETE /locais/{id}

GET    /relacoes
POST   /relacoes
PATCH  /relacoes/{id}
DELETE /relacoes/{id}

GET    /zonas
POST   /zonas
PATCH  /zonas/{id}
DELETE /zonas/{id}
```

Com o backend executando, a documentação interativa está disponível em:

```text
http://localhost:8080/swagger-ui.html
```

## Executando

### Requisitos

* Java
* PostgreSQL
* Node.js
* npm

### Backend

Configure as variáveis do banco:

```env
DB_URL=jdbc:postgresql://localhost:5432/geo_relations_lab
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
```

Execute:

```bash
cd backend
./mvnw spring-boot:run
```

Backend:

```text
http://localhost:8080
```

### Frontend

Configure:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Execute:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:3000
```

## O que este projeto demonstra

O Geo Relations Lab foi desenvolvido também como exercício prático de **Engenharia de Software e desenvolvimento Full Stack**, explorando:

* construção e consumo de APIs REST;
* integração frontend/backend;
* modelagem relacional;
* JPA e relacionamentos entre entidades;
* DTOs e separação entre API e persistência;
* validação em diferentes camadas;
* integridade referencial;
* transações e lazy loading;
* tratamento global de exceções com `ProblemDetail`;
* visualização e manipulação de dados geográficos;
* decisões arquiteturais evitando acoplamento entre domínio e interface;
* desenvolvimento incremental e organização em camadas.

## Autor

**Wendel Rodrigues**
Estudante de Engenharia de Software na Universidade Federal do Ceará (UFC) e Desenvolvedor Full Stack, com interesse principalmente em **Back-End, Java/Spring Boot, APIs, Engenharia de Software e aplicações web**.

[LinkedIn](https://linkedin.com/in/wendelrodriguesz) · [GitHub](https://github.com/WendelRodriguesz)
