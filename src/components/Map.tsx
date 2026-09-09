import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import { useFilters } from "../lib/useFilters";
import type { MuralEntry } from "../lib/types";
import { FilterProvider } from "./FilterProvider";
import { Timeline } from "./Timeline";
import { useMuralRange } from "../lib/useMuralRange";
import { MuralPopup } from "./MuralPopup";
import { DateDisplay } from "./DateDisplay";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png?url";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png?url";
import markerShadow from "leaflet/dist/images/marker-shadow.png?url";
import { IconLink } from "./IconLink";
import InformationSlabCircleOutlineIcon from "@iconify-react/mdi/information-slab-circle-outline";

L.Icon.Default.imagePath = "";
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});
interface MapProps {
  murals: MuralEntry[];
}

const MapInternal = ({ murals }: MapProps) => {
  const visibleMurals = useFilters(murals);
  const { totalMonths, baseMonth } = useMuralRange(murals);

  const markers = visibleMurals.map((mural) => {
    return (
      <Marker
        key={mural.id}
        position={[mural.location.lat, mural.location.lng]}
      >
        <Popup>
          <MuralPopup mural={mural} />
        </Popup>
      </Marker>
    );
  });

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <DateDisplay />
      <div className="absolute z-[1000] right-6 top-20 md:top-28">
        <IconLink
          href="/about"
          icon={
            <InformationSlabCircleOutlineIcon className="bg-neutral-100 p-2 rounded-xl h-10 md:h-12" />
          }
          label="Go to About page"
        />
      </div>

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
        <ZoomControl position="topright" />
        {markers}
      </MapContainer>
      <Timeline max={totalMonths} baseDate={baseMonth} />
    </div>
  );
};

export const Map = ({ murals }: MapProps) => (
  <FilterProvider>
    <MapInternal murals={murals} />
  </FilterProvider>
);
