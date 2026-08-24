"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DadosLocal, Coordenada } from "../../utils/types";

type FormularioLocalProps = {
  aberto: boolean;
  coordenada: Coordenada | null;
  onOpenChange: (aberto: boolean) => void;
  onCadastrar: (dados: DadosLocal) => void;
};

export function FormularioLocal({
  aberto,
  coordenada,
  onOpenChange,
  onCadastrar,
}: FormularioLocalProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("");

  function limparFormulario() {
    setNome("");
    setDescricao("");
    setTipo("");
  }

  function handleOpenChange(novoEstado: boolean) {
    if (!novoEstado) {
      limparFormulario();
    }

    onOpenChange(novoEstado);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!nome.trim()) {
      return;
    }

    onCadastrar({
      nome: nome.trim(),
      descricao: descricao.trim(),
      tipo: tipo.trim(),
    });

    limparFormulario();
  }

  return (
    <Dialog open={aberto} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar local</DialogTitle>

          <DialogDescription>
            Preencha os dados do local selecionado no mapa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>

            <Input
              id="nome"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Ex.: Unidade Norte"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>

            <Textarea
              id="descricao"
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              placeholder="Descreva este local"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo</Label>

            <Input
              id="tipo"
              value={tipo}
              onChange={(event) => setTipo(event.target.value)}
              placeholder="Ex.: depósito"
            />
          </div>

          {coordenada && (
            <div className="text-muted-foreground text-sm">
              <p>Longitude: {coordenada.longitude.toFixed(6)}</p>
              <p>Latitude: {coordenada.latitude.toFixed(6)}</p>
            </div>
          )}

          <DialogFooter>
            <Button type="submit">Cadastrar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
