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

import type { Local, Relacao } from "../types";

type GrafoProps = {
  locais: Local[];
  relacoes: Relacao[];
  onFechar: () => void;
};

export function Grafo({ locais, relacoes, onFechar }: GrafoProps) {
  const nodes = useMemo<Node[]>(
    () =>
      locais.map((local, index) => ({
        id: local.id,
        position: {
          x: (index % 3) * 250,
          y: Math.floor(index / 3) * 150,
        },
        data: {
          label: local.nome,
        },
      })),
    [locais],
  );

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
