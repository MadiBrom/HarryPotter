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
    console.error("No token provided to getUser");
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

    console.log("Token passed to getUser:", token);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getUser:", error);
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
export const updateWandTestResults = async (userId, wandResult, answers, token) => {
  try {
    const response = await fetch(`${api_url}/wand-test-results/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Include the JWT token in the Authorization header
      },
      body: JSON.stringify({
        wandResult,
        answers,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error updating wand test results:", errorData.message);
      throw new Error(errorData.message);
    }

    return await response.json(); // Return the updated test results
  } catch (error) {
    console.error("Error updating wand test results:", error);
    throw error; // Propagate the error
  }
};
