const API_URL = "https://wizard-world-api.herokuapp.com";


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