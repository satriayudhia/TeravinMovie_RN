import axios from "axios";

export const API = axios.create({
  baseURL: "https://api.themoviedb.org/3/discover/movie?api_key=f7b67d9afdb3c971d4419fa4cb667fbf",
});