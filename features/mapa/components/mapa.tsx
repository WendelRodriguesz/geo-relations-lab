"use client";

import { useEffect, useRef } from "react";
import { Map, NavigationControl, setWorkerUrl } from "maplibre-gl";

setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

const COORDENADA_INICIAL: [number, number] = [-39.013, -4.969]; // logintude e latitude

export default function Mapa() {
  const mapaContainerRef = useRef<HTMLDivElement>(null); // o MapLibre precisa receber um elemento HTML como container para renderizar o mapa. 
    // O useRef é usado para criar uma referência a esse elemento, para que o MapLibre acesse diretamente o DOM.
  useEffect(() => {
    if (!mapaContainerRef.current) {
      return; // componente entrou no DOM -> cria MapLibre Map -> componente desmonta -> mapa.remove()
    }

    const mapa = new Map({
      container: mapaContainerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: COORDENADA_INICIAL,
      zoom: 5,
    });

    mapa.addControl(new NavigationControl(), "top-right");

    return () => {
      mapa.remove();
    };
  }, []);

  return <div ref={mapaContainerRef} className="h-screen w-full" />;
}