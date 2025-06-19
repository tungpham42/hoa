"use client";

import MapWrapper from "@/components/MapWrapper";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container, Form, Alert } from "react-bootstrap";

type Location = {
  bbox: string;
  center: [number, number];
};

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState("TP. Hồ Chí Minh");
  const [locations, setLocations] = useState<Record<string, Location> | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/vietnam_locations.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data: Record<string, Location>) => setLocations(data))
      .catch((err) => {
        console.error("Error fetching locations:", err);
        setError("Lỗi khi tải danh sách tỉnh/thành phố.");
      });
  }, []);

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

  if (!locations) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mt-5"
      >
        Đang tải danh sách tỉnh/thành phố...
      </motion.div>
    );
  }

  return (
    <motion.main
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container className="py-5">
        <h1 className="text-center mb-4 fs-1">🌸 Tìm Cửa Hàng Bán Hoa</h1>
        <Form.Group className="mb-4 mx-auto" style={{ maxWidth: "400px" }}>
          <Form.Label className="fs-5">Chọn tỉnh/thành phố:</Form.Label>
          <Form.Select
            id="city-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {Object.keys(locations).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <MapWrapper city={selectedCity} />
      </Container>
    </motion.main>
  );
}
