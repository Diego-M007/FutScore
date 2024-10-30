import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import moment from "moment-timezone";
import { API_FOOTBALL_KEY } from "@env";

const PaginaTime = ({ route, navigation }) => {
  const { timeId } = route.params;
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anoSelecionado, setAnoSelecionado] = useState(
    new Date().getFullYear()
  );

  useEffect(() => {
    if (!timeId) return;

    const carregarDadosDoTime = async () => {
      setLoading(true);
      try {
        const responseJogos = await axios.get(
          `https://v3.football.api-sports.io/fixtures`,
          {
            params: { team: timeId, season: anoSelecionado },
            headers: {
              "x-rapidapi-key": API_FOOTBALL_KEY,
              "x-rapidapi-host": "v3.football.api-sports.io",
            },
          }
        );
        const jogosOrdenados = responseJogos.data.response.sort(
          (b, a) => new Date(b.fixture.date) - new Date(a.fixture.date)
        );
        setJogos(jogosOrdenados);
      } catch (error) {
        console.error("Erro ao carregar dados do time:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosDoTime();
  }, [timeId, anoSelecionado]);

  const extrairRodada = (roundString) => {
    const rodada = roundString.match(/\d+/);
    return rodada ? rodada[0] : "-";
  };

  const renderJogo = ({ item }) => {
    const dataFormatada = moment(item.fixture.date).format("DD/MM/YYYY");
    const statusDoJogo = item.fixture.status.short;
    const horarioFormatado = moment(item.fixture.date).format("HH:mm");

    let resultadoOuHorario;

    if (statusDoJogo === "NS") {
      resultadoOuHorario = (
        // Se o jogo não iniciou, verifica o horário
        <Text style={styles.h2hHorario}>{horarioFormatado}</Text>
      );
    } else if (statusDoJogo === "FT") {
      // Se o jogo terminou, exibe o resultado final
      resultadoOuHorario = (
        <Text style={styles.resultado}>
          {item.goals.home} - {item.goals.away}
        </Text>
      );
    } else if (statusDoJogo === "TBD") {
      // Se o jogo terminou, exibe o resultado final
      resultadoOuHorario = (
        <Text style={styles.h2hHorarioDefinir}>A definir</Text>
      );
    } else {
      // Caso contrário, exibe o status em andamento ou ao vivo
      resultadoOuHorario = (
        <Text style={styles.aoVivo}>
          {statusDoJogo === "LIVE" ? "Ao Vivo" : statusDoJogo}
        </Text>
      );
    }

    return (
      <TouchableOpacity
        style={styles.jogoContainer}
        onPress={() =>
          navigation.navigate("DetalhesDoJogo", { jogoId: item.fixture.id })
        }
      >
        <Image source={{ uri: item.teams.home.logo }} style={styles.logo} />
        <View style={styles.teamContainerHome}>
          <Text style={styles.equipes}>{item.teams.home.name}</Text>
        </View>

        <View style={styles.ContainResultado}>
          <Text style={styles.h2hDate}>{dataFormatada}</Text>
          <Text style={styles.h2hHorario}>{resultadoOuHorario}</Text>
          <Text style={styles.h2hCompetition}>{item.league.name}</Text>
          <Text style={styles.h2hCompetition}>
            Rodada {extrairRodada(item.league.round)}
          </Text>
        </View>

        <View style={styles.teamContainerAway}>
          <Text style={styles.equipes}>{item.teams.away.name}</Text>
        </View>
        <Image source={{ uri: item.teams.away.logo }} style={styles.logo} />
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {jogos.length > 0 ? jogos[0].teams.home.name : "Informações do Time"}
      </Text>
      <View style={styles.yearSelector}>
        <Text style={styles.label}>Selecione a temporada:</Text>
        {[2024, 2023, 2022].map((ano) => (
          <TouchableOpacity
            key={ano}
            style={[
              styles.yearButton,
              anoSelecionado === ano && styles.yearButtonSelected,
            ]}
            onPress={() => setAnoSelecionado(ano)}
          >
            <Text style={styles.yearButtonText}>{ano}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#2f9fa6" />
      ) : (
        <FlatList
          data={jogos}
          keyExtractor={(item) => item.fixture.id.toString()}
          renderItem={renderJogo}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  yearSelector: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  label: {
    fontSize: 16,
    color: "white",
  },
  yearButton: {
    backgroundColor: "#2f9fa6",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  yearButtonSelected: {
    backgroundColor: "#1f7070",
  },
  yearButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  jogoContainer: {
    borderWidth: 1,
    borderColor: "#2f9fa6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    padding: "1.5%",
    borderRadius: 10,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 10,
    resizeMode: "contain",
  },
  teamContainerHome: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    flexWrap: "wrap",
  },
  teamContainerAway: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
    flexWrap: "wrap",
  },
  equipes: {
    fontSize: 12,
    color: "white",
  },
  ContainResultado: {
    alignItems: "center",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#2f9fa6",
    paddingHorizontal: "2%",
    marginHorizontal: "3%",
  },
  h2hDate: {
    fontSize: 10,
    color: "white",
  },
  resultado: {
    fontSize: 16,
    color: "white",
  },
  h2hCompetition: {
    fontSize: 10,
    color: "#aaaaaa",
  },
  h2hHorario: {
    fontSize: 13,
    color: "white",
  },
  h2hHorarioDefinir: {
    fontSize: 13,
    color: "orange",
  },
});

export default PaginaTime;
