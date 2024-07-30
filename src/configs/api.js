import axios from "axios";
import { API_FOOTBALL_KEY } from "@env";

const apiFootball = axios.create({
  baseURL: "https://v3.football.api-sports.io/",
  headers: {
    "x-apisports-key": API_FOOTBALL_KEY,
  },
});

export const getGamesOfTheDay = async () => {
  try {
    const today = new Date().toISOString().split("T")[0]; // Formata a data de hoje como 'YYYY-MM-DD'
    const response = await apiFootball.get(`/fixtures?date=${today}`);
    const games = response.data.response;

    const organizedGames = games.reduce((acc, game) => {
      const country = game.league.country;
      const league = game.league.name;

      if (!acc[country]) {
        acc[country] = {};
      }

      if (!acc[country][league]) {
        acc[country][league] = [];
      }

      acc[country][league].push(game);

      return acc;
    }, {});

    return organizedGames;
  } catch (error) {
    console.error("Error fetching games of the day:", error);
    return {};
  }
};
