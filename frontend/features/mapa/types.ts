export type Coordenada = {
  longitude: number;
  latitude: number;
};

export type DadosLocal = {
  nome: string;
  descricao: string;
  tipo: string;
};

export type Local = {
  id: string;
  nome: string;
  descricao: string;
  tipo: string;
  longitude: number;
  latitude: number;
};

export type NovoLocal = Omit<Local, "id">;

export type DadosRelacao = {
  nome: string;
  descricao: string;
  tipo: string;
  cor: string;
};

export type Relacao = {
  id: string;
  nome: string;
  descricao: string;
  tipo: string;
  cor: string;
  origemId: string;
  destinoId: string;
};

export type NovaRelacao = Omit<Relacao, "id">;

export type DadosZona = {
  nome: string;
  cor: string;
};

export type Zona = {
  id: string;
  nome: string;
  cor: string;
  coordenadas: Coordenada[];
};

export type NovaZona = Omit<Zona, "id">;
