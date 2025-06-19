"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Spinner, Alert } from "react-bootstrap";
import { motion } from "framer-motion";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
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
        setError("Lỗi khi tải dữ liệu vị trí.");
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
        console.log(`Overpass API response for ${city}:`, data);
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
        className="text-center mt-5"
      >
        <Alert variant="danger">{error}</Alert>
      </motion.div>
    );
  }

  if (!florists || !locations) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mt-5"
      >
        <Spinner animation="border" role="status" />
        <div className="mt-2">Đang tải dữ liệu cửa hàng hoa...</div>
      </motion.div>
    );
  }

  return <MapView florists={florists} center={locations[city].center} />;
}
