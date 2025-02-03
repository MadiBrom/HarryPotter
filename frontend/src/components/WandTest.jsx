import React, { useState, useEffect } from 'react';
import { getUser, saveWandTestResults, updateWandTestResults, createWandTestResult } from '../API/api';// Adjust the import path to your API helper file

// -----------------
// Wood Questions
// -----------------
const woodQuestions = [
  {
    question: "Which environment calls to you most?",
    options: [
      { label: "Deep, ancient forest", scores: { oak: 2, willow: 0, holly: 1, yew: 0 } },
      { label: "A serene, enchanted grove", scores: { oak: 0, willow: 2, holly: 1, yew: 0 } },
      { label: "A mystical garden filled with secrets", scores: { oak: 0, willow: 0, holly: 2, yew: 1 } },
      { label: "The ruins of a forgotten castle", scores: { oak: 0, willow: 0, holly: 1, yew: 2 } },
    ],
  },
  {
    question: "How would you describe your personality?",
    options: [
      { label: "Strong and dependable", scores: { oak: 2, willow: 0, holly: 1, yew: 0 } },
      { label: "Flexible and intuitive", scores: { oak: 0, willow: 2, holly: 1, yew: 0 } },
      { label: "Noble and courageous", scores: { oak: 0, willow: 0, holly: 2, yew: 1 } },
      { label: "Mysterious and intense", scores: { oak: 0, willow: 0, holly: 1, yew: 2 } },
    ],
  },
];

// -----------------
// Core Questions
// -----------------
const coreQuestions = [
  {
    question: "What fuels your magical power?",
    options: [
      { label: "Passion and fiery determination", scores: { phoenix: 2, dragon: 0, unicorn: 1 } },
      { label: "Bravery and boldness", scores: { phoenix: 1, dragon: 2, unicorn: 0 } },
      { label: "Purity and gentle strength", scores: { phoenix: 0, dragon: 1, unicorn: 2 } },
    ],
  },
  {
    question: "How do you overcome obstacles?",
    options: [
      { label: "Rising from the ashes", scores: { phoenix: 2, dragon: 0, unicorn: 1 } },
      { label: "Charging head-on", scores: { phoenix: 1, dragon: 2, unicorn: 0 } },
      { label: "Staying calm and resilient", scores: { phoenix: 0, dragon: 1, unicorn: 2 } },
    ],
  },
];

// -----------------
// Length Questions
// -----------------
const lengthQuestions = [
  {
    question: "Which wand length appeals to you?",
    options: [
      { label: "Short and nimble", scores: { short: 2, medium: 0, long: 0 } },
      { label: "Average and balanced", scores: { short: 0, medium: 2, long: 0 } },
      { label: "Long and imposing", scores: { short: 0, medium: 0, long: 2 } },
    ],
  },
  {
    question: "How do you envision your magical influence?",
    options: [
      { label: "Subtle yet effective", scores: { short: 2, medium: 0, long: 0 } },
      { label: "Balanced and far-reaching", scores: { short: 0, medium: 2, long: 0 } },
      { label: "Grand and all-encompassing", scores: { short: 0, medium: 0, long: 2 } },
    ],
  },
];

// -----------------
// Combine Sections
// -----------------
const sections = [
  { key: "wood", questions: woodQuestions },
  { key: "core", questions: coreQuestions },
  { key: "length", questions: lengthQuestions },
];

// Initial scoring objects for each section
const initialScores = {
  wood: { oak: 0, willow: 0, holly: 0, yew: 0 },
  core: { phoenix: 0, dragon: 0, unicorn: 0 },
  length: { short: 0, medium: 0, long: 0 },
};

const WandTest = ({user, token, refreshProfile}) => {
  const [userData, setUserData] = useState("")
  // State to track current section/question
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sectionScores, setSectionScores] = useState(initialScores);
  const [showResult, setShowResult] = useState(false);
  

  
  // New state to store the user's chosen answers
  const [userAnswers, setUserAnswers] = useState([]);

  const currentSection = sections[currentSectionIndex];
  const currentQuestion = currentSection.questions[currentQuestionIndex];

  const submitWandTestResults = async () => {
    console.log("🔄 Preparing to submit wand test results...");

    // ✅ Corrected: Use getFinalWandDescription() instead of undefined generateWandResult()
    const generatedWandResult = getFinalWandDescription();

    if (!generatedWandResult) {
        console.error("❌ Missing wand details: Ensure all wand properties are set before submission.");
        return;
    }

    const testData = {
        userId: user.id,
        wandResult: generatedWandResult,
        answers: userAnswers, // ✅ Use userAnswers instead of answers
    };

    try {
        await saveWandTestResults(token, testData);
        console.log("✅ Wand test results saved successfully!");
    } catch (error) {
        console.error("❌ Error submitting wand test results:", error);
    }
};

  // Handle option selection: update scores, record answer, then advance
  const handleOptionClick = (option) => {
    // Record the answer details
    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        section: currentSection.key,
        question: currentQuestion.question,
        answer: option.label,
        scores: option.scores,
      },
    ]);

    // Update the scores for the current section
    setSectionScores((prevScores) => {
      const newScores = { ...prevScores };
      const sectionKey = currentSection.key;
      const sectionScore = { ...newScores[sectionKey] };
      Object.keys(option.scores).forEach((key) => {
        sectionScore[key] += option.scores[key];
      });
      newScores[sectionKey] = sectionScore;
      return newScores;
    });

    // Move to the next question or section
    if (currentQuestionIndex + 1 < currentSection.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      if (currentSectionIndex + 1 < sections.length) {
        setCurrentSectionIndex(currentSectionIndex + 1);
        setCurrentQuestionIndex(0);
      } else {
        // Test complete: show results
        setShowResult(true);
      }
    }
  };

  // Determine the top scoring result for a section
  const getSectionResult = (sectionKey) => {
    const scores = sectionScores[sectionKey];
    let maxScore = -Infinity;
    let resultKey = '';
    Object.keys(scores).forEach((key) => {
      if (scores[key] > maxScore) {
        maxScore = scores[key];
        resultKey = key;
      }
    });
    return resultKey;
  };

  // Build the final wand description
  const getFinalWandDescription = () => {
    const woodType = getSectionResult("wood");
    const coreType = getSectionResult("core");
    const lengthType = getSectionResult("length");

    const lengthMapping = {
      short: "9 inches",
      medium: "11 inches",
      long: "13 inches",
    };

    let woodDescription = "";
    switch (woodType) {
      case "oak":
        woodDescription = "Oak – strong and dependable";
        break;
      case "willow":
        woodDescription = "Willow – flexible and intuitive";
        break;
      case "holly":
        woodDescription = "Holly – noble and courageous";
        break;
      case "yew":
        woodDescription = "Yew – mysterious and powerful";
        break;
      default:
        woodDescription = woodType;
    }

    let coreDescription = "";
    switch (coreType) {
      case "phoenix":
        coreDescription = "Phoenix Feather – symbolizing rebirth and resilience";
        break;
      case "dragon":
        coreDescription = "Dragon Heartstring – fiery and bold";
        break;
      case "unicorn":
        coreDescription = "Unicorn Hair – pure and gentle";
        break;
      default:
        coreDescription = coreType;
    }

    const lengthDescription = lengthMapping[lengthType] || lengthType;

    return `Your wand is crafted from ${woodDescription} wood, imbued with a core of ${coreDescription}, and measures ${lengthDescription} in length.`;
  };


// After test completion, call the API to save the test results.
useEffect(() => {
  const saveResults = async () => {
    if (!showResult || !user || !token) {
      console.warn("⚠️ `saveResults` skipped because showResult is false or missing data.", {
        user,
        token,
        showResult,
      });
      return;
    }
  
    console.log("🔹 Token before API call:", token); // Debugging
  
    const testData = {
      userId: user.id,
      wandResult: getFinalWandDescription(),
      answers: userAnswers,
    };
  
    try {
      if (user.testResults && user.testResults.length > 0) {
        console.log("🔄 Updating existing wand test results...");
        const response = await updateWandTestResults(user.id, testData, token);
        console.log("✅ Wand test results updated:", response);
      } else {
        console.log("➕ Creating a new wand test result...");
        const response = await createWandTestResult(user.id, testData, token);
        console.log("✅ New wand test result created:", response);
      }
  
      if (refreshProfile) {
        refreshProfile();
      }
    } catch (error) {
      console.error("❌ Error saving wand test results:", error);
    }
  };
  
  if (user && token && showResult) {  
    saveResults();
  } else {
    console.warn("⚠️ `saveResults` skipped because showResult is false or missing data.");
  }
}, [user, token, showResult]); // ✅ Runs when user, token, or showResult changes




  // Restart the test
  const restartTest = () => {
    setCurrentSectionIndex(0);
    setCurrentQuestionIndex(0);
    setSectionScores(initialScores);
    setUserAnswers([]);
    setShowResult(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Discover Your Wand</h1>
      {showResult ? (
        <div>
          <h2>Your Wand</h2>
          <p>{getFinalWandDescription()}</p>
          <button onClick={restartTest}>Restart Test</button>
        </div>
      ) : (
        <div>
          <h2>{currentQuestion.question}</h2>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              style={{
                display: "block",
                margin: "10px 0",
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              {option.label}
            </button>
            
          ))}
          
        </div>
      )}<button onClick={submitWandTestResults}>Submit</button>
    </div>
  );
};

export default WandTest;
