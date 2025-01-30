import React, { useState, useEffect } from 'react';
import './Test.css';
import { saveTestResults, getUser } from '../API/api';

const traits = {
  Gryffindor: {
    Courage: [
      'Do you stand up for others in challenging situations?',
      'Are you willing to take risks when needed?',
      'Do you face your fears rather than avoid them?',
      'Do you find yourself staying calm in emergencies?',
      'Would you describe yourself as brave?'
    ],
    Determination: [
      'Do you finish what you start, even when it gets tough?',
      'Do you stick to your goals despite setbacks?',
      'Do you work hard to achieve what you want?',
      'Are you consistent in pursuing your dreams?',
      'Do you have a strong will to succeed?'
    ],
    Bravery: [
      'Do you take on challenges that scare others?',
      'Do you stand firm in your beliefs, even under pressure?',
      'Are you willing to confront your fears directly?',
      'Do you see yourself as someone who takes bold action?',
      'Do you prioritize doing the right thing over staying safe?'
    ],
    Daring: [
      'Do you enjoy taking bold, calculated risks?',
      'Are you adventurous and thrill-seeking?',
      'Do you often lead in situations requiring bravery?',
      'Are you willing to try something new despite potential failure?',
      'Do you feel alive when facing the unknown?'
    ],
    Nerve: [
      'Do you remain composed when others panic?',
      'Are you confident in high-stakes situations?',
      'Do you feel capable of standing up to authority if needed?',
      'Do you thrive in scenarios where others hesitate?',
      'Are you described as bold and courageous under pressure?'
    ]
  },
  Ravenclaw: {
    Creativity: [
      'Do you enjoy coming up with new ideas?',
      'Do you solve problems in unique ways?',
      'Do you enjoy artistic or creative hobbies?',
      'Are you open to experimenting with unconventional methods?',
      'Do you often think "outside the box"?'
    ],
    Intelligence: [
      'Do you enjoy learning new things?',
      'Are you quick to grasp complex concepts?',
      'Do you value knowledge and understanding?',
      'Are you curious and eager to explore new topics?',
      'Do others describe you as intellectually gifted?'
    ],
    Wisdom: [
      'Do you give thoughtful advice to others?',
      'Are you good at seeing the big picture in difficult situations?',
      'Do you approach challenges with patience and insight?',
      'Are you known for your good judgment?',
      'Do people come to you for guidance and understanding?'
    ],
    Wit: [
      'Do you have a sharp sense of humor?',
      'Are you quick with comebacks in conversations?',
      'Do you enjoy wordplay and clever jokes?',
      'Are you skilled at finding humorous perspectives in life?',
      'Do you find joy in intellectual banter?'
    ],
    Learning: [
      'Do you pursue knowledge for the sake of personal growth?',
      'Do you enjoy reading books or researching topics?',
      'Are you motivated to expand your skills or expertise?',
      'Do you seek out new information whenever possible?',
      'Are you curious about how things work?'
    ]
  },
  Hufflepuff: {
    Hardworking: [
      'Do you put in the effort required to achieve your goals?',
      'Are you persistent in completing tasks, no matter how tedious?',
      'Do you take pride in the work you do?',
      'Do you go above and beyond expectations?',
      'Are you willing to dedicate time to improve your skills?'
    ],
    Patience: [
      'Do you stay calm when things don’t go your way?',
      'Are you willing to wait for results without frustration?',
      'Do you approach problems with a steady and thoughtful mindset?',
      'Do you avoid rushing decisions and actions?',
      'Do you give people the time they need to improve or change?'
    ],
    Loyalty: [
      'Do you stand by your friends and family in difficult times?',
      'Are you trustworthy and reliable?',
      'Do you value long-term commitments over temporary gains?',
      'Are you willing to support others unconditionally?',
      'Do you prioritize relationships over personal gain?'
    ],
    Fairness: [
      'Do you treat others equally, regardless of differences?',
      'Do you stand up for justice when you see unfairness?',
      'Are you committed to making decisions based on honesty?',
      'Do you believe in giving everyone a fair chance?',
      'Are you impartial when resolving conflicts?'
    ],
    Modesty: [
      'Do you prefer letting your actions speak for themselves?',
      'Are you uncomfortable with excessive praise or attention?',
      'Do you value humility over arrogance?',
      'Are you more focused on doing good than being recognized for it?',
      'Do you avoid boasting about your achievements?'
    ]
  },
  Slytherin: {
    Ambition: [
      'Do you set high goals for yourself?',
      'Do you work tirelessly to achieve your dreams?',
      'Do you actively seek opportunities for advancement?',
      'Are you willing to put in extra effort to stand out?',
      'Do you enjoy striving for success in competitive environments?'
    ],
    Resourcefulness: [
      'Are you good at finding solutions to problems with limited resources?',
      'Do you adapt quickly when faced with challenges?',
      'Are you creative in using what’s available to achieve your goals?',
      'Do you think on your feet when plans change?',
      'Are you skilled at making the most of opportunities?'
    ],
    Cunning: [
      'Do you plan ahead to gain an advantage in situations?',
      'Are you skilled at persuading others to see things your way?',
      'Do you know how to navigate complex social situations?',
      'Are you strategic when working toward your goals?',
      'Are you often described as calculating or shrewd?'
    ],
    Pride: [
      'Are you confident in your abilities and accomplishments?',
      'Do you take pride in the quality of your work?',
      'Do you hold yourself to high standards?',
      'Do you strive to be the best in what you do?',
      'Are you unapologetically self-assured in your decisions?'
    ],
    SelfPreservation: [
      'Do you prioritize your safety and well-being in tough situations?',
      'Are you strategic about protecting your interests?',
      'Do you know when to walk away from unwise risks?',
      'Do you avoid actions that could harm your long-term goals?',
      'Are you careful about who you trust?'
    ]
  }
};
const Modal = ({ houseResult, userData, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Congratulations!</h2>
        <p>You belong to: </p>
        {userData && (
          <div>
            <p><strong>House Results:</strong> {userData.houseResult}</p>
          </div>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};


const Test = ({ token }) => {
  const [answers, setAnswers] = useState({});
  const [houseResult, setHouseResult] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState(null);
  const questionsPerPage = 20;
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  useEffect(() => {
    const allQuestions = Object.entries(traits).flatMap(([house, qualities]) =>
      Object.entries(qualities).flatMap(([trait, questions]) =>
        questions.map(question => ({ house, trait, question }))
      )
    );

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    setShuffledQuestions(shuffleArray(allQuestions));
  }, []);

  const getQuestionsForPage = () => {
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = currentPage * questionsPerPage;
    return shuffledQuestions.slice(startIndex, endIndex);
  };

  const handleAnswerChange = (house, trait, question, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [house]: {
        ...prev[house],
        [trait]: {
          ...prev[house]?.[trait],
          [question]: answer,
        },
      },
    }));
  };

  const calculateHouse = async () => {
    const houseScores = {
      Gryffindor: 0,
      Ravenclaw: 0,
      Hufflepuff: 0,
      Slytherin: 0,
    };

    Object.entries(answers).forEach(([house, traits]) => {
      Object.entries(traits).forEach(([trait, questions]) => {
        Object.entries(questions).forEach(([question, answer]) => {
          houseScores[house] += answer || 0; // Ensure it defaults to 0 if undefined
        });
      });
    });

    const maxScoreHouse = Object.keys(houseScores).reduce((maxHouse, currentHouse) =>
      houseScores[currentHouse] > houseScores[maxHouse] ? currentHouse : maxHouse
    );

    setHouseResult(maxScoreHouse);

    // Fetch user data from the API
    try {
      const userData = await getUser(token);
      setUserData(userData);  // Set the fetched user data
    } catch (error) {
      console.error("Error fetching user data:", error);
    }

    // Save test results to API
    await saveTestResults(token, {
      houseResult: maxScoreHouse,
      answers: answers,
    });
    console.log("Saving test results...", {
      houseResult: maxScoreHouse,
      answers: answers,
    });
    
    try {
      const response = await saveTestResults(token, {
        houseResult: maxScoreHouse,
        answers: answers,
      });
    
      console.log("Test results saved successfully:", response);
    } catch (error) {
      console.error("Error saving test results:", error);
    }
    
  };
  

  const changePage = (direction) => {
    if (direction === 'next' && currentPage < Math.ceil(shuffledQuestions.length / questionsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
console.log(houseResult);

  return (
    <div className="test-container">
      <h1>Which House Are You?</h1>

      <div className="pagination-controls">
        <button onClick={() => changePage('prev')} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {Math.ceil(shuffledQuestions.length / questionsPerPage)}</span>
        <button onClick={() => changePage('next')} disabled={currentPage === Math.ceil(shuffledQuestions.length / questionsPerPage)}>
          Next
        </button>
      </div>

      {getQuestionsForPage().map(({ house, trait, question }, index) => (
        <div key={index} className="question-item">
          <h3>{question}</h3>
          <label className="range-label">Strongly Disagree</label>
          <input
            type="range"
            className="range-input"
            min="-2"
            max="2"
            value={answers[house]?.[trait]?.[question] ?? 0} // Ensure a default value of 0
            onChange={(e) => handleAnswerChange(house, trait, question, Number(e.target.value))}
          />
          <label className="range-label">Strongly Agree</label>
        </div>
      ))}

      <div className="pagination-controls">
        <button onClick={() => changePage('prev')} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {Math.ceil(shuffledQuestions.length / questionsPerPage)}</span>
        <button onClick={() => changePage('next')} disabled={currentPage === Math.ceil(shuffledQuestions.length / questionsPerPage)}>
          Next
        </button>
      </div>

      <br />
      <button className="submit-btn" onClick={calculateHouse}>Submit</button>

      {houseResult && <Modal houseResult={houseResult} userData={userData} onClose={() => setHouseResult(null)} />}
    </div>
  );
};


export default Test;