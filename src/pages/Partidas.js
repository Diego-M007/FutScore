// Partidas.js
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import axios from "axios";
import moment from "moment-timezone";
import CompeticoesPorPaisComponent from "../components/CompetiçõesPorPaises";
import HeaderComponent from "../components/HeaderComponent";
import { stylesPartidas } from "../styles/StylePartidas";
import { API_FOOTBALL_KEY } from "@env";
import TxtComponent from "../components/TxtComponent";
import EspacoPropaganda from "../components/PropagandoComponent";
import { Video, ResizeMode } from "expo-av";
import LigasEspecificasComponent from "../components/PrincipaisLigasComponente";
import SearchScreen from "./SearchScreen";

export default function Partidas() {
  const [jogosPorPais, setJogosPorPais] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const timezone = "America/Sao_Paulo";

  useEffect(() => {
    const fetchJogos = async (date) => {
      try {
        const formattedDate = moment(date).tz(timezone).format("YYYY-MM-DD");

        const response = await axios.get(
          "https://v3.football.api-sports.io/fixtures",
          {
            params: {
              date: formattedDate,
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
          if (jogoDate.isSame(formattedDate, "day")) {
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
              fixtureId: jogo.fixture.id,
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

    fetchJogos(selectedDate);
  }, [selectedDate]);

  const filteredJogos = Object.keys(jogosPorPais).reduce((acc, pais) => {
    const competicoes = jogosPorPais[pais].filter(
      (competicao) =>
        competicao.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        competicao.jogos.some(
          (jogo) =>
            jogo.timeCasa.toLowerCase().includes(searchQuery.toLowerCase()) ||
            jogo.timeVisitante.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    if (competicoes.length > 0) {
      acc[pais] = competicoes;
    }
    return acc;
  }, {});

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
      <HeaderComponent onDateChange={setSelectedDate} />
      <EspacoPropaganda />

      <View style={styles.searchHeader}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar times, competições..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={stylesPartidas.Container}>
        <TxtComponent
          texto={"Jogos do Dia"}
          styleTxt={stylesPartidas.TextoPrincipal}
        />

        <CompeticoesPorPaisComponent jogosPorPais={filteredJogos} />
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide">
        <SearchScreen onClose={() => setModalVisible(false)} />
      </Modal>
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
    height: "50%",
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchIcon: {
    fontSize: 24,
  },
});
