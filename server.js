require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Ensure jwt is required
const path = require("path");


const app = express();
const port = 3333;

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Replace with your client URL
  methods: ["GET", "POST"], // Add other methods if needed
}));
app.use(express.json());


app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// Test route to verify server status
app.get("/test", (req, res) => {
  res.send("Server is up and running!");
});

// Registration route
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).send({ message: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });

    res.status(201).send(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error during registration', error: error.message });
  }
});


// Login route with detailed logging for debugging
app.post('/api/login', async (req, res) => {
  console.log('Request body:', req.body); // Log the incoming body

  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    res.status(200).json({ message: "Login successful", user });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
