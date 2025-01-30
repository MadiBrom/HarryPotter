const API_URL = "https://wizard-world-api.herokuapp.com";
const api_url = "http://localhost:3000/api";

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
    return await response.json();
  } catch (error) {
    console.error("Error fetching the house:", error);
    throw error;
  }
}

export const getUser = async (token) => {
  try {
    const response = await fetch(`${api_url}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Ensure token is passed in headers
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
  try {
    const response = await fetch(`${api_url}/saveTestResults`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(testData),
    });

    const text = await response.text(); // Read response as text first
    console.log("Raw Response:", text);

    const data = JSON.parse(text); // Parse JSON manually
    console.log("Test results saved:", data);

    return data;
  } catch (error) {
    console.error("Error saving test results:", error);
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