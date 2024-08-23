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
  const timezone = "America/Sao_Paulo";

  useEffect(() => {
    const fetchTorneios = async () => {
      try {
        const today = moment().tz(timezone).format("YYYY-MM-DD");

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

        console.log("Dados recebidos:", response.data);

        if (response.data && response.data.response) {
          const sortedLeagues = response.data.response.sort((a, b) => {
            if (a.league.name < b.league.name) return -1;
            if (a.league.name > b.league.name) return 1;
            return 0;
          });
          setLeagues(sortedLeagues);
        } else {
          console.error("Estrutura inesperada de dados:", response.data);
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
      <SafeAreaView style={stylesPartidas.all}>
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
            texto={"Melhores Ligas"}
            styleTxt={stylesPartidas.TextoPrincipal}
          />

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
              />
            ))
          ) : (
            <Text>Nenhuma liga encontrada.</Text>
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
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
