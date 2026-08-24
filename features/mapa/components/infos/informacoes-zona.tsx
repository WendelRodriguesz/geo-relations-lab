"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Local, Zona } from "../../utils/types";

type InformacoesZonaProps = {
  aberto: boolean;
  zona: Zona | null;
  locais: Local[];
  onOpenChange: (aberto: boolean) => void;
};

export function InformacoesZona({
  aberto,
  zona,
  locais,
  onOpenChange,
}: InformacoesZonaProps) {
  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{zona?.nome ?? "Zona"}</DialogTitle>
        </DialogHeader>

        <div>
          <p className="mb-2 font-medium">Locais dentro da zona</p>

          {locais.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum local dentro desta zona.
            </p>
          ) : (
            <ul className="space-y-1">
              {locais.map((local) => (
                <li key={local.id}>{local.nome}</li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
