import React, { useState } from "react";
import { fetchHouses } from "../API/api";

const Houses = () => {
  const [house, setHouse] = useState(null);
  const [error, setError] = useState(null);

  const houseIds = [
    { id: "0367baf3-1cb6-4baf-bede-48e17e1cd005", name: "Gryffindor", backgroundColor: "#b71c1c", textColor: "#ffd700" },
    { id: "805fd37a-65ae-4fe5-b336-d767b8b7c73a", name: "Ravenclaw", backgroundColor: "#0d47a1", textColor: "#000000" },
    { id: "85af6295-fd01-4170-a10b-963dd51dce14", name: "Hufflepuff", backgroundColor: "#ffeb3b", textColor: "#000000" },
    { id: "a9704c47-f92e-40a4-8771-ed1899c9b9c1", name: "Slytherin", backgroundColor: "#2e7d32", textColor: "#c0c0c0" }
  ];

  const handleFetchHouse = async (id) => {
    try {
      setError(null); // Reset error state
      const houseData = await fetchHouses(id);
      setHouse(houseData); // Set the house data
    } catch (err) {
      setError(err.message); // Display error if any
    }
  };

  return (
    <div style={{ overflowY: "scroll", scrollSnapType: "y mandatory", height: "100vh" }}>
      {houseIds.map((houseData) => (
        <div
          key={houseData.id}
          style={{
            height: "100vh",
            backgroundColor: houseData.backgroundColor,
            scrollSnapAlign: "start",
            padding: "20px",
            color: houseData.textColor
          }}
        >
          <h1>{houseData.name}</h1>
          <button onClick={() => handleFetchHouse(houseData.id)} style={{ color: houseData.textColor }}>
            Fetch {houseData.name} Details
          </button>

          {error && <p style={{ color: "red" }}>Error: {error}</p>}

          {house && house.name === houseData.name && (
            <div style={{ marginTop: "20px" }}>
              <h2>{house.name}</h2>
              <p><strong>Founder:</strong> {house.founder}</p>
              <p><strong>Animal:</strong> {house.animal}</p>
              <p><strong>Traits:</strong> {house.traits.map((trait) => trait.name).join(", ")}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Houses;
