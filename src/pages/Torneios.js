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

  // Lista de melhores ligas que queremos exibir primeiro com o país para garantir a precisão
  const melhoresLigas = [
    { name: "Premier League", country: "England" },
    { name: "La Liga", country: "Spain" },
    { name: "Serie A", country: "Italy" },
    { name: "Bundesliga", country: "Germany" },
    { name: "Ligue 1", country: "France" },
    { name: "Serie A", country: "Brazil" },
  ];

  useEffect(() => {
    const fetchTorneios = async () => {
      try {
        const today = moment().tz(timezone).format("YYYY-MM-DD");

        const response = await axios.get(
          "https://v3.football.api-sports.io/leagues",
          {
            params: {
              season: new Date().getFullYear(), // Pega o ano atual
            },
            headers: {
              "x-rapidapi-host": "v3.football.api-sports.io",
              "x-rapidapi-key": API_FOOTBALL_KEY,
            },
          }
        );

        if (response.data && response.data.response) {
          // Filtrar apenas ligas (excluir copas)
          let ligas = response.data.response.filter(
            (league) => league.league && league.league.type === "League"
          );

          // Separar as melhores ligas e ordenar as demais alfabeticamente
          const melhores = ligas.filter((liga) =>
            melhoresLigas.some(
              (ml) =>
                ml.name === liga.league.name && ml.country === liga.country.name
            )
          );

          const outrasLigas = ligas
            .filter(
              (liga) =>
                !melhoresLigas.some(
                  (ml) =>
                    ml.name === liga.league.name &&
                    ml.country === liga.country.name
                )
            )
            .sort((a, b) => a.league.name.localeCompare(b.league.name));

          // Ordenar as melhores ligas na ordem definida no array "melhoresLigas"
          const melhoresOrdenadas = melhoresLigas
            .map((ml) =>
              melhores.find(
                (liga) =>
                  liga.league.name === ml.name &&
                  liga.country.name === ml.country
              )
            )
            .filter(Boolean);

          const ligasOrdenadas = [...melhoresOrdenadas, ...outrasLigas];

          setTorneios(ligasOrdenadas);
        }
      } catch (error) {
        console.error("Erro ao buscar ligas:", error);
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
          {torneios.length > 0 ? (
            torneios.map((torneio) => (
              <TorneioCardComponent
                key={torneio.league.id}
                imagem={torneio.league.logo}
                nome={torneio.league.name}
                ligaId={torneio.league.id}
              />
            ))
          ) : (
            <Text style={stylesPartidas.noDataText}>
              Nenhuma liga disponível.
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
