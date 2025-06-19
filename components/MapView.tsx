"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "react-bootstrap";

type Florist = {
  id: number;
  lat: number;
  lon: number;
  tags?: { name?: string };
};

const floristIcon = new Icon({
  iconUrl: "/florist.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function MapView({
  florists,
  center,
}: {
  florists: Florist[];
  center: [number, number];
}) {
  return (
    <MapContainer
      center={center as LatLngExpression}
      zoom={14}
      style={{ height: "500px", width: "100%" }}
      className="border-0"
    >
      <TileLayer
        attribution='© <a href="https://osm.org/copyright" class="text-decoration-none">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {florists.map((shop) => (
        <Marker
          key={shop.id}
          position={[shop.lat, shop.lon]}
          icon={floristIcon}
        >
          <Popup className="rounded-3">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-2">
                <Card.Title className="fs-6 text-primary mb-1">
                  <i className="bi bi-flower1 me-1"></i>
                  {shop.tags?.name || "Cửa hàng hoa không tên"}
                </Card.Title>
                <Card.Text className="text-muted small mb-0">
                  <i className="bi bi-geo-alt me-1"></i>
                  {shop.lat.toFixed(4)}, {shop.lon.toFixed(4)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
