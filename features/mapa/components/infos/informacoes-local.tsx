"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Local } from "../../utils/types";

type InformacoesLocalProps = {
  aberto: boolean;
  dadosLocal: Local | null;
  onOpenChange: (aberto: boolean) => void;
};

export function InformacoesLocal({
  aberto,
  dadosLocal,
  onOpenChange,
}: InformacoesLocalProps) {
  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Informações do local</DialogTitle>
          <DialogDescription>
            Detalhes do local selecionado no mapa.
          </DialogDescription>
        </DialogHeader>
        {dadosLocal && (
          <div className="space-y-4 text-sm">
            <dl className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-muted/30">
              <div className="grid gap-1 px-3 py-3 sm:grid-cols-[7rem_1fr] sm:gap-3">
                <dt className="font-medium text-muted-foreground">Nome</dt>
                <dd className="wrap-break-word font-semibold text-foreground">
                  {dadosLocal.nome || "Não informado"}
                </dd>
              </div>
              <div className="grid gap-1 px-3 py-3 sm:grid-cols-[7rem_1fr] sm:gap-3">
                <dt className="font-medium text-muted-foreground">Descrição</dt>
                <dd className="wrap-break-word leading-6 text-foreground">
                  {dadosLocal.descricao || "Não informado"}
                </dd>
              </div>
              <div className="grid gap-1 px-3 py-3 sm:grid-cols-[7rem_1fr] sm:gap-3">
                <dt className="font-medium text-muted-foreground">Tipo</dt>
                <dd className="wrap-break-word text-foreground">
                  {dadosLocal.tipo || "Não informado"}
                </dd>
              </div>
            </dl>

            <div className="rounded-lg border border-border bg-background p-3">
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Coordenadas
              </p>
              <dl className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-xs text-muted-foreground">Longitude</dt>
                  <dd className="mt-1 font-mono text-sm text-foreground">
                    {dadosLocal.longitude.toFixed(6)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Latitude</dt>
                  <dd className="mt-1 font-mono text-sm text-foreground">
                    {dadosLocal.latitude.toFixed(6)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
