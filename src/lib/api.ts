import axios from "axios";

const API_BASE_URL = 'https://api.artic.edu/api/v1';
const FIELDS = 'title,place_of_origin,artist_display,inscriptions,date_start,date_end,id';

export async function getArtworks(page = 1, limit = 12) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/artworks?page=${page}&limit=${limit}&fields=${FIELDS}`
    );
    return response.data;
  } catch (err) {
    console.error('Failed to fetch artworks:', err);
    throw err;
  }
}
