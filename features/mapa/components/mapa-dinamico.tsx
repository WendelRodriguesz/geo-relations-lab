"use client";// Mostra ao next que este componente será renderizado no lado do cliente e não no servidor. 


import dynamic from "next/dynamic";

const Mapa = dynamic(() => import("./mapa"), {
  ssr: false, // Desativa a renderização do lado do servidor para este componente.
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      Carregando mapa...
    </div>
  ),
});

export function MapaDinamico() {
  return <Mapa />;
}