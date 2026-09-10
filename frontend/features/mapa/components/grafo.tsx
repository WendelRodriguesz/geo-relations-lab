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
  const ESCALA_GRAFO = 20000;

  const DISTANCIA_MINIMA = 180;

  function separarNosProximos(nodes: Node[]) {
    const resultado = nodes.map((node) => ({
      ...node,
      position: { ...node.position },
    }));

    for (let repeticao = 0; repeticao < 5; repeticao++) {
      for (let i = 0; i < resultado.length; i++) {
        for (let j = i + 1; j < resultado.length; j++) {
          const a = resultado[i];
          const b = resultado[j];

          const dx = b.position.x - a.position.x;
          const dy = b.position.y - a.position.y;

          const distancia = Math.sqrt(dx * dx + dy * dy);

          if (distancia >= DISTANCIA_MINIMA) {
            continue;
          }

          const angulo = distancia === 0 ? (i + j) * 0.5 : Math.atan2(dy, dx);

          const afastamento = (DISTANCIA_MINIMA - distancia) / 2;

          const x = Math.cos(angulo) * afastamento;
          const y = Math.sin(angulo) * afastamento;

          a.position.x -= x;
          a.position.y -= y;

          b.position.x += x;
          b.position.y += y;
        }
      }
    }

    return resultado;
  }

  const nodes = useMemo<Node[]>(() => {
    if (locais.length === 0) {
      return [];
    }

    const longitudeMinima = Math.min(...locais.map((local) => local.longitude));

    const latitudeMaxima = Math.max(...locais.map((local) => local.latitude));

    const nodesGeograficos = locais.map((local) => ({
      id: local.id,
      // type: "local",
      position: {
        x: (local.longitude - longitudeMinima) * ESCALA_GRAFO,
        y: (latitudeMaxima - local.latitude) * ESCALA_GRAFO,
      },
      data: {
        label: local.nome,
      },
    }));

    return separarNosProximos(nodesGeograficos);
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
