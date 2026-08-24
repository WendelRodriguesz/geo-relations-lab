import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

import type { Feature, Polygon, Position } from "geojson";

import type { Local, Zona } from "./types";

export function criarFeatureZona(zona: Zona): Feature<Polygon> {
  const anel: Position[] = zona.coordenadas.map((coordenada) => [
    coordenada.longitude,
    coordenada.latitude,
  ]);

  anel.push([...anel[0]]);

  return {
    type: "Feature",

    properties: {
      zonaId: zona.id,
      nome: zona.nome,
      cor: zona.cor,
    },

    geometry: {
      type: "Polygon",
      coordinates: [anel],
    },
  };
}

export function locaisDentroDaZona(locais: Local[], zona: Zona) {
  const poligono = criarFeatureZona(zona);

  return locais.filter((local) =>
    booleanPointInPolygon([local.longitude, local.latitude], poligono),
  );
}
