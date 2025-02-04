require("dotenv").config();
const path = require('path');
const multer = require('multer');
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",  // Adjust to match your frontend port
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(401).send('Invalid token.');
  }
};


const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("🔑 Received Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("❌ Missing or invalid token in request");
      return res.status(403).json({ error: "User not authenticated." });
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
  console.log("🟡 Extracted Token:", token);

  jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
          console.error("🔴 JWT Verification Failed:", err);
          return res.status(403).json({ error: "Invalid token." });
      }
      console.log("🟢 Token Verified:", user);
      req.user = user;
      next();
  });
};
const requireAdmin = (req, res, next) => {
  console.log("🛂 Checking Admin Access for:", req.user); // Log user data
  if (!req.user || !req.user.isAdmin) {
    console.error("🚫 Access Denied: User is not an admin.");
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  console.log("✅ Admin Access Granted");
  next();
};


// Use it in your routes
app.post("/api/admin/data", authenticateToken, requireAdmin, (req, res) => {
  // Admin-only route logic
});



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');  // Make sure this directory exists
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});


  const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 },  // 5MB limit, adjust according to needs
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
}).single('profilePic');


function checkFileType(file, cb) {
    // Allowed file types
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext and mime
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Adding the /api prefix in your Express server
app.post('/api/upload-profile-pic', authenticateToken, upload, async (req, res) => { // ✅ Ensure authenticateToken is first
  if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
  }
  try {
      console.log("📥 Received file:", req.file); // ✅ Log uploaded file
      console.log("🔑 User ID from token:", req.user?.userId); // ✅ Log user ID

      const filePath = `/uploads/${req.file.filename}`;
      const userId = req.user.userId;

      await prisma.user.update({
          where: { id: userId },
          data: { profilePicUrl: filePath }
      });

      res.json({ message: 'File Uploaded!', profilePicUrl: filePath });
  } catch (error) {
      console.error('❌ Error updating user profile:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Routes

// Test route
app.get("/test", (req, res) => {
  res.send("Server is up and running!");
});

// Register route
// Example backend code adjustment in your registration route
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password, isAdmin, secretKey } = req.body;

  // Optional: Check a secret key to allow setting isAdmin
  const isValidAdminKey = secretKey && secretKey === process.env.ADMIN_SECRET_KEY;
  
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
const newUser = await prisma.user.create({
  data: {
    username,
    email,
    password: hashedPassword,
    isAdmin: isValidAdminKey ? isAdmin : false,
    profilePicUrl: profilePicUrl || "/uploads/default_pic.jpg" // Ensure default pic
  },
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

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid login credentials." });
    }

    console.log("🟢 User logging in:", user); // Log user info

    // Ensure token includes isAdmin flag
    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("🟡 Generated Token:", token); // Log token before sending

    res.status(200).json({
      message: "Login successful.",
      token,
      user: { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error during login." });
  }
});


app.post('/api/auth/logout', (req, res) => {
  // Add logout logic here, like clearing the session or invalidating the token.
  res.status(200).json({ message: 'Logged out successfully' });
});


// Protected route to get user data
app.get("/api/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        isAdmin: true,
        profilePicUrl: true,
      },
    });

    console.log("📡 Backend Response Before Fix:", users);

    const sanitizedUsers = users.map(user => ({
      ...user,
      profilePicUrl: (!user.profilePicUrl || user.profilePicUrl === "null" || user.profilePicUrl === "")
        ? "http://localhost:3000/uploads/default_pic.jpg"
        : user.profilePicUrl
    }));

    console.log("✅ Backend Response After Fix:", sanitizedUsers);

    res.status(200).json(sanitizedUsers);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users." });
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


app.get("/api/user", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }, // ✅ Ensure this matches `token.userId`
      include: { testResults: true, wandTestResults: true },
    });

    console.log("🟢 User fetched from database:", user); // ✅ Log response

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      id: user.id,  // ✅ Ensure `id` is included in the response
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePicUrl: user.profilePicUrl,
      testResults: user.testResults,
      wandTestResults: user.wandTestResults,
    });
  } catch (error) {
    console.error("❌ Error fetching user data:", error);
    res.status(500).json({ message: "Error fetching user data." });
  }
});


app.put("/api/wand-results/:id", async (req, res) => {
  try {
    const { userId, wandResult, answers } = req.body;

    if (!userId || !wandResult || !Array.isArray(answers)) {
      console.error("❌ Invalid request data");
      return res.status(400).json({ error: "Invalid request data" });
    }

    let wandTest = await prisma.wandTestResult.findFirst({ where: { userId } });

    if (!wandTest) {
      console.log("⚠️ No existing wand test found, creating a new one...");
      wandTest = await prisma.wandTestResult.create({
        data: { userId, result: wandResult, answers },
      });
    } else {
      console.log("📝 Updating existing wand test...");
      wandTest = await prisma.wandTestResult.update({
        where: { id: wandTest.id },
        data: { result: wandResult, answers, updatedAt: new Date() },
      });
    }

    res.json(wandTest);
  } catch (error) {
    console.error("❌ Error updating wand test:", error);
    res.status(500).json({ error: "Failed to update wand test result" });
  }
});


app.post("/api/wand-results", async (req, res) => {
  try {
    console.log("📨 Received request body:", req.body);

    const { userId, wandResult, answers } = req.body;

    if (!userId || !wandResult || !answers || !Array.isArray(answers)) {
      console.error("❌ Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newWandTest = await prisma.wandTestResult.create({
      data: { userId, result: wandResult, answers },
    });

    console.log("✅ Successfully created wand test result:", newWandTest);
    res.status(201).json(newWandTest);
  } catch (error) {
    console.error("❌ Error creating wand test result:", error);
    res.status(500).json({ error: "Failed to create new wand test result" });
  }
});

app.put("/api/update-profile", authenticateToken, async (req, res) => {
  try {
    const { username, email, password, profilePicUrl } = req.body;
    const userId = req.user.userId;

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10); // Hash new password
    if (profilePicUrl) updateData.profilePicUrl = profilePicUrl;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Failed to update profile." });
  }
});



// Route to get a single user by ID
app.get('/api/user/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        testResults: true,
        wandTestResults: true
      }
    });

    if (!user) {
      return res.status(404).send('User not found'); // Send 404 if no user found
    }

    res.json(user); // Send the user data
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Internal server error'); // Handle unexpected errors
  }
});

app.put('/api/promote/:userId', authenticate, async (req, res) => {
  try {
      const user = await prisma.user.findUnique({
          where: { id: req.params.userId }
      });

      if (!user) {
          return res.status(404).send({ message: 'User not found.' });
      }

      if (user.isAdmin) {
          return res.status(400).send({ message: 'User is already an admin.' });
      }

      const updatedUser = await prisma.user.update({
          where: { id: req.params.userId },
          data: { isAdmin: true }
      });

      // Generate a new token with the updated admin flag
      const token = jwt.sign(
          { userId: updatedUser.id, isAdmin: updatedUser.isAdmin },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
      );

      res.send({
          message: 'User has been promoted to admin.',
          user: updatedUser,
          token: token  // Send the new token back to the user
      });
  } catch (error) {
      console.error('Error promoting user:', error);
      res.status(500).send({ message: 'Internal Server Error' });
  }
});


const fs = require('fs');
const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});