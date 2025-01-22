WizardQuest

Welcome to WizardQuest, an interactive platform that immerses you in a magical world of spells, potions, and wizarding adventures. This project leverages the Wizard World API to bring the fantastical universe to life, allowing players to explore, learn, and master their magical abilities.

Features

1. Character Creation

Design your own wizard or witch by choosing a house, wand, and magical specialty.

Automatically generate unique character traits using data from the Wizard World API.

2. Spell Mastery Challenges

Unlock and practice spells through interactive challenges and magical duels.

Each spell includes descriptions and effects retrieved directly from the API.

3. Potion Brewing

Gather ingredients and brew potions in a step-by-step process.

Recipes and potion effects are sourced from the API for an authentic magical experience.

4. Interactive Map

Explore iconic locations like Hogwarts, Diagon Alley, and Hogsmeade.

Interact with characters and discover secrets hidden in the magical world.

5. Daily Challenges and Quests

Take on quests such as finding specific spells, meeting characters, or solving magical puzzles.

Example: "Use a spell that unlocks doors to escape a locked room!"

6. Wizard Duels (PvE and PvP)

Engage in strategic duels by selecting spells and countering opponents.

All spells and effects are integrated from the Wizard World API.

7. Trivia and Knowledge Tests

Test your knowledge of spells, potions, and characters through trivia challenges.

Questions are dynamically generated using data from the API.

8. Progression System

Level up your character and unlock new spells, potions, and achievements as you progress.

Technology Stack

Frontend: React or Vue.js for an interactive and responsive user interface.

Backend: Node.js with Express for handling API requests and game logic.

Database: MongoDB or PostgreSQL to manage user data, progress, and inventory.

API Integration: Wizard World API for accessing spells, potions, characters, and other magical elements.

Hosting: Deployed on platforms like Vercel or Heroku for seamless access.

How to Run the Project

Prerequisites

Node.js and npm installed.

API key (if required by the Wizard World API).

Setup

Clone this repository:

git clone https://github.com/your-repo/wizardquest.git

Navigate to the project directory:

cd wizardquest

Install dependencies:

npm install

Set up environment variables:

Create a .env file in the root directory.

Add the following:

API_BASE_URL=https://wizard-world-api.herokuapp.com/api

Start the development server:

npm start

Access the platform at http://localhost:3000.

Credits

This platform is powered by the Wizard World API, created by Andrzej Rup. We deeply appreciate their work in making detailed magical world data accessible for developers.

Contributions

Contributions are welcome! If you'd like to contribute:

Fork the repository.

Create a new branch for your feature or fix:

git checkout -b feature-name

Commit your changes:

git commit -m "Add feature description"

Push to your branch:

git push origin feature-name

Open a pull request.