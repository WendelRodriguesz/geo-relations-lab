"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { DadosZona } from "../../utils/types";

type FormularioZonaProps = {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onCadastrar: (dados: DadosZona) => void;
};

export function FormularioZona({
  aberto,
  onOpenChange,
  onCadastrar,
}: FormularioZonaProps) {
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState("#22c55e");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!nome.trim()) {
      return;
    }

    onCadastrar({
      nome: nome.trim(),
      cor,
    });

    setNome("");
    setCor("#22c55e");
  }

  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar zona</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="zona-nome">Nome</Label>

            <Input
              id="zona-nome"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zona-cor">Cor</Label>

            <Input
              id="zona-cor"
              type="color"
              value={cor}
              onChange={(event) => setCor(event.target.value)}
              className="h-10 w-16 p-1"
            />
          </div>

          <Button type="submit" className="w-full">
            Criar zona
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
