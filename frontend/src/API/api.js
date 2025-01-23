const API_URL = "https://wizard-world-api.herokuapp.com";
const api_url = "http://localhost:3333/api";

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
      await handleErrorResponse(response);
    }

    return await response.json();
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
