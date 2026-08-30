import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import type { Mural } from "../content.config";
import { useFilters } from "../lib/useFilters";
import type { MuralEntry } from "../lib/types";
import { FilterProvider } from "./FilterProvider";

interface MapProps {
  murals: MuralEntry[];
}

const MapInternal = ({ murals }: MapProps) => {
  const visibleMurals = useFilters(murals);

  const markers = visibleMurals.map((mural) => {
    return (
      <Marker position={[mural.location.lat, mural.location.lng]}>
        <Popup>{mural.title || "Untitled"}</Popup>
      </Marker>
    );
  });

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <MapContainer
        id="mainMap"
        center={[38.8951, -77.0364]}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        {markers}
      </MapContainer>
    </div>
  );
};

export const Map = ({ murals }: MapProps) => (
  <FilterProvider>
    <MapInternal murals={murals} />
  </FilterProvider>
);
