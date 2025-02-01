import React, { useEffect, useState } from "react";
import { getHouses, fetchSpells, getElixirs } from "../API/api";
import { useNavigate } from "react-router-dom"; // Use useNavigate in React Router v6
import "./index.css";

const Modal = ({ children, onClose }) => (
  <div className="modal">
    <div className="modal-content">
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

const Index = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentSpell, setCurrentSpell] = useState(null);
  const [currentElixir, setCurrentElixir] = useState(null);
  const [houses, setHouses] = useState([]);
  const [elixirs, setElixirs] = useState([]);
  const [spells, setSpells] = useState([]);
  const [groupedSpells, setGroupedSpells] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdowns, setOpenDropdowns] = useState({
    houses: false,
    elixirs: false,
    spells: false,
    spellTypes: {},
    spellInfo: {},
    elixirInfo: {},
  });

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [housesData, spellsData, elixirData] = await Promise.all([
          getHouses(),
          fetchSpells(),
          getElixirs(),
        ]);
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

  const groupByType = (spells) => {
    return spells.reduce((acc, spell) => {
      if (!acc[spell.type]) {
        acc[spell.type] = [];
      }
      acc[spell.type].push(spell);
      return acc;
    }, {});
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const openSpellModal = (spell) => {
    setCurrentSpell(spell);
    setShowModal(true);
  };

  const openElixirModal = (elixir) => {
    setCurrentElixir(elixir);
    setShowModal(true);
  };

  const toggleDropdown = (section) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const SpellTypes = Object.keys(groupedSpells);

  // Navigate to Login page
  const navigateToLogin = () => {
    navigate("/login"); // Use navigate instead of useHistory
  };

  // Navigate to Register page
  const navigateToRegister = () => {
    navigate("/register"); // Use navigate instead of useHistory
  };

  return (
    <div className="container">
      {/* Intro Section */}
      <section className="intro">
        <h1>Welcome to the Magical World of Harry Potter!</h1>
        <p>
          Step into the enchanted halls of Hogwarts and explore the magical
          houses, spells, and elixirs that make up the rich wizarding world.
          To access the full experience, please login or register below.
        </p>
        <div className="button-container">
          <button onClick={navigateToLogin} className="btn">
            Login
          </button>
          <button onClick={navigateToRegister} className="btn">
            Register
          </button>
        </div>
      </section>

      {loading && <p className="loading">Loading data...</p>}
      {error && <p className="error">Error: {error}</p>}

      {/* Houses Section */}
      <div className="dropdown">
        <button onClick={() => toggleDropdown("houses")} className="toggle-btn">
          {openDropdowns.houses ? "Hide Houses" : "Show Houses"}
        </button>
        {openDropdowns.houses && (
          <div className="dropdown-content">
            {houses.map((house) => (
              <div key={house.id} className="card">
                <h3>{house.name}</h3>
                <p>
                  <strong>Founder:</strong> {house.founder}
                </p>
                <p>
                  <strong>Animal:</strong> {house.animal}
                </p>
                <p>
                  <strong>House Colors:</strong> {house.houseColours}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Spells Section */}
      <div className="dropdown">
        <button onClick={() => toggleDropdown("spells")} className="toggle-btn">
          {openDropdowns.spells ? "Hide Spells" : "Show Spells"}
        </button>
        {openDropdowns.spells && (
          <div className="dropdown-content">
            {SpellTypes.map((type) => (
              <div key={type}>
                <button
                  onClick={() => toggleDropdown(`spellTypes_${type}`)}
                  className="toggle-btn"
                >
                  {openDropdowns[`spellTypes_${type}`]
                    ? `Hide ${type} Spells`
                    : `Show ${type} Spells`}
                </button>
                {openDropdowns[`spellTypes_${type}`] && (
                  <div className="dropdown-content">
                    <ul>
                      {groupedSpells[type].map((spell) => (
                        <li key={spell.name}>
                          <div>
                            <span>{spell.name}</span>
                            <button
                              onClick={() => openSpellModal(spell)} // Open modal for spell
                              className="toggle-btn"
                            >
                              Show Details
                            </button>
                          </div>
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
        <button
          onClick={() => toggleDropdown("elixirs")}
          className="toggle-btn"
        >
          {openDropdowns.elixirs ? "Hide Elixirs" : "Show Elixirs"}
        </button>
        {openDropdowns.elixirs && (
          <div className="dropdown-content">
            {elixirs.map((elixir) => (
              <div key={elixir.id} className="card">
                <h3>{elixir.name}</h3>
                <p>
                  <strong>Effect:</strong> {elixir.effect ? elixir.effect : "Unknown"}
                </p>
                <p>
                  <strong>Difficulty:</strong> {elixir.difficulty ? elixir.difficulty : "Unknown"}
                </p>
                <p>
                  <strong>Characteristics:</strong> {elixir.characteristics ? elixir.characteristics : "Unknown"}
                </p>
                <button
                  onClick={() => openElixirModal(elixir)} // Open modal for elixir
                  className="toggle-btn"
                >
                  Show Ingredients
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Spell Modal */}
      {showModal && currentSpell && (
        <Modal onClose={() => setShowModal(false)}>
          <h2>{currentSpell.name}</h2>
          <p><strong>Effect:</strong> {currentSpell.effect}</p>
          <p><strong>Visual:</strong> {currentSpell.light}</p>
          {currentSpell.canBeVerbal && (
            <p><strong>Incantation:</strong> {currentSpell.incantation}</p>
          )}
          <p><strong>Creator:</strong> {currentSpell.creator || "Unknown"}</p>
        </Modal>
      )}

      {/* Elixir Modal */}
      {showModal && currentElixir && (
        <Modal onClose={() => setShowModal(false)}>
          <h2>{currentElixir.name}</h2>
          <p><strong>Effect:</strong> {currentElixir.effect}</p>
          <p><strong>Difficulty:</strong> {currentElixir.difficulty}</p>
          <p><strong>Characteristics:</strong> {currentElixir.characteristics}</p>
          <strong>Ingredients:</strong>
          {currentElixir.ingredients.length > 0 ? (
            <ul>
              {currentElixir.ingredients.map((ingredient, index) => (
                <p key={index}>{ingredient.name}</p>
              ))}
            </ul>
          ) : (
            <p>No ingredients listed.</p>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Index;
