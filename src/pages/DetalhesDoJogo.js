import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import axios from "axios";
import moment from "moment-timezone";
import { API_FOOTBALL_KEY } from "@env";
import { Video, ResizeMode } from "expo-av";

export default function DetalhesDoJogo({ route }) {
  const { jogoId } = route.params;
  const [jogo, setJogo] = useState(null);
  const [headToHead, setHeadToHead] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalhesDoJogo = async () => {
      try {
        const response = await axios.get(
          `https://v3.football.api-sports.io/fixtures`,
          {
            params: { id: jogoId },
            headers: {
              "x-rapidapi-key": API_FOOTBALL_KEY,
              "x-rapidapi-host": "v3.football.api-sports.io",
            },
          }
        );
        console.log("Detalhes do Jogo:", response.data);
        if (response.data.response && response.data.response.length > 0) {
          setJogo(response.data.response[0]);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do jogo:", error);
      }
    };

    const fetchHeadToHead = async () => {
      if (jogo) {
        try {
          const { teams } = jogo;
          const response = await axios.get(
            `https://v3.football.api-sports.io/fixtures/headtohead`,
            {
              params: {
                h2h: `${teams.home.id}-${teams.away.id}`,
                last: 5,
              },
              headers: {
                "x-rapidapi-key": API_FOOTBALL_KEY,
                "x-rapidapi-host": "v3.football.api-sports.io",
              },
            }
          );
          console.log("Head to Head:", response.data);
          setHeadToHead(response.data.response);
        } catch (error) {
          console.error("Erro ao buscar head-to-head:", error);
        }
      }
    };

    const fetchStatistics = async () => {
      try {
        const response = await axios.get(
          `https://v3.football.api-sports.io/statistics`,
          {
            params: { fixture: jogoId },
            headers: {
              "x-rapidapi-key": API_FOOTBALL_KEY,
              "x-rapidapi-host": "v3.football.api-sports.io",
            },
          }
        );
        console.log("Statistics:", response.data);
        setStatistics(response.data.response);
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchDetalhesDoJogo();
      await fetchStatistics();
      await fetchHeadToHead();
      setLoading(false);
    };

    fetchData();
  }, [jogoId, jogo]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
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
      </View>
    );
  }

  if (!jogo) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Erro ao carregar os detalhes do jogo.
        </Text>
      </View>
    );
  }

  const { teams, fixture, league, events, lineups } = jogo;

  // Convertendo a data e hora para o fuso horário "America/Sao_Paulo"
  const dataHoraJogo = moment
    .tz(fixture.date, "America/Sao_Paulo")
    .format("DD/MM/YYYY HH:mm");

  return (
    <ScrollView style={styles.container}>
      {/* Informações principais do jogo */}
      <View style={styles.infoContainer}>
        <Text style={styles.competition}>{league.name}</Text>
        <Text style={styles.date}>{dataHoraJogo}</Text>
        <Text style={styles.venue}>{fixture.venue.name}</Text>
        <Text style={styles.referee}>Árbitro: {fixture.referee}</Text>
      </View>

      {/* Round */}
      <View style={styles.roundContainer}>
        <Text style={styles.sectionTitle}>Rodada: {fixture.round}</Text>
      </View>

      {/* Logos dos times */}
      <View style={styles.teamsContainer}>
        <View style={styles.team}>
          <Image source={{ uri: teams.home.logo }} style={styles.logo} />
          <Text style={styles.teamName}>{teams.home.name}</Text>
        </View>
        <Text style={styles.vsText}>VS</Text>
        <View style={styles.team}>
          <Image source={{ uri: teams.away.logo }} style={styles.logo} />
          <Text style={styles.teamName}>{teams.away.name}</Text>
        </View>
      </View>

      {/* Exibição de eventos */}
      <View style={styles.eventsContainer}>
        <Text style={styles.sectionTitle}>Eventos do Jogo</Text>
        {events.length > 0 ? (
          events.map((event) => (
            <View key={event.id} style={styles.event}>
              <Text>{`${event.time.elapsed}' - ${event.team.name}`}</Text>
              <Text>{`${event.player.name} (${event.type})`}</Text>
            </View>
          ))
        ) : (
          <Text>Jogo não iniciado.</Text>
        )}
      </View>

      {/* Exibição de estatísticas */}
      <View style={styles.statisticsContainer}>
        <Text style={styles.sectionTitle}>Estatísticas</Text>
        {statistics && statistics.length > 0 ? (
          statistics.map((stat) => (
            <View key={stat.id} style={styles.stat}>
              <Text>{`${stat.team.name}:`}</Text>
              <Text>{`Chances a gol: ${stat.statistics[0].value}`}</Text>
              <Text>{`Faltas: ${stat.statistics[1].value}`}</Text>
              <Text>{`Escanteios: ${stat.statistics[2].value}`}</Text>
              <Text>{`Poss. de bola: ${stat.statistics[3].value}`}</Text>
              <Text>{`Cartões amarelos: ${stat.statistics[4].value}`}</Text>
              <Text>{`Cartões vermelhos: ${stat.statistics[5].value}`}</Text>
              {/* Adicione mais estatísticas conforme necessário */}
            </View>
          ))
        ) : (
          <Text>Nenhuma estatística disponível.</Text>
        )}
      </View>

      {/* Exibição de escalações */}
      <View style={styles.lineupsContainer}>
        <Text style={styles.sectionTitle}>Escalações</Text>
        {lineups.length > 0 ? (
          lineups.map((lineup, index) => (
            <View key={index} style={styles.lineup}>
              <Text>{lineup.team.name}</Text>
              {lineup.startXI.map((player) => (
                <Text key={player.id}>{player.name}</Text>
              ))}
            </View>
          ))
        ) : (
          <Text>Nenhuma escalação disponível.</Text>
        )}
      </View>

      {/* Exibição de confrontos diretos */}
      <View style={styles.headToHeadContainer}>
        <Text style={styles.sectionTitle}>Confrontos Diretos</Text>
        {headToHead &&
        Array.isArray(headToHead.response) &&
        headToHead.response.length > 0 ? (
          headToHead.response.map((match, index) => (
            <View key={index} style={styles.headToHead}>
              <Text>{`${match.fixture.date} - ${match.teams.home.name} ${match.score.fulltime.home} x ${match.score.fulltime.away} ${match.teams.away.name}`}</Text>
            </View>
          ))
        ) : (
          <Text>Nenhum confronto direto disponível.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  infoContainer: {
    padding: 20,
    alignItems: "center",
  },
  competition: {
    fontSize: 20,
    fontWeight: "bold",
  },
  date: {
    fontSize: 18,
    color: "#666",
  },
  venue: {
    fontSize: 18,
    color: "#666",
  },
  referee: {
    fontSize: 18,
    color: "#666",
  },
  roundContainer: {
    padding: 10,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
  },
  team: {
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
  },
  teamName: {
    fontSize: 18,
    marginTop: 5,
  },
  vsText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  eventsContainer: {
    padding: 20,
  },
  event: {
    marginBottom: 10,
  },
  statisticsContainer: {
    padding: 20,
  },
  stat: {
    marginBottom: 10,
  },
  lineupsContainer: {
    padding: 20,
  },
  lineup: {
    marginBottom: 10,
  },
  oddsContainer: {
    padding: 20,
  },
  odd: {
    marginBottom: 10,
  },
  predictionsContainer: {
    padding: 20,
  },
  prediction: {
    marginBottom: 10,
  },
  headToHeadContainer: {
    padding: 20,
  },
  headToHead: {
    marginBottom: 10,
  },
  videoContainer: {
    width: 200,
    height: 200,
  },
  video: {
    flex: 1,
  },
});
