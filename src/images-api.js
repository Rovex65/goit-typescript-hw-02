import axios from "axios";

axios.defaults.baseURL = "https://api.unsplash.com/";
const API_KEY = "gC6kgtfEut9joHbyC9zQThBalEKWFuXBoWVtO3DYo34";

export const fetchImagesWithQuery = async (query, page) => {
  const params = new URLSearchParams({
    client_id: API_KEY,
    query,
    orientation: "landscape",
    page,
    per_page: 12,
  });
  const response = await axios.get(`/search/photos/`, { params });
  return response.data;
};
