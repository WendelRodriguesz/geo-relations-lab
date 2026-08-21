"use client";

import { useEffect, useRef, useState } from "react";
import {
  Map,
  Marker,
  NavigationControl,
  Popup,
  setWorkerUrl,
  type GeoJSONSource,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Feature, FeatureCollection, LineString } from "geojson";

import { FormularioLocal } from "./formulario-local";
import { FormularioRelacao } from "./formulario-relacao";
import { InformacoesLocal } from "./informacoes-local";
import { InformacoesRelacao } from "./informacoes-relacao";
import { Grafo } from "./grafo";
import type {
  Coordenada,
  DadosLocal,
  DadosRelacao,
  Local,
  Relacao,
} from "../types";

setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

const COORDENADA_INICIAL: Coordenada = {
  longitude: -39.013,
  latitude: -4.969,
};

const SOURCE_RELACOES_ID = "relacoes-source";
const LAYER_RELACOES_ID = "relacoes-layer";

type RelacaoPendente = {
  origemId: string;
  destinoId: string;
};

export default function Mapa() {
  const mapaContainerRef = useRef<HTMLDivElement | null>(null); // o MapLibre precisa receber um elemento HTML como container para renderizar o mapa.
  // O useRef é usado para criar uma referência a esse elemento, para que o MapLibre acesse diretamente o DOM.
  const mapaRef = useRef<Map | null>(null);
  const marcadoresRef = useRef<Marker[]>([]);
  const popupAcoesRef = useRef<Popup | null>(null);

  const [mapaCarregado, setMapaCarregado] = useState(false);

  const [locais, setLocais] = useState<Local[]>([]);
  const [relacoes, setRelacoes] = useState<Relacao[]>([]);

  const [formularioAberto, setFormularioAberto] = useState(false);
  const [coordenadaPendente, setCoordenadaPendente] =
    useState<Coordenada | null>(null);

  const [informacoesAberto, setInformacoesAberto] = useState(false);
  const [localSelecionado, setLocalSelecionado] = useState<Local | null>(null);

  const [localOrigemSelecionado, setLocalOrigemSelecionado] =
    useState<Local | null>(null);

  const [relacaoPendente, setRelacaoPendente] =
    useState<RelacaoPendente | null>(null);

  const [formularioRelacaoAberto, setFormularioRelacaoAberto] = useState(false);

  const [relacaoSelecionada, setRelacaoSelecionada] = useState<Relacao | null>(
    null,
  );

  const [informacoesRelacaoAberto, setInformacoesRelacaoAberto] =
    useState(false);

  const [grafoAberto, setGrafoAberto] = useState(false);

  // Criar o mapa
  useEffect(() => {
    if (!mapaContainerRef.current) {
      return;
    }

    const mapa = new Map({
      container: mapaContainerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [COORDENADA_INICIAL.longitude, COORDENADA_INICIAL.latitude],
      zoom: 15,
    });

    mapa.addControl(new NavigationControl());

    mapaRef.current = mapa;

    const inscricaoLoad = mapa.on("load", () => {
      mapa.addSource(SOURCE_RELACOES_ID, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      mapa.addLayer({
        id: LAYER_RELACOES_ID,
        type: "line",
        source: SOURCE_RELACOES_ID,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": ["get", "cor"],
          "line-width": 5,
        },
      });

      setMapaCarregado(true);
    });

    return () => {
      inscricaoLoad.unsubscribe();

      mapaRef.current = null;

      mapa.remove();
    };
  }, []);

  // Clique no mapa
  useEffect(() => {
    const mapa = mapaRef.current;

    if (!mapa || !mapaCarregado) {
      return;
    }

    const inscricaoClique = mapa.on("click", (event) => {
      const relacoesClicadas = mapa.queryRenderedFeatures(event.point, {
        layers: [LAYER_RELACOES_ID],
      });

      if (relacoesClicadas.length > 0) {
        return;
      }

      if (popupAcoesRef.current?.isOpen()) {
        popupAcoesRef.current.remove();
        popupAcoesRef.current = null;

        return;
      }

      if (localOrigemSelecionado !== null) {
        setLocalOrigemSelecionado(null);

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
    };
  }, [localOrigemSelecionado, mapaCarregado]);

  // Sincronizar locais com markers
  useEffect(() => {
    const mapa = mapaRef.current;

    if (!mapa || !mapaCarregado) {
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
        popup
          .setLngLat([local.longitude, local.latitude])
          .setText(local.nome)
          .addTo(mapa);
      });

      elementoHtml.addEventListener("mouseleave", () => {
        popup.remove();
      });

      elementoHtml.addEventListener("click", (event) => {
        event.stopPropagation();

        popup.remove();

        if (localOrigemSelecionado !== null) {
          if (localOrigemSelecionado.id === local.id) {
            setLocalOrigemSelecionado(null);

            return;
          }

          setRelacaoPendente({
            origemId: localOrigemSelecionado.id,
            destinoId: local.id,
          });

          setLocalOrigemSelecionado(null);
          setFormularioRelacaoAberto(true);

          return;
        }

        popupAcoesRef.current?.remove();

        const container = document.createElement("div");

        container.className =
          "flex min-w-52 flex-col gap-1 rounded-xl border border-border/60 bg-background/90 p-2 text-foreground shadow-lg backdrop-blur-md";

        const titulo = document.createElement("p");

        titulo.textContent = local.nome;

        titulo.className = "px-2 pb-2 pt-1 text-center text-sm font-semibold";

        const botaoInformacoes = document.createElement("button");

        botaoInformacoes.type = "button";
        botaoInformacoes.textContent = "Ver informações";

        botaoInformacoes.className =
          "w-full cursor-pointer rounded-lg px-3 py-2 text-center text-sm transition-colors hover:bg-accent hover:text-accent-foreground";

        const botaoRelacao = document.createElement("button");

        botaoRelacao.type = "button";
        botaoRelacao.textContent = "Fazer uma relação";

        botaoRelacao.className =
          "w-full cursor-pointer rounded-lg px-3 py-2 text-center text-sm transition-colors hover:bg-accent hover:text-accent-foreground";

        container.append(titulo, botaoInformacoes, botaoRelacao);

        botaoInformacoes.addEventListener("click", () => {
          setLocalSelecionado(local);
          setInformacoesAberto(true);

          popupAcoesRef.current?.remove();
          popupAcoesRef.current = null;
        });

        botaoRelacao.addEventListener("click", () => {
          setLocalOrigemSelecionado(local);

          popupAcoesRef.current?.remove();
          popupAcoesRef.current = null;
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
  }, [locais, localOrigemSelecionado, mapaCarregado]);

  // Sincronizar relações com GeoJSON
  useEffect(() => {
    const mapa = mapaRef.current;

    if (!mapa || !mapaCarregado) {
      return;
    }

    const source = mapa.getSource<GeoJSONSource>(SOURCE_RELACOES_ID);

    if (!source) {
      return;
    }

    const features: Feature<LineString>[] = relacoes.flatMap((relacao) => {
      const origem = locais.find((local) => local.id === relacao.origemId);

      const destino = locais.find((local) => local.id === relacao.destinoId);

      if (!origem || !destino) {
        return [];
      }

      return [
        {
          type: "Feature",
          properties: {
            relacaoId: relacao.id,
            nome: relacao.nome,
            tipo: relacao.tipo,
            cor: relacao.cor,
          },
          geometry: {
            type: "LineString",
            coordinates: [
              [origem.longitude, origem.latitude],
              [destino.longitude, destino.latitude],
            ],
          },
        },
      ];
    });

    const geojson: FeatureCollection<LineString> = {
      type: "FeatureCollection",
      features,
    };

    void source.setData(geojson);
  }, [locais, relacoes, mapaCarregado]);

  // Hover e clique nas relações
  useEffect(() => {
    const mapa = mapaRef.current;

    if (!mapa || !mapaCarregado) {
      return;
    }

    const popup = new Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 10,
    });

    const inscricaoMouseEnter = mapa.on(
      "mouseenter",
      LAYER_RELACOES_ID,
      (event) => {
        mapa.getCanvas().style.cursor = "pointer";

        const feature = event.features?.[0];
        const nome = feature?.properties?.nome;

        if (typeof nome !== "string") {
          return;
        }

        popup.setLngLat(event.lngLat).setText(`Relação: ${nome}`).addTo(mapa);
      },
    );

    const inscricaoMouseLeave = mapa.on("mouseleave", LAYER_RELACOES_ID, () => {
      mapa.getCanvas().style.cursor = "";

      popup.remove();
    });

    const inscricaoClique = mapa.on("click", LAYER_RELACOES_ID, (event) => {
      const feature = event.features?.[0];

      const relacaoId = feature?.properties?.relacaoId;

      if (typeof relacaoId !== "string") {
        return;
      }

      const relacao = relacoes.find((relacao) => relacao.id === relacaoId);

      if (!relacao) {
        return;
      }

      popup.remove();

      popupAcoesRef.current?.remove();
      popupAcoesRef.current = null;

      setRelacaoSelecionada(relacao);
      setInformacoesRelacaoAberto(true);
    });

    return () => {
      popup.remove();

      mapa.getCanvas().style.cursor = "";

      inscricaoMouseEnter.unsubscribe();
      inscricaoMouseLeave.unsubscribe();
      inscricaoClique.unsubscribe();
    };
  }, [relacoes, mapaCarregado]);

  function handleCadastrarLocal(dados: DadosLocal) {
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

  function handleCadastrarRelacao(dados: DadosRelacao) {
    if (!relacaoPendente) {
      return;
    }

    const novaRelacao: Relacao = {
      id: crypto.randomUUID(),
      nome: dados.nome,
      descricao: dados.descricao,
      tipo: dados.tipo,
      cor: dados.cor,
      origemId: relacaoPendente.origemId,
      destinoId: relacaoPendente.destinoId,
    };

    setRelacoes((relacoesAtuais) => [...relacoesAtuais, novaRelacao]);

    setFormularioRelacaoAberto(false);
    setRelacaoPendente(null);
  }

  function handleFormularioRelacaoOpenChange(aberto: boolean) {
    setFormularioRelacaoAberto(aberto);

    if (!aberto) {
      setRelacaoPendente(null);
    }
  }

  function handleInformacoesRelacaoOpenChange(aberto: boolean) {
    setInformacoesRelacaoAberto(aberto);

    if (!aberto) {
      setRelacaoSelecionada(null);
    }
  }

  const origemRelacaoPendente = relacaoPendente
    ? (locais.find((local) => local.id === relacaoPendente.origemId) ?? null)
    : null;

  const destinoRelacaoPendente = relacaoPendente
    ? (locais.find((local) => local.id === relacaoPendente.destinoId) ?? null)
    : null;

  const origemRelacaoSelecionada = relacaoSelecionada
    ? (locais.find((local) => local.id === relacaoSelecionada.origemId) ?? null)
    : null;

  const destinoRelacaoSelecionada = relacaoSelecionada
    ? (locais.find((local) => local.id === relacaoSelecionada.destinoId) ??
      null)
    : null;

  return (
    <>
      <div ref={mapaContainerRef} className="h-screen w-full" />

      <button
        type="button"
        onClick={() => setGrafoAberto(true)}
        className="fixed left-4 top-4 z-10 rounded-md bg-background px-4 py-2 text-sm font-medium shadow-md"
      >
        Ver grafo
      </button>

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

      <FormularioRelacao
        aberto={formularioRelacaoAberto}
        origem={origemRelacaoPendente}
        destino={destinoRelacaoPendente}
        onOpenChange={handleFormularioRelacaoOpenChange}
        onCadastrar={handleCadastrarRelacao}
      />

      <InformacoesRelacao
        aberto={informacoesRelacaoAberto}
        dadosRelacao={relacaoSelecionada}
        origem={origemRelacaoSelecionada}
        destino={destinoRelacaoSelecionada}
        onOpenChange={handleInformacoesRelacaoOpenChange}
      />

      {grafoAberto && (
        <Grafo
          locais={locais}
          relacoes={relacoes}
          onFechar={() => setGrafoAberto(false)}
        />
      )}
    </>
  );
}
