import axios from "axios";
import { API_FOOTBALL_KEY } from "@env";

export const getTimezone = async () => {
  try {
    const response = await axios.get(
      "https://v3.football.api-sports.io/timezone",
      {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": API_FOOTBALL_KEY,
        },
      }
    );
    // Encontrar o fuso horário de São Paulo
    const saoPauloTimezone = response.data.response.find(
      (tz) => tz === "America/Sao_Paulo"
    );
    return saoPauloTimezone || "UTC"; // Retornar o fuso horário de São Paulo ou UTC em caso de erro
  } catch (error) {
    console.error("Erro ao obter o fuso horário:", error);
    return "UTC"; // Valor padrão em caso de erro
  }
};
