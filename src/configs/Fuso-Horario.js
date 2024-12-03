import axios from "axios";
import { API_FOOTBALL_KEY } from "@env"; // Importa a chave da API do arquivo .env

// Função assíncrona para obter o fuso horário
export const getTimezone = async () => {
  try {
    // Requisição para obter os fusos horários disponíveis
    const response = await axios.get(
      "https://v3.football.api-sports.io/timezone", // Endpoint da API para obter fusos horários
      {
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io", // Cabeçalho da API
          "x-rapidapi-key": API_FOOTBALL_KEY, // Cabeçalho com a chave da API
        },
      }
    );

    // Encontra o fuso horário de São Paulo na resposta
    const saoPauloTimezone = response.data.response.find(
      (tz) => tz === "America/Sao_Paulo" // Procura por "America/Sao_Paulo"
    );

    return saoPauloTimezone || "UTC"; // Retorna "America/Sao_Paulo" ou "UTC" se não encontrado
  } catch (error) {
    console.error("Erro ao obter o fuso horário:", error); // Exibe o erro no console em caso de falha
    return "UTC"; // Retorna "UTC" caso ocorra um erro na requisição
  }
};
