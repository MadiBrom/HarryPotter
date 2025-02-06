import React, { useEffect, useState } from "react";
import {
  getHouses,
  fetchSpells,
  getElixirs,
  getStudents,
  getTeachers,
} from "../API/api";
import { useNavigate } from "react-router-dom";
import "./css/index.css";

// Modal component for displaying spell/elixir details
const Modal = ({ children, onClose }) => (
  <div className="modal">
    <div className="modal-content">
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

// Destructure props correctly
const Index = ({ isLoggedIn, setIsLoggedIn }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentSpell, setCurrentSpell] = useState(null);
  const [currentElixir, setCurrentElixir] = useState(null);
  const [houses, setHouses] = useState([]);
  const [elixirs, setElixirs] = useState([]);
  const [spells, setSpells] = useState([]);
  const [groupedSpells, setGroupedSpells] = useState({});
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdowns, setOpenDropdowns] = useState({
    houses: false,
    elixirs: false,
    spells: false,
    characters: false, // Controls overall Characters section
    students: false,   // Controls Students dropdown
    teachers: false,   // Controls Teachers dropdown
    spellTypes: {},
    spellInfo: {},
    elixirInfo: {},
  });

  const navigate = useNavigate();

  // Check authentication status (e.g., via local storage)
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);

  // Fetch all data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          housesData,
          spellsData,
          elixirData,
          studentsData,
          teachersData,
        ] = await Promise.all([
          getHouses(),
          fetchSpells(),
          getElixirs(),
          getStudents(),
          getTeachers(),
        ]);

        setHouses(housesData);
        setSpells(spellsData);
        setElixirs(elixirData);
        setStudents(studentsData);
        setTeachers(teachersData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Group spells by type for easier display
  useEffect(() => {
    if (spells.length) {
      const grouped = spells.reduce((acc, spell) => {
        if (!acc[spell.type]) {
          acc[spell.type] = [];
        }
        acc[spell.type].push(spell);
        return acc;
      }, {});
      setGroupedSpells(grouped);
    }
  }, [spells]);

  // Modal functions
  const openSpellModal = (spell) => {
    setCurrentSpell(spell);
    setShowModal(true);
  };

  const openElixirModal = (elixir) => {
    setCurrentElixir(elixir);
    setShowModal(true);
  };

  // Toggle dropdown sections
  const toggleDropdown = (section) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const SpellTypes = Object.keys(groupedSpells);

  // Navigation functions
  const navigateToLogin = () => {
    navigate("/login");
  };

  const navigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="container">
      {/* Intro Section */}
      <section className="intro">
        <h1>Welcome to the Magical World of Harry Potter!</h1>
        <p>
          Step into the enchanted halls of Hogwarts and explore the magical
          houses, spells, elixirs, and characters that make up the rich wizarding
          world.
        </p>
        {/* Render login/register buttons only if not logged in */}
        {!isLoggedIn && (
          <div className="button-container">
            <button onClick={navigateToLogin} className="btn">
              Login
            </button>
            <button onClick={navigateToRegister} className="btn">
              Register
            </button>
          </div>
        )}
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
                {house.founder && (
                  <p>
                    <strong>Founder:</strong> {house.founder}
                  </p>
                )}
                {house.animal && (
                  <p>
                    <strong>Animal:</strong> {house.animal}
                  </p>
                )}
                {house.houseColours && (
                  <p>
                    <strong>House Colors:</strong> {house.houseColours}
                  </p>
                )}
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
                              onClick={() => openSpellModal(spell)}
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
                {elixir.effect && (
                  <p>
                    <strong>Effect:</strong> {elixir.effect}
                  </p>
                )}
                {elixir.difficulty && (
                  <p>
                    <strong>Difficulty:</strong> {elixir.difficulty}
                  </p>
                )}
                {elixir.characteristics && (
                  <p>
                    <strong>Characteristics:</strong> {elixir.characteristics}
                  </p>
                )}
                <button
                  onClick={() => openElixirModal(elixir)}
                  className="toggle-btn"
                >
                  Show Ingredients
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Characters Section */}
      <div className="dropdown">
        <button
          onClick={() => toggleDropdown("characters")}
          className="toggle-btn"
        >
          {openDropdowns.characters ? "Hide Characters" : "Show Characters"}
        </button>
        {openDropdowns.characters && (
          <div className="dropdown-content">
            {/* Students Dropdown */}
            <div className="dropdown">
              <button
                onClick={() => toggleDropdown("students")}
                className="toggle-btn"
              >
                {openDropdowns.students ? "Hide Students" : "Show Students"}
              </button>
              {openDropdowns.students && (
                <div className="dropdown-content">
                  <h2>Students</h2>
                  {students.length ? (
                    students.map((student) => (
                      <div key={student.id} className="card">
                        <h3>{student.name}</h3>
                        {student.house && (
                          <p>
                            <strong>House:</strong> {student.house}
                          </p>
                        )}
                        {student.wand &&
                          (student.wand.wood ||
                            student.wand.core ||
                            student.wand.length) && (
                            <div>
                              <p>
                                <strong>Wand:</strong>
                              </p>
                              {student.wand.wood && <p>Wood ~ {student.wand.wood}</p>}
                              {student.wand.core && <p>Core ~ {student.wand.core}</p>}
                              {student.wand.length && (
                                <p>Length ~ {student.wand.length} inches</p>
                              )}
                            </div>
                          )}
                      </div>
                    ))
                  ) : (
                    <p>No student data available.</p>
                  )}
                </div>
              )}
            </div>
            {/* Teachers Dropdown */}
            <div className="dropdown">
              <button
                onClick={() => toggleDropdown("teachers")}
                className="toggle-btn"
              >
                {openDropdowns.teachers ? "Hide Teachers" : "Show Teachers"}
              </button>
              {openDropdowns.teachers && (
                <div className="dropdown-content">
                  <h2>Teachers</h2>
                  {teachers.length ? (
                    teachers.map((teacher) => (
                      <div key={teacher.id} className="card">
                        <h3>{teacher.name}</h3>
                        {teacher.house && (
                          <p>
                            <strong>House:</strong> {teacher.house}
                          </p>
                        )}
                        {teacher.wand &&
                          (teacher.wand.wood ||
                            teacher.wand.core ||
                            teacher.wand.length) && (
                            <div>
                              <p>
                                <strong>Wand:</strong>
                              </p>
                              {teacher.wand.wood && <p>Wood ~ {teacher.wand.wood}</p>}
                              {teacher.wand.core && <p>Core ~ {teacher.wand.core}</p>}
                              {teacher.wand.length && (
                                <p>Length ~ {teacher.wand.length} inches</p>
                              )}
                            </div>
                          )}
                      </div>
                    ))
                  ) : (
                    <p>No teacher data available.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Spell Modal */}
      {showModal && currentSpell && (
        <Modal onClose={() => setShowModal(false)}>
          <h2>{currentSpell.name}</h2>
          {currentSpell.effect && (
            <p>
              <strong>Effect:</strong> {currentSpell.effect}
            </p>
          )}
          {currentSpell.light && (
            <p>
              <strong>Visual:</strong> {currentSpell.light}
            </p>
          )}
          {currentSpell.canBeVerbal && currentSpell.incantation && (
            <p>
              <strong>Incantation:</strong> {currentSpell.incantation}
            </p>
          )}
          {currentSpell.creator && (
            <p>
              <strong>Creator:</strong> {currentSpell.creator}
            </p>
          )}
        </Modal>
      )}

      {/* Elixir Modal */}
      {showModal && currentElixir && (
        <Modal onClose={() => setShowModal(false)}>
          <h2>{currentElixir.name}</h2>
          {currentElixir.effect && (
            <p>
              <strong>Effect:</strong> {currentElixir.effect}
            </p>
          )}
          {currentElixir.difficulty && (
            <p>
              <strong>Difficulty:</strong> {currentElixir.difficulty}
            </p>
          )}
          {currentElixir.characteristics && (
            <p>
              <strong>Characteristics:</strong> {currentElixir.characteristics}
            </p>
          )}
          <strong>Ingredients:</strong>
          {currentElixir.ingredients && currentElixir.ingredients.length > 0 ? (
            <ul>
              {currentElixir.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient.name}</li>
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
