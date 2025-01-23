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

  const handleScrollToHouse = (houseName) => {
    const element = document.getElementById(houseName);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    // Fetch data for the clicked house
    const houseData = houseIds.find(house => house.name === houseName);
    if (houseData) {
      handleFetchHouse(houseData.id);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "200px",
          backgroundColor: "#333",
          color: "#fff",
          paddingTop: "20px",
          position: "fixed",
          top: "0",
          left: "0",
          height: "100%",
          overflow: "hidden",  // No scroll in the sidebar
        }}
      >
        <h2 style={{ textAlign: "center" }}>Houses</h2>
        <ul style={{ listStyle: "none", paddingLeft: "0" }}>
          {houseIds.map((houseData) => (
            <li key={houseData.id}>
              <button
                onClick={() => handleScrollToHouse(houseData.name)}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "transparent",
                  color: "#fff",
                  border: "none",
                  textAlign: "left",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {houseData.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: "200px", height: "100vh", overflow: "hidden" }}>
        {/* Only render house sections if a house is selected */}
        {house ? (
          houseIds.map((houseData) => (
            <div
              key={houseData.id}
              id={houseData.name}
              style={{
                height: "100vh",
                backgroundColor: houseData.backgroundColor,
                padding: "20px",
                color: houseData.textColor,
              }}
            >
              <h1>{houseData.name}</h1>

              {error && <p style={{ color: "red" }}>Error: {error}</p>}

              {/* Conditionally display house data if fetched */}
              {house && house.name === houseData.name && (
                <div style={{ marginTop: "20px" }}>
                  <p><strong>Founder:</strong> {house.founder}</p>
                  <p><strong>Animal:</strong> {house.animal}</p>
                  <p><strong>Traits:</strong> {house.traits.map((trait) => trait.name).join(", ")}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", marginTop: "50vh", fontSize: "24px" }}>
            Please select a house from the sidebar to view details.
          </p>
        )}
      </div>
    </div>
  );
};

export default Houses;
