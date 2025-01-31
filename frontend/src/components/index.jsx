import React, { useEffect, useState } from 'react';
import { getHouses, fetchSpells, getElixirs } from '../API/api';

const Index = () => {
  const [houses, setHouses] = useState([]);
  const [elixirs, setElixirs] = useState([]);
  const [spells, setSpells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isHousesOpen, setIsHousesOpen] = useState(false);
  const [isSpellsOpen, setIsSpellsOpen] = useState(false);
  const [isElixirsOpen, setIsElixirsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [housesData, spellsData, elixirData] = await Promise.all([getHouses(), fetchSpells(), getElixirs()]);
        setHouses(housesData);
        setSpells(spellsData);
        setElixirs(elixirData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>Welcome to the Harry Potter Site</h1>
      {loading && <p className="loading">Loading data...</p>}
      {error && <p className="error">Error: {error}</p>}

      {/* Houses Section */}
      <div className="dropdown">
        <button onClick={() => setIsHousesOpen(!isHousesOpen)} className="toggle-btn">
          {isHousesOpen ? 'Hide Houses' : 'Show Houses'}
        </button>
        {isHousesOpen && (
          <div className="dropdown-content">
            {houses.map((house) => (
              <div key={house.id} className="card">
                <h3>{house.name}</h3>
                <p><strong>Founder:</strong> {house.founder}</p>
                <p><strong>Animal:</strong> {house.animal}</p>
                <p><strong>House Colors:</strong> {house.houseColours}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Spells Section */}
      <div className="dropdown">
        <button onClick={() => setIsSpellsOpen(!isSpellsOpen)} className="toggle-btn">
          {isSpellsOpen ? 'Hide Spells' : 'Show Spells'}
        </button>
        {isSpellsOpen && (
          <div className="dropdown-content">
            {spells.map((spell) => (
              <div key={spell.id} className="card">
                <h3>{spell.name}</h3>
                <p><strong>Effect:</strong> {spell.effect}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Elixirs Section */}
      <div className="dropdown">
        <button onClick={() => setIsElixirsOpen(!isElixirsOpen)} className="toggle-btn">
          {isElixirsOpen ? 'Hide Elixirs' : 'Show Elixirs'}
        </button>
        {isElixirsOpen && (
          <div className="dropdown-content">
            {elixirs.map((elixir) => (
              <div key={elixir.id} className="card">
                <h3>{elixir.name}</h3>
                <p><strong>Effect:</strong> {elixir.effect}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
