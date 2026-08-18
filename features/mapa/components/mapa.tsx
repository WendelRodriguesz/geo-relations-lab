"use client";

import { useEffect, useRef, useState } from "react";
import {
  Map,
  Marker, NavigationControl, setWorkerUrl
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FormularioLocal } from "./formulario-local";
import type { Local, Coordenada } from "../types";

setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");


const COORDENADA_INICIAL: Coordenada = {longitude : -39.013, latitude: -4.969} // logintude e latitude

export default function Mapa() {
  const mapaContainerRef = useRef<HTMLDivElement | null>(null);  // o MapLibre precisa receber um elemento HTML como container para renderizar o mapa. 
    // O useRef é usado para criar uma referência a esse elemento, para que o MapLibre acesse diretamente o DOM.
  const mapaRef = useRef<Map | null>(null);
  const marcadoresRef = useRef<Marker[]>([]);

  const [locais, setLocais] = useState<Local[]>([]);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [coordenadaPendente, setCoordenadaPendente] = useState<Coordenada | null>(null);

  useEffect(() => {
    if (!mapaContainerRef.current) {
      return; // componente entrou no DOM -> cria MapLibre Map -> componente desmonta -> mapa.remove()
    }

    const mapa = new Map({
      container: mapaContainerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [COORDENADA_INICIAL.longitude, COORDENADA_INICIAL.latitude],
      zoom: 5,
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

    const novosMarcadores = locais.map((local) => {
      return new Marker()
        .setLngLat([local.longitude, local.latitude])
        .addTo(mapa);
    });

    marcadoresRef.current = novosMarcadores;
  }, [locais]);

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

  function handleOpenChange(aberto: boolean) {
    setFormularioAberto(aberto);

    if (!aberto) {
      setCoordenadaPendente(null);
    }
  }

  return (
    <>
      <div
        ref={mapaContainerRef}
        className="h-screen w-full"
      />

      <FormularioLocal
        aberto={formularioAberto}
        coordenada={coordenadaPendente}
        onOpenChange={handleOpenChange}
        onCadastrar={handleCadastrarLocal}
      />
    </>
  );
}