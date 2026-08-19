export type Local = {
  id: string;
  nome: string;
  descricao: string;
  tipo: string;
  longitude: number;
  latitude: number;
};

export type Relacao = {
  id: string;
  origemId: string;
  destinoId: string;
  tipo: string;
};

export type Coordenada = {
  longitude: number;
  latitude: number;
};

export type DadosLocal = {
  nome: string;
  descricao: string;
  tipo: string;
};
