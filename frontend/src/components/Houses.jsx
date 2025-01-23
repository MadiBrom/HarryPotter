import React, { useState } from "react";
import { fetchHouses } from "../API/api";

const Houses = () => {
  const [house, setHouse] = useState(null);
  const [error, setError] = useState(null);
  const [randomName, setRandomName] = useState(null);

  const houseIds = [
    { id: "0367baf3-1cb6-4baf-bede-48e17e1cd005", name: "Gryffindor" },
    { id: "805fd37a-65ae-4fe5-b336-d767b8b7c73a", name: "Ravenclaw" },
    { id: "85af6295-fd01-4170-a10b-963dd51dce14", name: "Hufflepuff" },
    { id: "a9704c47-f92e-40a4-8771-ed1899c9b9c1", name: "Slytherin" }
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

  const handleFetchRandomName = () => {
    try {
      setError(null); // Reset error state
      const randomHouse = houseIds[Math.floor(Math.random() * houseIds.length)];
      setRandomName(randomHouse.name); // Set random house name only
    } catch (err) {
      setError(err.message); // Display error if any
    }
  };

  return (
    <div>
      <h1>Harry Potter Houses</h1>
      <button onClick={() => handleFetchHouse("0367baf3-1cb6-4baf-bede-48e17e1cd005")}>Gryffindor</button>
      <button onClick={() => handleFetchHouse("805fd37a-65ae-4fe5-b336-d767b8b7c73a")}>Ravenclaw</button>
      <button onClick={() => handleFetchHouse("85af6295-fd01-4170-a10b-963dd51dce14")}>Hufflepuff</button>
      <button onClick={() => handleFetchHouse("a9704c47-f92e-40a4-8771-ed1899c9b9c1")}>Slytherin</button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {house && (
        <div style={{ marginTop: "20px" }}>
          <h2>{house.name}</h2>
          <p><strong>Founder:</strong> {house.founder}</p>
          <p><strong>Animal:</strong> {house.animal}</p>
          <p><strong>Traits:</strong> {house.traits.map(trait => trait.name).join(", ")}</p>
        </div>
      )}

      <button style={{ marginTop: "20px" }} onClick={handleFetchRandomName}>Fetch Random House</button>

      {randomName && (
        <div style={{ marginTop: "20px" }}>
          <h2>Random House</h2>
          <p>{randomName}</p> {/* Display the name of the randomly chosen house */}
        </div>
      )}
    </div>
  );
};

export default Houses;
