import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from "react-native";
import axios from "axios";
import moment from "moment-timezone";
import HeaderComponent from "../components/HeaderComponent";
import EspaçoPropaganda from "../components/PropagandoComponent";
import { Video, ResizeMode } from "expo-av";
import { stylesPartidas } from "../styles/StylePartidas";
import { API_FOOTBALL_KEY } from "@env";
import TorneioCardComponent from "../components/TorneioCardComponent";
import TxtComponent from "../components/TxtComponent";

export default function Torneios() {
  const [loading, setLoading] = useState(true);
  const [leagues, setLeagues] = useState([]);
  const [cups, setCups] = useState([]);
  const timezone = "America/Sao_Paulo";

  useEffect(() => {
    const fetchTorneios = async () => {
      try {
        const today = moment().tz(timezone).format("YYYY-MM-DD");

        // Fetch Ligas
        const leaguesResponse = await axios.get(
          "https://v3.football.api-sports.io/leagues",
          {
            params: {
              season: new Date().getFullYear(),
            },
            headers: {
              "x-rapidapi-host": "v3.football.api-sports.io",
              "x-rapidapi-key": API_FOOTBALL_KEY,
            },
          }
        );

        // Fetch Copas
        const cupsResponse = await axios.get(
          "https://v3.football.api-sports.io/cups", // Supondo que este seja o endpoint correto
          {
            params: {
              season: new Date().getFullYear(),
            },
            headers: {
              "x-rapidapi-host": "v3.football.api-sports.io",
              "x-rapidapi-key": API_FOOTBALL_KEY,
            },
          }
        );

        console.log("Dados das ligas recebidos:", leaguesResponse.data);
        console.log("Dados das copas recebidos:", cupsResponse.data);

        if (leaguesResponse.data && leaguesResponse.data.response) {
          const sortedLeagues = leaguesResponse.data.response.sort((a, b) => {
            if (a.league.name < b.league.name) return -1;
            if (a.league.name > b.league.name) return 1;
            return 0;
          });
          setLeagues(sortedLeagues);
        } else {
          console.error(
            "Estrutura inesperada de dados das ligas:",
            leaguesResponse.data
          );
        }

        if (cupsResponse.data && cupsResponse.data.response) {
          const sortedCups = cupsResponse.data.response.sort((a, b) => {
            if (a.cup.name < b.cup.name) return -1;
            if (a.cup.name > b.cup.name) return 1;
            return 0;
          });
          setCups(sortedCups);
        } else {
          console.error(
            "Estrutura inesperada de dados das copas:",
            cupsResponse.data
          );
        }
      } catch (error) {
        console.error(
          "Erro ao buscar os torneios:",
          error.message,
          error.response?.data
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTorneios();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.videoContainer}>
        <StatusBar barStyle="light-content" />
        <HeaderComponent />
        <View style={styles.videoContainer}>
          <Video
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            source={require("../assets/Images/Video/loading.mp4")}
            shouldPlay
            isLooping
            isMuted
            onError={(error) =>
              console.error("Erro ao carregar o vídeo:", error)
            }
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={stylesPartidas.all}>
      <StatusBar barStyle="light-content" />
      <HeaderComponent />
      <EspaçoPropaganda />
      <ScrollView contentContainerStyle={stylesPartidas.Container}>
        <View>
          <TxtComponent
            texto={"Todas as Ligas"}
            styleTxt={stylesPartidas.TextoPrincipal}
          />
          {leagues.length > 0 ? (
            leagues.map((league) => (
              <TorneioCardComponent
                key={league.league.id}
                imagem={league.league.logo}
                nome={league.league.name}
                ligaId={league.league.id}
                tipo="liga"
              />
            ))
          ) : (
            <Text style={stylesPartidas.noDataText}>
              Nenhuma liga disponível.
            </Text>
          )}

          <TxtComponent
            texto={"Todas as Copas"}
            styleTxt={stylesPartidas.TextoPrincipal}
          />
          {cups.length > 0 ? (
            cups.map((cup) => (
              <TorneioCardComponent
                key={cup.cup.id}
                imagem={cup.cup.logo}
                nome={cup.cup.name}
                ligaId={cup.cup.id}
                tipo="copa"
              />
            ))
          ) : (
            <Text style={stylesPartidas.noDataText}>
              Nenhuma copa disponível.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
