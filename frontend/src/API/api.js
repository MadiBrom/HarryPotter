const API_URL = "https://wizard-world-api.herokuapp.com";
const api_url = "http://localhost:3000/api";
const potter_url = "https://hp-api.onrender.com"

// Helper Function to handle errors
const handleErrorResponse = async (response) => {
  const errorData = await response.json();
  throw new Error(errorData.message || 'An unexpected error occurred.');
};


// Create New User
const createNewUser = async (username, email, password) => {
  try {
    const response = await fetch(`${api_url}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData); // Debug log
      throw new Error(errorData.message || "Registration failed.");
    }

    return await response.json(); // Return parsed JSON response
  } catch (error) {
    console.error("Error during registration:", error);
    return { error: error.message };
  }
};


export default createNewUser;

// In your src/API/api.js

export const registerUser = async ({ username, email, password, isAdmin = false, secretKey }) => {
  const response = await fetch(`${api_url}/auth/register`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          username,
          email,
          password,
          isAdmin,
          secretKey  // Include secretKey if you are using it for admin registration
      })
  });
  const data = await response.json();
  return data; // Return the response data for further processing
};


// Login User
export async function loginUser({ email, password }) {
  console.log("Sending login request with:", { email, password }); // Debug log

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  try {
    const response = await fetch(`${api_url}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // Ensure payload matches the backend expectations
    });
    console.log("Sending login request with:", response);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Login error response:", errorData); // Debug log
      throw new Error(errorData.message || "Login failed.");
    }
    return await response.json(); // Expect token and user data
  } catch (error) {
    console.error("Error during login:", error.message); // Debug log
    throw error;
  }
}


// Fetch a House
export async function fetchHouses(id) {
  try {
    const response = await fetch(`${API_URL}/Houses/${id}`);
    if (!response.ok) {
      throw new Error("Error fetching house");
    }
    const housesData= await response.json();
    return housesData;
  } catch (error) {
    console.error("Error fetching the house:", error);
    throw error;
  }
}

export async function getHouses() {
  try {
    const response = await fetch(`${API_URL}/Houses`);
    if (!response.ok) {
      throw new Error("Error fetching house");
    }
    const housesData= await response.json();
    return housesData;
  } catch (error) {
    console.error("Error fetching the house:", error);
    throw error;
  }
}

export async function getElixirs() {
  try {
    const response = await fetch(`${API_URL}/Elixirs`);
    if (!response.ok) {
      throw new Error("Error fetching elixir");
    }
    const elixirData= await response.json();
    return elixirData;
  } catch (error) {
    console.error("Error fetching the elixir:", error);
    throw error;
  }
}

export async function getStudents() {
  try {
    const response = await fetch(`${potter_url}/api/characters/students`);
    if (!response.ok) {
      throw new Error("Error fetching student");
    }
    const studentData= await response.json();
    return studentData;
  } catch (error) {
    console.error("Error fetching the student:", error);
    throw error;
  }
}

export async function getTeachers() {
  try {
    const response = await fetch(`${potter_url}/api/characters/staff`);
    if (!response.ok) {
      throw new Error("Error fetching staff member");
    }
    const staffData= await response.json();
    return staffData;
  } catch (error) {
    console.error("Error fetching the staff member:", error);
    throw error;
  }
}

export const fetchSpells = async () => {
  try {
    const response = await fetch(`${API_URL}/Spells`);
    if (!response.ok) {
      throw new Error("Error fetching spells");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching spells:", error);
    throw error;
  }
};

export const getUser = async (token) => {
  if (!token) {
    console.error("❌ No token provided to getUser");
    return { error: "No token provided" };
  }

  try {
    const response = await fetch(`${api_url}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("🔵 Token passed to getUser:", token);

    if (!response.ok) {
      throw new Error(`❌ API Error: ${response.status} - ${response.statusText}`);
    }

    const userData = await response.json();
    console.log("🟢 Received user data from API:", userData); // ✅ Log full response

    return userData; // ✅ Ensure response includes `id`
  } catch (error) {
    console.error("❌ Error in getUser:", error);
    return { error: error.message };
  }
};

export const updateTestResults = async (userId, houseResult, answers, token) => {
  try {
    const response = await fetch(`${api_url}/test-results/${userId}
`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Include the JWT token in the Authorization header
      },
      body: JSON.stringify({
        houseResult,
        answers,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Test results updated:", data);
    } else {
      const errorData = await response.json();
      console.error("Error updating test results:", errorData.message);
    }
  } catch (error) {
    console.error("Error saving test results:", error);
  }
};


export const logoutUser = async (token) => {
  try {
    const response = await fetch(`${api_url}/auth/logout`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to logout");
    }
    return await response.json();
  } catch (error) {
    console.error("Error during logout:", error.message);
    throw error;
  }
};

export const saveTestResults = async (token, testData) => {
  if (!token) {
    console.error("❌ No token provided to saveTestResults!");
    return;
  }

  try {
    const response = await fetch(`${api_url}/saveTestResults`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Error saving test results:", errorData);
      throw new Error(errorData.message || "Failed to save test results.");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ API Error in saveTestResults:", error);
    throw error;
  }
};


// Fetch test results
export const fetchTestResults = async (token) => {
  try {
    const response = await fetch(`${api_url}/test-results`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return handleErrorResponse(response);

    return await response.json();
  } catch (error) {
    console.error("Error fetching test results:", error);
  }
};

export const saveWandTestResults = async (token, testData) => {
  try {
    const response = await fetch(`${api_url}/wandTestResults`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(testData),
    });
    console.log("Sending testData:", testData);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error saving wand test results:", errorData.message);
      throw new Error(errorData.message || "Failed to save wand test results.");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error in saveWandTestResults:", error);
    throw error;
  }
};

// Update Wand Test Results
export const updateWandTestResults = async (userId, testData, token) => {
  try {
    console.log("🔵 Sending PUT request to update wand test results...");
    console.log("📨 Data being sent:", testData);

    const response = await fetch(`${api_url}/wand-results/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("❌ Server responded with error:", errorResponse);
      throw new Error("Failed to update wand test results.");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating wand test results:", error);
    throw error;
  }
};




export const createWandTestResult = async (userId, testData, token) => {
  console.log("✅ Sending to API:", JSON.stringify(testData)); // Debug output

  try {
    const response = await fetch(`${api_url}/wand-results`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(testData), // Ensure body is JSON
    });

    if (!response.ok) {
      throw new Error("Failed to create new wand test result.");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error creating wand test result:", error);
    throw error;
  }
};

// In your /src/API/api.js file

export async function uploadProfilePic(formData, token) {
  console.log("🔵 Bearer token being sent:", `Bearer ${token}`);

  if (!token) {
      console.error("❌ No token provided for uploadProfilePic!");
      return { error: "No token provided" };
  }

  try {
      const response = await fetch(`${api_url}/upload-profile-pic`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`, // ✅ Make sure this is prefixed correctly
          },
          body: formData
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error("❌ Upload error:", errorData);
          throw new Error(errorData.message || 'Upload failed');
      }

      return await response.json();
  } catch (error) {
      console.error("Upload error:", error.message);
      throw error; 
  }
}

export async function updateUserProfile(token, updateData) {
  try {
    const response = await fetch(`${api_url}/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      throw new Error("Profile update failed.");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    throw error;
  }
}

export const fetchAllUsers = async (token) => {
  console.log("🔵 Fetching all users with token:", token);

  if (!token) {
    console.error("❌ No token provided!");
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await fetch(`${api_url}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to fetch users: ${errorMessage}`);
    }

    let users = await response.json();

    console.log("📡 Raw API Response:", users);

    users = users.map(user => ({
      ...user,
      profilePicUrl: (!user.profilePicUrl || user.profilePicUrl === "null" || user.profilePicUrl === "")
        ? "/uploads/default_pic.jpg"
        : user.profilePicUrl
    }));

    console.log("✅ Updated Users with Profile Picture Fix:", users);

    return users;
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    throw error;
  }
};
export const getSingleUser = async (userId, token) => {
  if (!token) {
    console.error("❌ No token provided to getSingleUser");
    return { error: "No token provided" };
  }

  try {
    const response = await fetch(`${api_url}/user/${userId}`, { // Make sure the endpoint matches your API's route for fetching a single user
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("🔵 Token passed to getSingleUser:", token);

    if (!response.ok) {
      throw new Error(`❌ API Error: ${response.status} - ${response.statusText}`);
    }

    const userData = await response.json();
    console.log("🟢 Received user data from API:", userData);

    return userData;
  } catch (error) {
    console.error("❌ Error in getSingleUser:", error);
    return { error: error.message };
  }
};
