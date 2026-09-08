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
import type { Feature, FeatureCollection, LineString, Polygon } from "geojson";

import { FormularioLocal } from "./forms/formulario-local";
import { FormularioRelacao } from "./forms/formulario-relacao";
import { InformacoesLocal } from "./infos/informacoes-local";
import { InformacoesRelacao } from "./infos/informacoes-relacao";
import { Grafo } from "./grafo";
import { FormularioZona } from "./forms/formulario-zona";
import { InformacoesZona } from "./infos/informacoes-zona";
import { criarFeatureZona, locaisDentroDaZona } from "../utils/zonas";
import {
  criarLocal,
  criarRelacao,
  criarZona,
  listarLocais,
  listarRelacoes,
  listarZonas,
} from "../api";
import type {
  Coordenada,
  DadosLocal,
  DadosRelacao,
  DadosZona,
  Local,
  NovoLocal,
  NovaRelacao,
  NovaZona,
  Relacao,
  Zona,
} from "../types";

setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

const COORDENADA_INICIAL: Coordenada = {
  longitude: -39.013,
  latitude: -4.969,
};

const SOURCE_RELACOES_ID = "relacoes-source";
const LAYER_RELACOES_ID = "relacoes-layer";

const SOURCE_ZONAS_ID = "zonas-source";
const LAYER_ZONAS_ID = "zonas-layer";

type RelacaoPendente = {
  origemId: string;
  destinoId: string;
};

type ModoMapa = "normal" | "zona";

export default function Mapa() {
  const mapaContainerRef = useRef<HTMLDivElement | null>(null); // o MapLibre precisa receber um elemento HTML como container para renderizar o mapa.
  // O useRef é usado para criar uma referência a esse elemento, para que o MapLibre acesse diretamente o DOM.
  const mapaRef = useRef<Map | null>(null);
  const marcadoresRef = useRef<Marker[]>([]);
  const popupAcoesRef = useRef<Popup | null>(null);
  const marcadoresZonaRef = useRef<Marker[]>([]);

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

  const [modoMapa, setModoMapa] = useState<ModoMapa>("normal");

  const [formularioRelacaoAberto, setFormularioRelacaoAberto] = useState(false);

  const [relacaoSelecionada, setRelacaoSelecionada] = useState<Relacao | null>(
    null,
  );

  const [informacoesRelacaoAberto, setInformacoesRelacaoAberto] =
    useState(false);

  const [grafoAberto, setGrafoAberto] = useState(false);

  const [zonas, setZonas] = useState<Zona[]>([]);

  const [criandoZona, setCriandoZona] = useState(false);

  const [coordenadasZona, setCoordenadasZona] = useState<Coordenada[]>([]);

  const [formularioZonaAberto, setFormularioZonaAberto] = useState(false);

  const [zonaSelecionada, setZonaSelecionada] = useState<Zona | null>(null);

  const [informacoesZonaAberto, setInformacoesZonaAberto] = useState(false);

  // Carregar dados
  useEffect(() => {
    async function carregarDados() {
      const [locaisSalvos, relacoesSalvas, zonasSalvas] = await Promise.all([
        listarLocais(),
        listarRelacoes(),
        listarZonas(),
      ]);

      setLocais(locaisSalvos);
      setRelacoes(relacoesSalvas);
      setZonas(zonasSalvas);
    }

    void carregarDados();
  }, []);

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

      mapa.addSource(SOURCE_ZONAS_ID, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      mapa.addLayer({
        id: LAYER_ZONAS_ID,
        type: "fill",
        source: SOURCE_ZONAS_ID,
        paint: {
          "fill-color": ["get", "cor"],
          "fill-opacity": 0.3,
          "fill-outline-color": ["get", "cor"],
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
      if (modoMapa === "zona") {
        if (criandoZona) {
          setCoordenadasZona((coordenadasAtuais) => [
            ...coordenadasAtuais,
            {
              longitude: event.lngLat.lng,
              latitude: event.lngLat.lat,
            },
          ]);
        }

        return;
      }

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
  }, [localOrigemSelecionado, mapaCarregado, criandoZona, modoMapa]);

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
      const marcador = new Marker({
        color: localOrigemSelecionado?.id === local.id ? "#cb2a3a" : "#2443c2",
      })

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
  }, [locais, localOrigemSelecionado, mapaCarregado, modoMapa]);

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

  // Sincronizar zonas com GeoJSON
  useEffect(() => {
    const mapa = mapaRef.current;

    if (!mapa || !mapaCarregado) {
      return;
    }

    const source = mapa.getSource<GeoJSONSource>(SOURCE_ZONAS_ID);

    if (!source) {
      return;
    }

    const features: Feature<Polygon>[] = zonas.map(criarFeatureZona);

    const geojson: FeatureCollection<Polygon> = {
      type: "FeatureCollection",
      features,
    };

    void source.setData(geojson);
  }, [zonas, mapaCarregado]);

  // Clique na zona
  useEffect(() => {
    const mapa = mapaRef.current;

    if (!mapa || !mapaCarregado) {
      return;
    }

    const inscricaoClique = mapa.on("click", LAYER_ZONAS_ID, (event) => {
      if (modoMapa !== "zona" || criandoZona) {
        return;
      }

      const relacoesClicadas = mapa.queryRenderedFeatures(event.point, {
        layers: [LAYER_RELACOES_ID],
      });

      if (relacoesClicadas.length > 0) {
        return;
      }

      const zonaId = event.features?.[0]?.properties?.zonaId;

      if (typeof zonaId !== "string") {
        return;
      }

      const zona = zonas.find((zona) => zona.id === zonaId);

      if (!zona) {
        return;
      }

      setZonaSelecionada(zona);
      setInformacoesZonaAberto(true);
    });

    return () => {
      inscricaoClique.unsubscribe();
    };
  }, [zonas, mapaCarregado, criandoZona, modoMapa]);

  // Mostrar pontos da zona durante a criação
  useEffect(() => {
    const mapa = mapaRef.current;

    if (!mapa || !mapaCarregado) {
      return;
    }

    marcadoresZonaRef.current.forEach((marcador) => {
      marcador.remove();
    });

    if (!criandoZona) {
      marcadoresZonaRef.current = [];

      return;
    }

    const novosMarcadores = coordenadasZona.map((coordenada) => {
      const marcador = new Marker({
        color: "#22c55e",
        scale: 0.55,
      })
        .setLngLat([coordenada.longitude, coordenada.latitude])
        .addTo(mapa);

      marcador.getElement().style.pointerEvents = "none";

      return marcador;
    });

    marcadoresZonaRef.current = novosMarcadores;

    return () => {
      novosMarcadores.forEach((marcador) => {
        marcador.remove();
      });
    };
  }, [coordenadasZona, criandoZona, mapaCarregado]);

  async function handleCadastrarLocal(dados: DadosLocal) {
    if (!coordenadaPendente) {
      return;
    }

    const novoLocal: NovoLocal = {
      nome: dados.nome,
      descricao: dados.descricao,
      tipo: dados.tipo,
      longitude: coordenadaPendente.longitude,
      latitude: coordenadaPendente.latitude,
    };

    const localSalvo = await criarLocal(novoLocal);

    setLocais((locaisAtuais) => [...locaisAtuais, localSalvo]);

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

  async function handleCadastrarRelacao(dados: DadosRelacao) {
    if (!relacaoPendente) {
      return;
    }

    const novaRelacao: NovaRelacao = {
      nome: dados.nome,
      descricao: dados.descricao,
      tipo: dados.tipo,
      cor: dados.cor,
      origemId: relacaoPendente.origemId,
      destinoId: relacaoPendente.destinoId,
    };

    const relacaoSalva = await criarRelacao(novaRelacao);

    setRelacoes((relacoesAtuais) => [...relacoesAtuais, relacaoSalva]);

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

  function handleIniciarZona() {
    setCriandoZona(true);
    setCoordenadasZona([]);
  }

  function handleCancelarZona() {
    setCriandoZona(false);
    setCoordenadasZona([]);
  }

  function handleFinalizarZona() {
    if (coordenadasZona.length < 3) {
      return;
    }

    setFormularioZonaAberto(true);
  }

  async function handleCadastrarZona(dados: DadosZona) {
    if (coordenadasZona.length < 3) {
      return;
    }

    const novaZona: NovaZona = {
      nome: dados.nome,
      cor: dados.cor,
      coordenadas: coordenadasZona,
    };

    const zonaSalva = await criarZona(novaZona);

    setZonas((zonasAtuais) => [...zonasAtuais, zonaSalva]);

    setCriandoZona(false);
    setCoordenadasZona([]);
    setFormularioZonaAberto(false);
  }

  function handleFormularioZonaOpenChange(aberto: boolean) {
    setFormularioZonaAberto(aberto);

    if (!aberto) {
      setCriandoZona(false);
      setCoordenadasZona([]);
    }
  }

  function handleInformacoesZonaOpenChange(aberto: boolean) {
    setInformacoesZonaAberto(aberto);

    if (!aberto) {
      setZonaSelecionada(null);
    }
  }

  function handleAlterarModo(modo: ModoMapa) {
    setModoMapa(modo);

    setLocalOrigemSelecionado(null);

    popupAcoesRef.current?.remove();
    popupAcoesRef.current = null;

    if (modo === "normal") {
      setCriandoZona(false);
      setCoordenadasZona([]);
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

  const locaisZonaSelecionada = zonaSelecionada
    ? locaisDentroDaZona(locais, zonaSelecionada)
    : [];

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

      <div className="fixed left-4 top-16 z-10 flex rounded-md bg-background p-1 shadow-md">
        <button
          type="button"
          onClick={() => handleAlterarModo("normal")}
          className={`rounded px-3 py-2 text-sm ${
            modoMapa === "normal"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
        >
          Locais
        </button>

        <button
          type="button"
          onClick={() => handleAlterarModo("zona")}
          className={`rounded px-3 py-2 text-sm ${
            modoMapa === "zona"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
        >
          Zonas
        </button>
      </div>

      {modoMapa === "zona" && !criandoZona && (
        <button
          type="button"
          onClick={handleIniciarZona}
          className="fixed left-4 top-28 z-10 rounded-md bg-background px-4 py-2 text-sm font-medium shadow-md"
        >
          Criar zona
        </button>
      )}

      {localOrigemSelecionado && (
        <div className="fixed left-1/2 top-4 z-20 -translate-x-1/2 rounded-md bg-[#42f57e8a] px-4 py-2 text-sm shadow-md">
          Origem: <strong>{localOrigemSelecionado.nome}</strong>. Selecione
          outro marcador para criar a relação.
        </div>
      )}

      {criandoZona && (
        <div className="fixed left-1/2 top-4 z-20 flex -translate-x-1/2 items-center gap-3 rounded-md bg-background px-4 py-2 text-sm shadow-md">
          <span>
            Clique no mapa para marcar a zona. Pontos: {coordenadasZona.length}
          </span>

          <button
            type="button"
            disabled={coordenadasZona.length < 3}
            onClick={handleFinalizarZona}
            className="font-medium disabled:opacity-50"
          >
            Finalizar
          </button>

          <button
            type="button"
            onClick={handleCancelarZona}
            className="text-destructive"
          >
            Cancelar
          </button>
        </div>
      )}

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

      <FormularioZona
        aberto={formularioZonaAberto}
        onOpenChange={handleFormularioZonaOpenChange}
        onCadastrar={handleCadastrarZona}
      />

      <InformacoesZona
        aberto={informacoesZonaAberto}
        zona={zonaSelecionada}
        locais={locaisZonaSelecionada}
        onOpenChange={handleInformacoesZonaOpenChange}
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
