"use client";

import { useMemo } from "react";

import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";

import { Button } from "@/components/ui/button";

import type { Local, Relacao } from "../utils/types";

type GrafoProps = {
  locais: Local[];
  relacoes: Relacao[];
  onFechar: () => void;
};

export function Grafo({ locais, relacoes, onFechar }: GrafoProps) {
  const ESCALA_GRAFO = 20000;

  const nodes = useMemo<Node[]>(() => {
    if (locais.length === 0) {
      return [];
    }

    const longitudeMinima = Math.min(...locais.map((local) => local.longitude));

    const latitudeMaxima = Math.max(...locais.map((local) => local.latitude));

    return locais.map((local) => ({
      id: local.id,

      position: {
        x: (local.longitude - longitudeMinima) * ESCALA_GRAFO,

        y: (latitudeMaxima - local.latitude) * ESCALA_GRAFO,
      },

      data: {
        label: local.nome,
      },
    }));
  }, [locais]);

  const edges = useMemo<Edge[]>(
    () =>
      relacoes.map((relacao) => ({
        id: relacao.id,
        source: relacao.origemId,
        target: relacao.destinoId,
        label: relacao.nome,
        type: "straight",
        style: {
          stroke: relacao.cor,
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: relacao.cor,
        },
      })),
    [relacoes],
  );

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <Button
        className="absolute right-4 top-4 z-10"
        variant="secondary"
        onClick={onFechar}
      >
        Voltar ao mapa
      </Button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
