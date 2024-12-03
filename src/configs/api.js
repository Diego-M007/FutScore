import axios from "axios";
import { API_FOOTBALL_KEY } from "@env"; // Importa a chave de API do arquivo .env

// Criação de uma instância personalizada do Axios
const apiFootball = axios.create({
  baseURL: "https://v3.football.api-sports.io/", // Define a URL base para todas as requisições
  headers: {
    "x-apisports-key": API_FOOTBALL_KEY, // Configura o cabeçalho com a chave da API
  },
});

// Exporta a instância personalizada para uso em outras partes do código
export default apiFootball;
