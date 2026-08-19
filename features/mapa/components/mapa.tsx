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

      // elementoHtml.addEventListener("click", (event) => {
      //   event.stopPropagation(); // Isso para não ser disparado o evento de click do mapa, que abriria o formulário de cadastro.
      //   popup.remove();
      //   setLocalSelecionado(local);
      //   setInformacoesAberto(true);
      // });

      elementoHtml.addEventListener("click", (event) => {
        event.stopPropagation();
        popup.remove();

        if (localOrigemSelecionado === null) {
          setLocalOrigemSelecionado(local);
          console.log(`Local de origem selecionado: ${local.nome}`);
          return;
        }

        if (localOrigemSelecionado.id === local.id) {
          setLocalOrigemSelecionado(null);
          console.log(`Seleção de origem cancelada: ${local.nome}`);
          return;
        }

        console.log(`Local de destino selecionado: ${local.nome}`);
        const novaRelacao: Relacao = {
          id: crypto.randomUUID(),
          origemId: localOrigemSelecionado.id,
          destinoId: local.id,
          tipo: "relacao",
        };
        setRelacoes((relacoesAtuais) => [...relacoesAtuais, novaRelacao]);
        setLocalOrigemSelecionado(null);
      });

      return marcador;
    });

    marcadoresRef.current = novosMarcadores;

    return () => {
      popup.remove();

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
