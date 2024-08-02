import axios from "axios";
import { API_FOOTBALL_KEY } from "@env";

const apiFootball = axios.create({
  baseURL: "https://v3.football.api-sports.io/",
  headers: {
    "x-apisports-key": API_FOOTBALL_KEY,
  },
});

export default apiFootball;
