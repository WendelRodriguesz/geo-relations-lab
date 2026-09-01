"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { DadosRelacao, Local } from "../../types";

type FormularioRelacaoProps = {
  aberto: boolean;
  origem: Local | null;
  destino: Local | null;
  onOpenChange: (aberto: boolean) => void;
  onCadastrar: (dados: DadosRelacao) => void;
};

const COR_PADRAO = "#2563eb";

export function FormularioRelacao({
  aberto,
  origem,
  destino,
  onOpenChange,
  onCadastrar,
}: FormularioRelacaoProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("");
  const [cor, setCor] = useState(COR_PADRAO);

  function limparFormulario() {
    setNome("");
    setDescricao("");
    setTipo("");
    setCor(COR_PADRAO);
  }

  function handleOpenChange(aberto: boolean) {
    if (!aberto) {
      limparFormulario();
    }

    onOpenChange(aberto);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!nome.trim() || !origem || !destino) {
      return;
    }

    onCadastrar({
      nome: nome.trim(),
      descricao: descricao.trim(),
      tipo: tipo.trim(),
      cor,
    });

    limparFormulario();
  }

  return (
    <Dialog open={aberto} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar relação</DialogTitle>

          <DialogDescription>
            {origem?.nome ?? "Origem"} → {destino?.nome ?? "Destino"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome-relacao">Nome</Label>

            <Input
              id="nome-relacao"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Ex: Entrega principal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo-relacao">Tipo</Label>

            <Input
              id="tipo-relacao"
              value={tipo}
              onChange={(event) => setTipo(event.target.value)}
              placeholder="Ex: entrega para"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao-relacao">Descrição</Label>

            <Input
              id="descricao-relacao"
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              placeholder="Descrição da relação"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cor-relacao">Cor</Label>

            <div className="flex items-center gap-3">
              <Input
                id="cor-relacao"
                type="color"
                value={cor}
                onChange={(event) => setCor(event.target.value)}
                className="h-10 w-16 cursor-pointer p-1"
              />

              <span className="text-sm text-muted-foreground">{cor}</span>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Criar relação
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
