const API_URL = "https://wizard-world-api.herokuapp.com";
const api_url = "http://localhost:3000/api"

const createNewUser = async (username, email, password) => {
  try {
    const response = await fetch(`${api_url}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error during registration:", error);
    return { error: error.message };
  }
};

export default createNewUser;

export async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  try {
    const response = await fetch(`${api_url}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Invalid login credentials.");
    }

    const data = await response.json();
    return data; // Return token or user info
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}


// Fetch a house
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