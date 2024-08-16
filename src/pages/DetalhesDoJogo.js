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

export default function DetalhesDoJogo({ route }) {
  const { jogoId } = route.params;
  const [jogo, setJogo] = useState(null);
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
        console.log("Response Data:", response.data); // Verifique toda a resposta
        if (response.data.response && response.data.response.length > 0) {
          console.log("Detalhes do jogo:", response.data.response[0]);
          setJogo(response.data.response[0]);
        } else {
          console.log("Nenhum detalhe encontrado para o jogo com id:", jogoId);
        }
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar detalhes do jogo:", error);
        setLoading(false);
      }
    };

    fetchDetalhesDoJogo();
  }, [jogoId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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

  const { teams, fixture, league, events, statistics, lineups } = jogo;

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
          <Text>Nenhum evento registrado.</Text>
        )}
      </View>

      {/* Exibição de estatísticas */}
      <View style={styles.statisticsContainer}>
        <Text style={styles.sectionTitle}>Estatísticas</Text>
        {statistics.length > 0 ? (
          statistics.map((stat) => (
            <View key={stat.id} style={styles.stat}>
              <Text>{`${stat.team.name}: ${stat.statistics[0].value}`}</Text>
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
          <Text>Escalações não disponíveis.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
  infoContainer: {
    marginBottom: 20,
  },
  competition: {
    fontSize: 20,
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
    fontStyle: "italic",
  },
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  team: {
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  teamName: {
    fontSize: 16,
    textAlign: "center",
  },
  vsText: {
    fontSize: 20,
    marginHorizontal: 10,
  },
  eventsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  event: {
    marginBottom: 10,
  },
  statisticsContainer: {
    marginBottom: 20,
  },
  stat: {
    marginBottom: 10,
  },
  lineupsContainer: {
    marginBottom: 20,
  },
  lineup: {
    marginBottom: 10,
  },
});
