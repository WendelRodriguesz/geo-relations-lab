# Geo Relations Lab

Aplicação web desenvolvida como projeto de estudo e portfólio para explorar **interfaces geoespaciais e visualização de relacionamentos** utilizando React e TypeScript.

O projeto combina um mapa interativo com cadastro de locais, zonas geográficas e relações entre pontos, permitindo representar os mesmos dados tanto espacialmente no mapa quanto como um grafo.

## Funcionalidades

O escopo do projeto inclui:

* visualização de mapa interativo;
* cadastro de locais a partir de coordenadas selecionadas no mapa;
* exibição de marcadores e detalhes dos locais;
* criação de linhas e relações entre pontos;
* criação de zonas através de polígonos;
* identificação de pontos localizados dentro de uma zona;
* representação das relações entre locais através de grafos;
* persistência simulada através de uma API REST mockada.

O desenvolvimento é feito de forma incremental, adicionando as funcionalidades conforme os conceitos e integrações são estudados.

## Tecnologias

| Tecnologia               | Utilização                                   |
| ------------------------ | -------------------------------------------- |
| **Next.js**              | Estrutura da aplicação e App Router          |
| **React**                | Componentização e gerenciamento de estado    |
| **TypeScript**           | Tipagem e modelagem dos dados                |
| **MapLibre GL JS**       | Mapa, marcadores e elementos geoespaciais    |
| **React Flow**           | Visualização de locais e relações como grafo |
| **shadcn/ui + Radix UI** | Componentes de interface                     |
| **Tailwind CSS**         | Estilização                                  |
| **JSON Server**          | Simulação de API REST                        |

## Conceitos explorados

Além das bibliotecas, o projeto é utilizado para praticar conceitos como:

* `useState`, `useRef` e `useEffect`;
* integração entre React e bibliotecas externas;
* formulários controlados;
* modelagem de dados com TypeScript;
* separação entre estado da aplicação e representação visual;
* manipulação de coordenadas e geometrias;
* relacionamentos entre entidades;
* consumo de APIs REST;
* componentização e separação de responsabilidades.

### Estado React e MapLibre

Uma das decisões do projeto é manter os dados da aplicação independentes dos objetos visuais do mapa.

```text
Estado React
    ↓
Locais / Zonas / Relações
    ↓
Representação visual
    ├── MapLibre
    └── React Flow
```

Dessa forma, mapas e grafos funcionam como diferentes representações dos mesmos dados.

## Estrutura

```text
src/
├── app/
├── components/
│   └── ui/
└── features/
    └── mapa/
        ├── components/
        └── types.ts
```

A organização evolui conforme novas responsabilidades aparecem, evitando abstrações desnecessárias no início do desenvolvimento.

## Executando o projeto

```bash
git clone <url-do-repositorio>
cd geo-relations-lab

npm install
npm run dev
```

A aplicação estará disponível no endereço informado pelo Next.js no terminal.

## Status

🚧 **Em desenvolvimento**

O projeto é utilizado como laboratório prático para aprofundar conhecimentos em desenvolvimento frontend, TypeScript, visualização geoespacial e representação de dados relacionados.

## Autor

**Wendel Rodrigues**

Estudante de Engenharia de Software e desenvolvedor interessado em desenvolvimento Full Stack, APIs, arquitetura de software e aplicações web.
