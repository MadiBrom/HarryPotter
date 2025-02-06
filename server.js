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
  console.log("Authorization header received:", authHeader);  // Log header to debug

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ error: "No token or invalid token format." });
  }

  const token = authHeader.split(" ")[1];  // Extract token from the header

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT verification failed:", err);
      return res.status(403).json({ error: "Invalid token." });
    }

    console.log("Decoded user:", user);  // Log the decoded user data for debugging
    req.user = user;
    next();
  });
};


const demoteAdminInDB = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false };  // User not found
    }

    // If the user is already a regular user, we don't need to do anything
    if (!user.isAdmin) {
      return { success: false };  // Already a regular user
    }

    // Update the user role to 'user'
    await prisma.user.update({
      where: { id: userId },
      data: { isAdmin: false },
    });

    return { success: true };  // Successfully demoted
  } catch (error) {
    console.error("Error during demotion:", error);
    throw error;
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    console.error("Access Denied: User is not an admin.");
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
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

app.delete('/api/users/:userId', authenticateToken, requireAdmin, async (req, res) => {
  console.log("Received delete request for user ID:", req.params.userId);
  try {
    const user = await prisma.user.delete({
      where: { id: req.params.userId }
    });
    console.log("Deleted user:", user);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error("Error during deletion:", err);
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// Register route
// Example backend code adjustment in your registration route
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password, isAdmin, secretKey, profilePicUrl } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // ❗ Always hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,  // ✅ Ensure we store the hashed password
        isAdmin: isAdmin || false,
        profilePicUrl: profilePicUrl || "/uploads/default_pic.jpg",
      },
    });

    res.status(201).json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user.", error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log("❌ No user found with this email:", email);
      return res.status(401).json({ message: "Invalid login credentials." });
    }

    console.log("🟢 Found user:", user);

    // 🔍 Log the input password and stored hashed password
    console.log("🔵 Entered Password:", password);
    console.log("🔵 Stored Hashed Password:", user.password);

    // ✅ Compare password correctly
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("❌ Password does not match for:", email);
      return res.status(401).json({ message: "Invalid login credentials." });
    }

    console.log("✅ Password matches, logging in user...");

    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      user: { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (error) {
    console.error("❌ Error during login:", error);
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
        bodyColor: true  // Include bodyColor in the selection
      },
    });
    res.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    res.status(500).send("Error fetching user data.");
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
      bodyColor: user.bodyColor,
      testResults: user.testResults,
      wandTestResults: user.wandTestResults,
    });
  } catch (error) {
    console.error("❌ Error fetching user data:", error);
    res.status(500).json({ message: "Error fetching user data." });
  }
});

// Example Node.js/Express backend handler
app.put('/api/user/:userId', async (req, res) => {
  const { bodyColor, username, email, password, profilePicUrl } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.params.userId },
      data: {
        username,
        email,
        password, // Make sure to handle password updates securely
        profilePicUrl,
        bodyColor
      }
    });
    res.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user:", error);
    res.status(500).send("Internal Server Error");
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

app.put('/api/update-profile', authenticateToken, async (req, res) => {
  const { bodyColor, username, email, password, profilePicUrl } = req.body;
  const userId = req.user.userId;

  try {
    // Retrieve the current user
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // 🔹 Ensure password is hashed only if it's being updated
    let updatedPassword = existingUser.password;
    if (password && password !== existingUser.password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    // 🔹 Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email,
        password: updatedPassword,  // ✅ This ensures password is properly hashed
        profilePicUrl,
        bodyColor,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to get a single user by ID
// Fetch a single user by ID
app.get("/api/user/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        testResults: true, // include other related data as needed
        wandTestResults: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePicUrl: user.profilePicUrl,
      bodyColor: user.bodyColor, // ensure this is included
      testResults: user.testResults,
      wandTestResults: user.wandTestResults
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Error fetching user data" });
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

app.put('/api/demoteAdmin/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await demoteAdminInDB(userId);  // Call the database function to demote the user
    if (result.success) {
      return res.status(200).json({ message: 'Admin demoted successfully' });
    } else {
      return res.status(404).json({ message: 'User not found or already a regular user' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/api/posts', async (req, res) => {
  const { userId, content } = req.body;
  console.log("Received post request with:", req.body); // Log the entire request body

  if (!userId || !content) {
    console.error("Missing userId or content");
    return res.status(400).json({ error: 'User ID and content are required' });
  }

  try {
    const post = await prisma.post.create({
      data: {
        content,
        userId,
      },
    });
    console.log("Post created successfully:", post);
    return res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ error: 'Failed to create post', message: error.message });
  }
});



// Route to get all posts (could later be updated to get posts for a specific user)
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true, // Include user info in the response
      },
    });
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch posts' });
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