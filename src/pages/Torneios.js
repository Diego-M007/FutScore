import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import moment from "moment-timezone";
import HeaderComponent from "../components/HeaderComponent";
import EspaçoPropaganda from "../components/PropagandoComponent";
import { Video, ResizeMode } from "expo-av";
import { stylesTorneios } from "../styles/StyleTorneios";
import { API_FOOTBALL_KEY } from "@env";
import TorneioCardComponent from "../components/TorneioCardComponent";
import TxtComponent from "../components/TxtComponent";

export default function Torneios() {
  const [loading, setLoading] = useState(true);
  const [torneios, setTorneios] = useState([]);
  const [paises, setPaises] = useState([]);
  const [paisSelecionado, setPaisSelecionado] = useState(null);
  const timezone = "America/Sao_Paulo";

  // Lista de melhores ligas que queremos exibir primeiro
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
              season: new Date().getFullYear(),
            },
            headers: {
              "x-rapidapi-host": "v3.football.api-sports.io",
              "x-rapidapi-key": API_FOOTBALL_KEY,
            },
          }
        );

        if (response.data && response.data.response) {
          let ligas = response.data.response.filter(
            (league) => league.league && league.league.type === "League"
          );

          // Filtrar os países distintos
          const paisesUnicos = [
            ...new Set(ligas.map((liga) => liga.country.name)),
          ].sort();

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

          setPaises(paisesUnicos);
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
      <SafeAreaView style={stylesTorneios.videoContainer}>
        <StatusBar barStyle="light-content" />
        <HeaderComponent />
        <View style={stylesTorneios.videoContainer}>
          <Video
            style={stylesTorneios.video}
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
    <SafeAreaView style={stylesTorneios.all}>
      <StatusBar barStyle="light-content" />
      <HeaderComponent />
      <EspaçoPropaganda />
      <ScrollView contentContainerStyle={stylesTorneios.Container}>
        <View>
          <TxtComponent
            texto={"Melhores Ligas"}
            styleTxt={stylesTorneios.TextoPrincipal}
          />
          {torneios.length > 0 ? (
            torneios
              .filter(
                (torneio) =>
                  !paisSelecionado || torneio.country.name === paisSelecionado
              )
              .map((torneio) => (
                <TorneioCardComponent
                  key={torneio.league.id}
                  imagem={torneio.league.logo}
                  nome={torneio.league.name}
                  ligaId={torneio.league.id}
                />
              ))
          ) : (
            <Text style={stylesTorneios.noDataText}>
              Nenhuma liga disponível.
            </Text>
          )}
        </View>

        <View>
          <TxtComponent
            texto={"Selecione o País"}
            styleTxt={stylesTorneios.TextoPrincipal}
          />
          {paises.map((pais) => (
            <TouchableOpacity
              key={pais}
              onPress={() => setPaisSelecionado(pais)}
              style={[
                stylesTorneios.paisButton,
                paisSelecionado === pais && stylesTorneios.paisButtonSelected,
              ]}
            >
              <Text style={stylesTorneios.paisButtonText}>{pais}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  paisButton: {
    padding: 10,
    backgroundColor: "#1f1f1f",
    borderRadius: 5,
    marginVertical: 5,
  },
  paisButtonSelected: {
    backgroundColor: "#2f9fa6",
  },
  paisButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});
