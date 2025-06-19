"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

type Florist = {
  id: number;
  lat: number;
  lon: number;
  tags?: { name?: string };
};

const floristIcon = new Icon({
  iconUrl: "/florist.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

export default function MapView({
  florists,
  center,
}: {
  florists: Florist[];
  center: [number, number];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="border rounded-3 shadow"
    >
      <MapContainer
        center={center as LatLngExpression}
        zoom={14}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='© <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {florists.map((shop) => (
          <Marker
            key={shop.id}
            position={[shop.lat, shop.lon]}
            icon={floristIcon}
          >
            <Popup>
              <div className="fw-semibold">
                {shop.tags?.name || "Cửa hàng hoa không tên"}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </motion.div>
  );
}
