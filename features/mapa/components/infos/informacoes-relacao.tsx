"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Local, Relacao } from "../../types";

type InformacoesRelacaoProps = {
  aberto: boolean;
  dadosRelacao: Relacao | null;
  origem: Local | null;
  destino: Local | null;
  onOpenChange: (aberto: boolean) => void;
};

export function InformacoesRelacao({
  aberto,
  dadosRelacao,
  origem,
  destino,
  onOpenChange,
}: InformacoesRelacaoProps) {
  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {dadosRelacao?.nome ?? "Informações da relação"}
          </DialogTitle>

          <DialogDescription>
            Informações da relação selecionada.
          </DialogDescription>
        </DialogHeader>

        {dadosRelacao && (
          <div className="space-y-3 text-sm">
            <p>
              <strong>Origem:</strong> {origem?.nome ?? "Não encontrada"}
            </p>

            <p>
              <strong>Destino:</strong> {destino?.nome ?? "Não encontrado"}
            </p>

            <p>
              <strong>Tipo:</strong> {dadosRelacao.tipo || "Não informado"}
            </p>

            <p>
              <strong>Descrição:</strong>{" "}
              {dadosRelacao.descricao || "Não informada"}
            </p>

            <div className="flex items-center gap-2">
              <strong>Cor:</strong>

              <div
                className="h-5 w-5 rounded-full border"
                style={{ backgroundColor: dadosRelacao.cor }}
              />

              <span>{dadosRelacao.cor}</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
