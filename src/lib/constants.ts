import type { LatLngBoundsLiteral } from "leaflet";

export const MAP_BOUNDS = [
  [38.78, -77.13],
  [39.01, -76.89],
] as LatLngBoundsLiteral;

export const MAP_PAN_BOUNDS = [
  [38.68, -77.27],
  [39.11, -76.77],
] as LatLngBoundsLiteral;

export const PHOTO_BASE_URL = "https://images.muralmarker.com/";

export const PHOTO_PLACEHOLDER = {
  src: "/mural-placeholder.svg",
  width: 400,
  height: 300,
};
