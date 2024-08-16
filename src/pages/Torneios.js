import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import axios from "axios";
import moment from "moment-timezone";
import CompeticoesPorPaisComponent from "../components/CompetiçõesPorPaises";
import HeaderComponent from "../components/HeaderComponent";
import { stylesPartidas } from "../styles/StylePartidas";
import { API_FOOTBALL_KEY } from "@env";
import TxtComponent from "../components/TxtComponent";
import EspaçoPropaganda from "../components/PropagandoComponent";
import { Video, ResizeMode } from "expo-av";

export default function Torneios() {
  const [torneiosPorPais, setTorneiosPorPais] = useState({});
  const [loading, setLoading] = useState(true);
  const timezone = "America/Sao_Paulo";

  useEffect(() => {
    const fetchTorneios = async () => {
      try {
        const today = moment().tz(timezone).format("YYYY-MM-DD");

        const response = await axios.get(
          "https://v3.football.api-sports.io/leagues",
          {
            params: {
              date: today,
              timezone: timezone,
            },
            headers: {
              "x-rapidapi-host": "v3.football.api-sports.io",
              "x-rapidapi-key": API_FOOTBALL_KEY,
            },
          }
        );

        const paises = {};

        response.data.response.forEach((torneio) => {
          const pais = torneio.country.name;
          const competicao = torneio.league.name;

          if (!paises[pais]) {
            paises[pais] = [];
          }

          let competicaoObj = paises[pais].find(
            (comp) => comp.nome === competicao
          );

          if (!competicaoObj) {
            competicaoObj = {
              nome: competicao,
              imagem: torneio.league.logo,
              temporadaAtual: torneio.seasons.find((season) => season.current)
                ?.year,
            };
            paises[pais].push(competicaoObj);
          }
        });

        setTorneiosPorPais(paises);
      } catch (error) {
        console.error("Erro ao buscar os torneios do dia:", error);
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
            source={require("../assets/Images/Video/Splash.mp4")}
            shouldPlay
            isLooping={false}
            isMuted={true}
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
      <TxtComponent
        texto={"Torneios do Dia"}
        styleTxt={stylesPartidas.TextoPrincipal}
      />
      <ScrollView contentContainerStyle={stylesPartidas.Container}>
        <CompeticoesPorPaisComponent jogosPorPais={torneiosPorPais} />
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
    width: "50%",
    height: "50%",
  },
});
