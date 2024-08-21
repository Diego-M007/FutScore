import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import moment from "moment-timezone";
import { API_FOOTBALL_KEY } from "@env";
import { Video, ResizeMode } from "expo-av";

export default function DetalhesDoJogo({ route }) {
  const { jogoId } = route.params;
  const [jogo, setJogo] = useState(null);
  const [odds, setOdds] = useState(null);
  const [predictions, setPredictions] = useState(null);
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
        if (response.data.response && response.data.response.length > 0) {
          setJogo(response.data.response[0]);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do jogo:", error);
      }
    };

    const fetchOdds = async () => {
      try {
        const response = await axios.get(
          `https://v3.football.api-sports.io/odds`,
          {
            params: { fixture: jogoId },
            headers: {
              "x-rapidapi-key": API_FOOTBALL_KEY,
              "x-rapidapi-host": "v3.football.api-sports.io",
            },
          }
        );
        setOdds(response.data.response);
      } catch (error) {
        console.error("Erro ao buscar odds:", error);
      }
    };

    const fetchPredictions = async () => {
      try {
        const response = await axios.get(
          `https://v3.football.api-sports.io/predictions`,
          {
            params: { fixture: jogoId },
            headers: {
              "x-rapidapi-key": API_FOOTBALL_KEY,
              "x-rapidapi-host": "v3.football.api-sports.io",
            },
          }
        );
        setPredictions(response.data.response);
      } catch (error) {
        console.error("Erro ao buscar predictions:", error);
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
        setStatistics(response.data.response);
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      }
    };

    fetchDetalhesDoJogo();
    fetchOdds();
    fetchPredictions();
    fetchStatistics();

    if (jogo) fetchHeadToHead();

    setLoading(false);
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
              {lineup.startXI.map((player, index) => (
                <Text key={index}>
                  {player.player.name} - {player.player.position}
                </Text>
              ))}
            </View>
          ))
        ) : (
          <Text>Escalações não divulgadas.</Text>
        )}
      </View>

      {/* Exibição de Odds */}
      <View style={styles.oddsContainer}>
        <Text style={styles.sectionTitle}>Odds - Pré-Jogo</Text>
        {odds && odds.length > 0 ? (
          odds.map((odd, index) => (
            <View key={index} style={styles.odds}>
              {/* Verifique se odd.bookmaker e odd.odds estão definidos antes de acessar suas propriedades */}
              {odd.bookmaker && odd.odds ? (
                <Text>{`${odd.bookmaker.name}: ${odd.odds.home} - ${odd.odds.draw} - ${odd.odds.away}`}</Text>
              ) : (
                <Text>Odds indisponíveis.</Text>
              )}
            </View>
          ))
        ) : (
          <Text>Nenhuma odd disponível.</Text>
        )}
      </View>

      {/* Exibição de Predições */}
      <View style={styles.predictionsContainer}>
        <Text style={styles.sectionTitle}>Predições</Text>
        {predictions && predictions.length > 0 ? (
          predictions.map((prediction, index) => (
            <View key={index} style={styles.prediction}>
              {/* Verifique se prediction.forecast está definido antes de acessar suas propriedades */}
              {prediction.forecast ? (
                <Text>{`${prediction.forecast.name}: ${prediction.forecast.value}`}</Text>
              ) : (
                <Text>Previsão indisponível.</Text>
              )}
            </View>
          ))
        ) : (
          <Text>Nenhuma predição disponível.</Text>
        )}
      </View>

      {/* Exibição de Head-to-Head */}
      <View style={styles.headToHeadContainer}>
        <Text style={styles.sectionTitle}>Últimos Jogos (Head-to-Head)</Text>
        {headToHead && headToHead.length > 0 ? (
          headToHead.map((match, index) => (
            <View key={index} style={styles.headToHeadMatch}>
              <Text>{`${match.date}: ${match.teams.home.name} ${match.goals.home} - ${match.goals.away} ${match.teams.away.name}`}</Text>
            </View>
          ))
        ) : (
          <Text>Nenhum jogo registrado.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  videoContainer: {
    width: "100%",
    height: 200,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  infoContainer: {
    marginBottom: 16,
  },
  competition: {
    fontSize: 24,
    fontWeight: "bold",
  },
  date: {
    fontSize: 16,
  },
  venue: {
    fontSize: 16,
  },
  referee: {
    fontSize: 16,
  },
  roundContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 8,
  },
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 16,
  },
  team: {
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
  },
  teamName: {
    fontSize: 16,
  },
  vsText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  eventsContainer: {
    marginBottom: 16,
  },
  event: {
    marginBottom: 4,
  },
  statisticsContainer: {
    marginBottom: 16,
  },
  stat: {
    marginBottom: 4,
  },
  lineupsContainer: {
    marginBottom: 16,
  },
  lineup: {
    marginBottom: 8,
  },
  oddsContainer: {
    marginBottom: 16,
  },
  odds: {
    marginBottom: 4,
  },
  predictionsContainer: {
    marginBottom: 16,
  },
  prediction: {
    marginBottom: 4,
  },
  headToHeadContainer: {
    marginBottom: 16,
  },
  headToHeadMatch: {
    marginBottom: 4,
  },
});
