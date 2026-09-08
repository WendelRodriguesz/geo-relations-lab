import type {
  Local,
  Relacao,
  Zona,
  NovoLocal,
  NovaRelacao,
  NovaZona,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

type ApiProblem = {
  title?: string;
  detail?: string;
  status?: number;
};

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    const problem = (await response
      .json()
      .catch(() => null)) as ApiProblem | null;

    throw new Error(
      problem?.detail ?? `Erro ao acessar a API (${response.status})`,
    );
  }

  return response.json() as Promise<T>;
}

export function listarLocais() {
  return apiFetch<Local[]>("/locais");
}

export function criarLocal(local: NovoLocal) {
  return apiFetch<Local>("/locais", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(local),
  });
}

export function listarRelacoes() {
  return apiFetch<Relacao[]>("/relacoes");
}

export function criarRelacao(relacao: NovaRelacao) {
  return apiFetch<Relacao>("/relacoes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(relacao),
  });
}

export function listarZonas() {
  return apiFetch<Zona[]>("/zonas");
}

export function criarZona(zona: NovaZona) {
  return apiFetch<Zona>("/zonas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(zona),
  });
}
