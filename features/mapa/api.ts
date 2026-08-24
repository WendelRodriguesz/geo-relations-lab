import type { Local, Relacao, Zona } from "../mapa/types";

const API_URL = "http://localhost:3001";

export async function listarLocais() {
  const response = await fetch(`${API_URL}/locais`);

  return response.json() as Promise<Local[]>;
}

export async function criarLocal(local: Local) {
  const response = await fetch(`${API_URL}/locais`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(local),
  });

  return response.json() as Promise<Local>;
}

export async function listarRelacoes() {
  const response = await fetch(`${API_URL}/relacoes`);

  return response.json() as Promise<Relacao[]>;
}

export async function criarRelacao(relacao: Relacao) {
  const response = await fetch(`${API_URL}/relacoes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(relacao),
  });

  return response.json() as Promise<Relacao>;
}

export async function listarZonas() {
  const response = await fetch(`${API_URL}/zonas`);

  return response.json() as Promise<Zona[]>;
}

export async function criarZona(zona: Zona) {
  const response = await fetch(`${API_URL}/zonas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(zona),
  });

  return response.json() as Promise<Zona>;
}
