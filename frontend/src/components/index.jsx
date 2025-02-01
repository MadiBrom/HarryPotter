import React, { useEffect, useState } from 'react';
import { getHouses, fetchSpells, getElixirs } from '../API/api';

const Modal = ({ children, onClose }) => (
  <div className="modal">
    <div className="modal-content">
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

const Index = () => {
  const [houses, setHouses] = useState([]);
  const [elixirs, setElixirs] = useState([]);
  const [spells, setSpells] = useState([]);
  const [groupedSpells, setGroupedSpells] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHousesOpen, setIsHousesOpen] = useState(false);
  const [isElixirsOpen, setIsElixirsOpen] = useState(false);
  const [isSpellsDropdownOpen, setIsSpellsDropdownOpen] = useState(false);
  const [isSpellTypeOpen, setIsSpellTypeOpen] = useState({});
  const [isSpellInfoOpen, setIsSpellInfoOpen] = useState({});

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

  useEffect(() => {
    if (spells.length) {
      const grouped = groupByType(spells);
      setGroupedSpells(grouped);
    }
  }, [spells]);

  // Group spells by type
  const groupByType = (spells) => {
    return spells.reduce((acc, spell) => {
      if (!acc[spell.type]) {
        acc[spell.type] = [];
      }
      acc[spell.type].push(spell);
      return acc;
    }, {});
  };

  const handleTypeToggle = (type) => {
    setIsSpellTypeOpen((prevState) => ({
      ...prevState,
      [type]: !prevState[type],
    }));
  };

  const handleSpellInfoToggle = (spellName) => {
    setIsSpellInfoOpen((prevState) => ({
      ...prevState,
      [spellName]: !prevState[spellName],
    }));
  };

  // Dynamically calculate SpellTypes from the groupedSpells state
  const SpellTypes = Object.keys(groupedSpells);

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
        <button onClick={() => setIsSpellsDropdownOpen(!isSpellsDropdownOpen)} className="toggle-btn">
          {isSpellsDropdownOpen ? 'Hide Spells' : 'Show Spells'}
        </button>
        {isSpellsDropdownOpen && (
          <div className="dropdown-content">
            {SpellTypes.map((type) => (
              <div key={type}>
                <button onClick={() => handleTypeToggle(type)} className="toggle-btn">
                  {isSpellTypeOpen[type] ? `Hide ${type} Spells` : `Show ${type} Spells`}
                </button>
                {isSpellTypeOpen[type] && (
                  <div className="dropdown-content">
                    <ul>
                      
                      {groupedSpells[type].map((spell) => (
                        <li key={spell.name}>
                          <div>
                            {spell.name}
                            <button
                              onClick={() => handleSpellInfoToggle(spell.name)}
                              className="toggle-btn"
                            >
                              {isSpellInfoOpen[spell.name] ? 'Hide Details' : 'Show Details'}
                            </button>
                          </div>
                          {isSpellInfoOpen[spell.name] && (
                            <div className="spell-info">
                              <p><strong>Effect:</strong> {spell.effect}</p>
                              <p><strong>Incantation:</strong> {spell.incantation}</p>
                              <p><strong>Wand Movement:</strong> {spell.wandMovement}</p>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
