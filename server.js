require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // Allow frontend to make requests
  methods: ["GET", "POST", "PUT", "DELETE"] // Allow PUT and other methods
}));


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

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid login credentials." });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    // Send response with token and user data
    res.status(200).json({
      message: "Login successful.",
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
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
// Protected route to get user data with test results
app.get("/api/user", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { testResults: true, wandTestResults: true },  // Including wand results
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);  // Returning the user with wand test results
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

app.put('/api/test-results/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;  // User ID from URL
  if (userId !== req.user.userId) {  // Ensure the userId matches the authenticated user's ID
    return res.status(403).json({ message: "Unauthorized to update other user's test results." });
  }

  const { houseResult, answers } = req.body;

  if (!houseResult || !answers) {
    return res.status(400).json({ message: "House result and answers are required." });
  }

  try {
    // Find the user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { testResults: true },  // Include test results in case you need to modify or replace them
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if there are existing test results for the user
    const existingTestResult = user.testResults.length > 0 ? user.testResults[0] : null;

    let updatedTestResults;

    if (existingTestResult) {
      // If test results exist, update them
      updatedTestResults = await prisma.testResult.update({
        where: { id: existingTestResult.id },
        data: {
          houseResult,
          answer: JSON.stringify(answers),  // Save answers as JSON
        },
      });
    } else {
      // If no test results exist, create a new one
      updatedTestResults = await prisma.testResult.create({
        data: {
          userId,
          houseResult,
          answer: JSON.stringify(answers),
        },
      });
    }

    res.status(200).json({
      message: "Test results updated successfully!",
      testResult: updatedTestResults,
    });
  } catch (error) {
    console.error("Error updating test results:", error);
    res.status(500).json({ message: "Error updating test results." });
  }
});


app.post("/api/wandTestResults", authenticateToken, async (req, res) => {
  const { wandResult, answers } = req.body;
  console.log("Received wand test data:", req.body);  // Good for debugging
  try {
      const newWandTestResult = await prisma.wandTestResult.create({
          data: {
              userId: req.user.userId,  // Authenticated user ID
              result: wandResult,
              answers: JSON.stringify(answers),  // Ensure answers are stored as JSON
          },
      });
      res.status(201).json({ message: "Wand test result saved successfully", wandTestResult: newWandTestResult });
  } catch (error) {
      console.error("Error saving wand test result:", error);
      res.status(500).json({ message: "Error saving wand test result." });
  }
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});