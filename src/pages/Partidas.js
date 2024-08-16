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

export default function Partidas() {
  const [jogosPorPais, setJogosPorPais] = useState({});
  const [loading, setLoading] = useState(true);
  const timezone = "America/Sao_Paulo";

  useEffect(() => {
    const fetchJogos = async () => {
      try {
        const today = moment().tz(timezone).format("YYYY-MM-DD");

        const response = await axios.get(
          "https://v3.football.api-sports.io/fixtures",
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

        response.data.response.forEach((jogo) => {
          const pais = jogo.league.country;
          const competicao = jogo.league.name;

          if (!paises[pais]) {
            paises[pais] = [];
          }

          let competicaoObj = paises[pais].find(
            (comp) => comp.nome === competicao
          );

          if (!competicaoObj) {
            competicaoObj = {
              nome: competicao,
              imagem: jogo.league.logo,
              jogos: [],
            };
            paises[pais].push(competicaoObj);
          }

          const jogoDate = moment(jogo.fixture.date).tz(timezone);
          if (jogoDate.isSame(today, "day")) {
            competicaoObj.jogos.push({
              timeCasa: jogo.teams.home.name,
              logoCasa: jogo.teams.home.logo,
              timeVisitante: jogo.teams.away.name,
              logoVisitante: jogo.teams.away.logo,
              horario: jogoDate.format("HH:mm"),
              resultado:
                jogo.goals.home !== null && jogo.goals.away !== null
                  ? `${jogo.goals.home} - ${jogo.goals.away}`
                  : null,
              fixtureId: jogo.fixture.id, // Adicione o fixtureId aqui
            });
          }
        });

        setJogosPorPais(paises);
      } catch (error) {
        console.error("Erro ao buscar os jogos do dia:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJogos();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={stylesPartidas.all}>
        <StatusBar barStyle="light-content" />
        <HeaderComponent />
        <View style={styles.videoContainer}>
          <Video
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN} // Ajuste para CONTAIN ou COVER conforme necessário
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
        texto={"Jogos do Dia"}
        styleTxt={stylesPartidas.TextoPrincipal}
      />
      <ScrollView contentContainerStyle={stylesPartidas.Container}>
        <CompeticoesPorPaisComponent jogosPorPais={jogosPorPais} />
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
    width: "1550%",
    height: "50%",
  },
});
