"use client";

import { useEffect, useRef, useState } from "react";
import {
  Map,
  Marker,
  NavigationControl,
  Popup,
  setWorkerUrl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FormularioLocal } from "./formulario-local";
import type { Local, Coordenada, Relacao } from "../types";
import { InformacoesLocal } from "./informacoes-local";

setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

const COORDENADA_INICIAL: Coordenada = { longitude: -39.013, latitude: -4.969 }; // logintude e latitude

export default function Mapa() {
  const mapaContainerRef = useRef<HTMLDivElement | null>(null); // o MapLibre precisa receber um elemento HTML como container para renderizar o mapa.
  // O useRef é usado para criar uma referência a esse elemento, para que o MapLibre acesse diretamente o DOM.
  const mapaRef = useRef<Map | null>(null);
  const marcadoresRef = useRef<Marker[]>([]);
  const popupAcoesRef = useRef<Popup | null>(null);

  const [locais, setLocais] = useState<Local[]>([]);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [coordenadaPendente, setCoordenadaPendente] =
    useState<Coordenada | null>(null);

  const [informacoesAberto, setInformacoesAberto] = useState(false);
  const [localSelecionado, setLocalSelecionado] = useState<Local | null>(null);

  const [relacoes, setRelacoes] = useState<Relacao[]>([]);
  const [localOrigemSelecionado, setLocalOrigemSelecionado] =
    useState<Local | null>(null);
  useEffect(() => {
    console.log("Relações atualizadas:", relacoes);
  }, [relacoes]);

  useEffect(() => {
    if (!mapaContainerRef.current) {
      return; // componente entrou no DOM -> cria MapLibre Map -> componente desmonta -> mapa.remove()
    }

    const mapa = new Map({
      container: mapaContainerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [COORDENADA_INICIAL.longitude, COORDENADA_INICIAL.latitude],
      zoom: 15,
    });

    mapa.addControl(new NavigationControl());

    mapaRef.current = mapa;

    const inscricaoClique = mapa.on("click", (event) => {
      if (popupAcoesRef.current?.isOpen()) {
        popupAcoesRef.current.remove();
        popupAcoesRef.current = null;
        return;
      }

      setCoordenadaPendente({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
      });
      setFormularioAberto(true);
    });

    return () => {
      inscricaoClique.unsubscribe();

      marcadoresRef.current.forEach((marcador) => {
        marcador.remove();
      });

      mapaRef.current = null;

      mapa.remove();
    };
  }, []);

  useEffect(() => {
    const mapa = mapaRef.current;

    if (!mapa) {
      return;
    }

    marcadoresRef.current.forEach((marcador) => {
      marcador.remove();
    });

    const popup = new Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 30,
    });

    const novosMarcadores = locais.map((local) => {
      const marcador = new Marker()
        .setLngLat([local.longitude, local.latitude])
        .addTo(mapa);

      const elementoHtml = marcador.getElement();
      elementoHtml.addEventListener("mouseenter", () => {
        // console.log(`Mouse passou por: ${local.nome}`);
        popup
          .setLngLat([local.longitude, local.latitude])
          .setText(local.nome)
          .addTo(mapa);
      });

      elementoHtml.addEventListener("mouseleave", () => {
        // console.log(`Mouse saiu de: ${local.nome}`);
        popup.remove();
      });

      elementoHtml.addEventListener("click", (event) => {
        event.stopPropagation();
        popup.remove();

        if (localOrigemSelecionado !== null) {
          if (localOrigemSelecionado.id === local.id) {
            setLocalOrigemSelecionado(null);
            console.log(`Seleção de origem cancelada: ${local.nome}`);
            return;
          }

          const novaRelacao: Relacao = {
            id: crypto.randomUUID(),
            origemId: localOrigemSelecionado.id,
            destinoId: local.id,
            tipo: "relacao",
          };

          setRelacoes((relacoesAtuais) => [...relacoesAtuais, novaRelacao]);

          setLocalOrigemSelecionado(null);

          return;
        }

        // nenhuma relação está sendo criada:
        // mostrar menu de ações
        popupAcoesRef.current?.remove();

        const container = document.createElement("div");
        container.className =
          "flex min-w-52 flex-col gap-1 rounded-xl border border-border/60 bg-background/90 p-2 text-foreground shadow-lg backdrop-blur-md";

        const titulo = document.createElement("p");
        titulo.textContent = local.nome;
        titulo.className = "px-2 pb-2 pt-1 text-center text-sm font-semibold";

        const botaoInformacoes = document.createElement("button");
        botaoInformacoes.textContent = "Ver informações";
        botaoInformacoes.className =
          "w-full cursor-pointer rounded-lg px-3 py-2 text-center text-sm transition-colors hover:bg-accent hover:text-accent-foreground";

        const botaoRelacao = document.createElement("button");
        botaoRelacao.textContent = "Fazer uma relação";
        botaoRelacao.className =
          "w-full cursor-pointer rounded-lg px-3 py-2 text-center text-sm transition-colors hover:bg-accent hover:text-accent-foreground";

        container.append(titulo, botaoInformacoes, botaoRelacao);

        botaoInformacoes.addEventListener("click", () => {
          setLocalSelecionado(local);
          setInformacoesAberto(true);

          popupAcoesRef.current?.remove();
        });

        botaoRelacao.addEventListener("click", () => {
          setLocalOrigemSelecionado(local);

          popupAcoesRef.current?.remove();

          console.log(`Local de origem selecionado: ${local.nome}`);
        });

        const popupAcoes = new Popup({
          closeButton: true,
          closeOnClick: false,
          offset: 30,
          className: "popup-acoes",
        })
          .setLngLat([local.longitude, local.latitude])
          .setDOMContent(container)
          .addTo(mapa);

        popupAcoesRef.current = popupAcoes;
      });

      return marcador;
    });

    marcadoresRef.current = novosMarcadores;

    return () => {
      popup.remove();

      popupAcoesRef.current?.remove();
      popupAcoesRef.current = null;

      novosMarcadores.forEach((marcador) => {
        marcador.remove();
      });
    };
  }, [locais, localOrigemSelecionado]);

  function handleCadastrarLocal(dados: {
    nome: string;
    descricao: string;
    tipo: string;
  }) {
    if (!coordenadaPendente) {
      return;
    }

    const novoLocal: Local = {
      id: crypto.randomUUID(),
      nome: dados.nome,
      descricao: dados.descricao,
      tipo: dados.tipo,
      longitude: coordenadaPendente.longitude,
      latitude: coordenadaPendente.latitude,
    };

    setLocais((locaisAtuais) => [...locaisAtuais, novoLocal]);

    setFormularioAberto(false);
    setCoordenadaPendente(null);
  }

  function handleFormularioOpenChange(aberto: boolean) {
    setFormularioAberto(aberto);

    if (!aberto) {
      setCoordenadaPendente(null);
    }
  }

  function handleInformacoesOpenChange(aberto: boolean) {
    setInformacoesAberto(aberto);

    if (!aberto) {
      setLocalSelecionado(null);
    }
  }

  return (
    <>
      <div ref={mapaContainerRef} className="h-screen w-full" />

      <FormularioLocal
        aberto={formularioAberto}
        coordenada={coordenadaPendente}
        onOpenChange={handleFormularioOpenChange}
        onCadastrar={handleCadastrarLocal}
      />

      <InformacoesLocal
        aberto={informacoesAberto}
        dadosLocal={localSelecionado}
        onOpenChange={handleInformacoesOpenChange}
      />
    </>
  );
}
