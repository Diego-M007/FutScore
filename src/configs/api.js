import axios from "axios";
import { API_FOOTBALL_KEY } from "@env";

const apiFootball = axios.create({
  baseURL: "https://v3.football.api-sports.io/",
  headers: {
    "x-apisports-key": API_FOOTBALL_KEY,
  },
});

const getTimezone = async () => {
  try {
    const response = await axios.get(
      "https://v3.football.api-sports.io/timezone",
      {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": "YOUR_API_KEY",
        },
      }
    );
    return response.data.response[0]; // Pega o primeiro timezone da lista
  } catch (error) {
    console.error("Erro ao obter o fuso horário:", error);
    return "UTC"; // Valor padrão em caso de erro
  }
};

export default apiFootball;
