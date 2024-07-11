import axios from "axios";

const API_URL = "http://localhost:5555/api";

export const fetchAlbums = async () => {
  const response = await axios.get(`${API_URL}/albums`);
  return response.data;
};

export const fetchAlbum = async (id) => {
  const response = await axios.get(`${API_URL}/albums/${id}`);
  return response.data;
};
