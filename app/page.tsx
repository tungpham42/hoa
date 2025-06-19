"use client";

import MapWrapper from "@/components/MapWrapper";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container, Form, Alert, Card, Spinner } from "react-bootstrap";

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
        <Alert variant="danger">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      </motion.div>
    );
  }

  if (!locations) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <motion.main
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container className="py-4">
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="text-center py-4">
            <h1 className="display-5 mb-3 text-primary">
              <i className="bi bi-flower2 me-2"></i>
              Tìm Cửa Hàng Bán Hoa
            </h1>
            <p className="lead text-muted">
              Khám phá các cửa hàng hoa tươi đẹp nhất tại thành phố của bạn
            </p>
          </Card.Body>
        </Card>

        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <Form.Group>
              <Form.Label className="fw-bold mb-2">
                <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                Chọn tỉnh/thành phố:
              </Form.Label>
              <Form.Select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="form-select-lg"
              >
                {Object.keys(locations).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Card.Body>
        </Card>

        <MapWrapper city={selectedCity} />
      </Container>
    </motion.main>
  );
}
