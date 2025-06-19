export async function fetchFloristShops(bbox: string) {
  const query = `
    [out:json];
    node["shop"="florist"](${bbox});
    out body;
  `;

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });

  if (!response.ok) throw new Error("Failed to fetch Overpass data");

  const data = await response.json();
  return data.elements;
}
