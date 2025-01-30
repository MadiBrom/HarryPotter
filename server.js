require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST"] }));
app.use(express.json());

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Expecting "Bearer <token>"
  if (!token) return res.status(401).json({ message: "Authentication token is missing." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token." });
    req.user = user; // Attach user data to request
    next();
  });
};

// Routes

// Test route
app.get("/test", (req, res) => {
  res.send("Server is up and running!");
});

// Register route
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });
    res.status(201).json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user.", error: error.message });
  }
});

// Login route
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid login credentials." });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful.", token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error during login.", error: error.message });
  }
});
app.post('/api/auth/logout', (req, res) => {
  // Add logout logic here, like clearing the session or invalidating the token.
  res.status(200).json({ message: 'Logged out successfully' });
});


// Protected route to get user data
app.get("/api/user", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ id: user.id, username: user.username, email: user.email });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Error fetching user data." });
  }
});

app.get("/api/test-results", authenticateToken, async (req, res) => {
  try {
    const testResults = await prisma.testResult.findMany({ where: { userId: req.user.userId } });
    res.status(200).json(testResults);
  } catch (error) {
    console.error("Error fetching test results:", error);
    res.status(500).json({ message: "Error fetching test results." });
  }
});

app.post("/api/saveTestResults", authenticateToken, async (req, res) => {
  const { houseResult, answers } = req.body;
  if (!houseResult || !answers) {
    return res.status(400).json({ message: "Test result and answers are required." });
  }

  try {
    const newTestResult = await prisma.testResult.create({
      data: {
        userId: req.user.userId,
        houseResult,
        answer: JSON.stringify(answers), // Store answers as JSON
      },
    });

    res.status(201).json({ message: "Test result saved successfully!", testResult: newTestResult });
  } catch (error) {
    console.error("Error saving test result:", error);
    res.status(500).json({ message: "Error saving test result." });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});