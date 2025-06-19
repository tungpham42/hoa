// MapWrapper.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Spinner, Alert, Card } from "react-bootstrap";
import { motion } from "framer-motion";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "500px" }}
    >
      <Spinner animation="grow" variant="primary" />
      <span className="ms-2">Đang tải bản đồ...</span>
    </div>
  ),
});

type Florist = {
  id: number;
  lat: number;
  lon: number;
  type: string;
  tags?: { name?: string; shop?: string };
};

type Location = {
  bbox: string;
  center: [number, number];
};

export default function MapWrapper({ city }: { city: string }) {
  const [florists, setFlorists] = useState<Florist[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<Record<string, Location> | null>(
    null
  );

  useEffect(() => {
    fetch("/vietnam_locations.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data: Record<string, Location>) => setLocations(data))
      .catch((err) => {
        console.error("Error fetching locations:", err);
        setError("Không thể tải dữ liệu vị trí. Vui lòng thử lại sau.");
      });
  }, []);

  useEffect(() => {
    if (!locations || !locations[city]) return;

    const location = locations[city] || locations["TP. Hồ Chí Minh"];
    const query = `
      [out:json][timeout:25];
      (
        node["shop"="florist"](${location.bbox});
        way["shop"="florist"](${location.bbox});
        relation["shop"="florist"](${location.bbox});
      );
      out body;
      >;
      out skel qt;
    `;
    setFlorists(null);
    setError(null);
    fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.elements && data.elements.length > 0) {
          const floristNodes = data.elements.filter(
            (element: Florist) =>
              element.type === "node" && element.lat && element.lon
          );
          setFlorists(floristNodes);
          if (floristNodes.length === 0) {
            setError(`Không tìm thấy cửa hàng hoa nào ở ${city}.`);
          }
        } else {
          setError(`Không tìm thấy cửa hàng hoa nào ở ${city}.`);
        }
      })
      .catch((err) => {
        console.error("Error fetching florists:", err);
        setError("Lỗi khi tải dữ liệu cửa hàng hoa.");
      });
  }, [city, locations]);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Alert variant="danger" className="text-center">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      </motion.div>
    );
  }

  if (!florists || !locations) {
    return (
      <Card className="text-center p-4 border-0 shadow-sm">
        <Card.Body>
          <Spinner animation="border" variant="primary" />
          <Card.Text className="mt-3">
            Đang tải dữ liệu cửa hàng hoa...
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-sm overflow-hidden">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">
            <i className="bi bi-geo-alt-fill me-2"></i>
            Cửa hàng hoa tại {city}
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          <MapView florists={florists} center={locations[city].center} />
        </Card.Body>
      </Card>
    </motion.div>
  );
}
