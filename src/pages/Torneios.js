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
  const [torneios, setTorneios] = useState([]);
  const timezone = "America/Sao_Paulo";

  useEffect(() => {
    const fetchTorneios = async () => {
      try {
        const today = moment().tz(timezone).format("YYYY-MM-DD");

        // Fetch Ligas e Copas
        const response = await axios.get(
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

        let allTorneios = [];

        if (response.data && response.data.response) {
          allTorneios = response.data.response.map((league) => ({
            id: league.league.id,
            name: league.league.name,
            logo: league.league.logo,
            type: league.league.type, // Pode ser "cup" ou "league"
          }));
        }

        allTorneios.sort((a, b) => (a.name < b.name ? -1 : 1));

        setTorneios(allTorneios);
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
            texto={"Todos os Torneios"}
            styleTxt={stylesPartidas.TextoPrincipal}
          />
          {torneios.length > 0 ? (
            torneios.map((torneio) => (
              <TorneioCardComponent
                key={torneio.id}
                imagem={torneio.logo}
                nome={torneio.name}
                ligaId={torneio.id}
                tipo={torneio.type}
              />
            ))
          ) : (
            <Text style={stylesPartidas.noDataText}>
              Nenhum torneio disponível.
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
