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
export const getCountries = async () => {
  try {
    const response = await apiFootball.get("/countries");
    return response.data.response;
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
};

export const getLeaguesByCountry = async (country) => {
  try {
    const response = await apiFootball.get(`/leagues?country=${country}`);
    return response.data.response;
  } catch (error) {
    console.error(`Error fetching leagues for country ${country}:`, error);
    return [];
  }
};

export const getStandingsByLeague = async (leagueId) => {
  try {
    const response = await apiFootball.get(`/standings?league=${leagueId}`);
    console.log(`Response for league ${leagueId}:`, response.data);

    if (
      response.data &&
      response.data.response &&
      response.data.response.length > 0
    ) {
      const standingsData = response.data.response[0].league.standings[0];
      return standingsData;
    } else {
      console.error(`No standings data available for league ${leagueId}`);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching standings for league ${leagueId}:`, error);
    return [];
  }
};
