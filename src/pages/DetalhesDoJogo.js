import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Button,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import moment from "moment-timezone";
import { API_FOOTBALL_KEY } from "@env";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;

export default function DetalhesDoJogo({ route }) {
  const { jogoId } = route.params;
  const [jogo, setJogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHomeTeam, setShowHomeTeam] = useState(true);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState("Estatisticas");
  const navigation = useNavigation();

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
      } finally {
        setLoading(false);
      }
    };

    fetchDetalhesDoJogo();
  }, [jogoId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
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

  const { teams, fixture, lineups, statistics, events, goals } = jogo;

  const dataHoraJogo = moment
    .tz(fixture.date, "America/Sao_Paulo")
    .format("DD/MM/YYYY HH:mm");

  const calcularPorcentagem = (valorA, valorB) => {
    const total = valorA + valorB;
    if (total === 0) return [50, 50];
    const porcentagemA = (valorA / total) * 100;
    const porcentagemB = (valorB / total) * 100;
    return [porcentagemA, porcentagemB];
  };

  const jogoEncerrado = fixture.status.short === "FT";

  const renderEventIcon = (event) => {
    switch (event.type) {
      case "Goal":
        return <FontAwesome5 name="futbol" size={16} color="green" />;
      case "Card":
        if (event.detail === "Yellow Card") {
          return <MaterialIcons name="square" size={16} color="yellow" />;
        } else if (event.detail === "Red Card") {
          return <MaterialIcons name="square" size={16} color="red" />;
        } else if (event.detail === "Second Yellow card") {
          return <MaterialIcons name="warning" size={16} color="orange" />;
        }
        break;
      case "subst":
        return <FontAwesome5 name="exchange-alt" size={16} color="#2f9fa6" />;
      default:
        return null;
    }
  };

  const getEventsByPeriod = (period) => {
    switch (period) {
      case "1T":
        return events.filter((event) => event.time.elapsed <= 45);
      case "2T":
        return events.filter(
          (event) => event.time.elapsed > 45 && event.time.elapsed <= 90
        );
      case "ET":
        return events.filter(
          (event) => event.time.elapsed > 90 && event.time.elapsed <= 120
        );
      case "PEN":
        return events.filter((event) => event.time.elapsed > 120);
      default:
        return [];
    }
  };

  const renderEvents = (period, periodLabel) => {
    const periodEvents = getEventsByPeriod(period);
    if (periodEvents.length === 0) return null;

    return (
      <View>
        <View
          style={{
            alignItems: "center",
            borderTopWidth: 1,
            borderColor: "black",
            borderBottomWidth: 1,
            borderColor: "#2f9fa6",
          }}
        >
          <Text style={styles.periodTitle}>{periodLabel}</Text>
        </View>
        {periodEvents.map((event, index) => (
          <View key={index} style={styles.eventRow}>
            {event.team.name === teams.home.name ? (
              <>
                <View style={styles.eventSide}>
                  <Text style={styles.eventDetailLeft}>
                    {event.type === "subst" && event.assist
                      ? `${event.player.name} entrou, ${event.assist.name} saiu`
                      : event.player.name}
                  </Text>
                  {renderEventIcon(event)}
                </View>
                <Text style={styles.eventMinute}>{event.time.elapsed}'</Text>
                <View style={styles.eventSide} />
              </>
            ) : (
              <>
                <View style={styles.eventSide} />
                <Text style={styles.eventMinute}>{event.time.elapsed}'</Text>
                <View style={styles.eventSide}>
                  {renderEventIcon(event)}
                  <Text style={styles.eventDetailRight}>
                    {event.type === "subst" && event.assist
                      ? `${event.player.name} entrou, ${event.assist.name} saiu`
                      : event.player.name}
                  </Text>
                </View>
              </>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.date}>{dataHoraJogo}</Text>
      </View>

      <View style={styles.teamsContainer}>
        <View style={styles.team}>
          <Image source={{ uri: teams.home.logo }} style={styles.logo} />
          <Text style={styles.teamName}>{teams.home.name}</Text>
          {/* Placar time da casa */}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.teamScore}>{goals.home}</Text>
          <Text style={styles.vsText}>VS</Text>
          <Text style={styles.teamScore}>{goals.away}</Text>
        </View>
        <View style={styles.team}>
          {/* Placar time visitante */}

          <Image source={{ uri: teams.away.logo }} style={styles.logo} />
          <Text style={styles.teamName}>{teams.away.name}</Text>
        </View>
      </View>

      <View style={styles.extraInfoContainer}>
        <Text style={styles.extraInfoText}>Estádio: {fixture.venue.name}</Text>
        <Text style={styles.extraInfoText}>
          Árbitro: {fixture.referee || "Informação não disponível"}
        </Text>
      </View>
      <View style={styles.botoesContainer}>
        <Button
          title="Estatísticas"
          onPress={() => setOpcaoSelecionada("Estatisticas")}
          color={opcaoSelecionada === "Estatisticas" ? "#2f9fa6" : "#000"}
        />
        <Button
          title="Eventos"
          onPress={() => setOpcaoSelecionada("Eventos")}
          color={opcaoSelecionada === "Eventos" ? "#2f9fa6" : "#000"}
        />
        <Button
          title="Escalações"
          onPress={() => setOpcaoSelecionada("Escalacoes")}
          color={opcaoSelecionada === "Escalacoes" ? "#2f9fa6" : "#000"}
        />
      </View>
      {opcaoSelecionada === "Estatisticas" && (
        <View style={styles.statisticsContainer}>
          <Text style={styles.sectionTitle}>Estatísticas da Partida</Text>
          {statistics && statistics.length >= 2 && (
            <>
              <View style={styles.statsRow}>
                <Text style={styles.teamStatsTitle}>{teams.home.name}</Text>
                <Text style={styles.teamStatsTitle}>{teams.away.name}</Text>
              </View>
              {statistics[0].statistics.map((stat, index) => {
                const valorTimeCasa = parseInt(stat.value) || 0;
                const valorTimeVisitante =
                  parseInt(statistics[1].statistics[index].value) || 0;
                const [porcentagemCasa, porcentagemVisitante] =
                  calcularPorcentagem(valorTimeCasa, valorTimeVisitante);

                // Tradução das estatísticas
                const traduzirEstatistica = (tipo) => {
                  switch (tipo) {
                    case "Shots on Goal":
                      return "Chutes no Gol";
                    case "Shots off Goal":
                      return "Chutes Fora";
                    case "Total Shots":
                      return "Chutes Totais";
                    case "Ball Possession":
                      return "Posse de Bola";
                    case "Corner Kicks":
                      return "Escanteios";
                    case "Offsides":
                      return "Impedimentos";
                    case "Fouls":
                      return "Faltas";
                    default:
                      return tipo;
                  }
                };
                return (
                  <View key={index} style={styles.statsRowContent}>
                    <Text style={styles.statsText}>
                      {traduzirEstatistica(stat.type) === "Posse de Bola"
                        ? `${valorTimeCasa}%`
                        : valorTimeCasa}
                    </Text>
                    <View style={styles.ContainerStats}>
                      <Text style={styles.statsText}>{stat.type}</Text>
                      <View style={styles.progressBarContainer}>
                        <View
                          style={[
                            styles.progressBar,
                            {
                              width: `${porcentagemCasa}%`,
                              backgroundColor: "#2f9fa6",
                            },
                          ]}
                        />
                        <View
                          style={[
                            styles.progressBar,
                            {
                              width: `${porcentagemVisitante}%`,
                              backgroundColor: "white",
                            },
                          ]}
                        />
                      </View>
                    </View>
                    <Text style={styles.statsText}>
                      {traduzirEstatistica(stat.type) === "Posse de Bola"
                        ? `${valorTimeVisitante}%`
                        : valorTimeVisitante}
                    </Text>
                  </View>
                );
              })}
            </>
          )}
        </View>
      )}

      {opcaoSelecionada === "Eventos" && (
        <View style={styles.eventsContainer}>
          <Text style={styles.sectionTitle}>Eventos da Partida</Text>
          {events && events.length > 0 ? (
            <>
              {renderEvents("1T", "Primeiro Tempo")}
              {renderEvents("2T", "Segundo Tempo")}
              {renderEvents("ET", "Prorrogação")}
              {renderEvents("PEN", "Pênaltis")}
            </>
          ) : (
            <Text style={styles.noEventsText}>Nenhum evento disponível</Text>
          )}
        </View>
      )}

      {opcaoSelecionada === "Escalacoes" && (
        <View style={styles.lineupsContainer}>
          <Text style={styles.sectionTitle}>Escalações</Text>

          <View style={styles.toggleButtonContainer}>
            <Button
              title={
                showHomeTeam
                  ? `Ver Escalação ${teams.away.name}`
                  : `Ver Escalação ${teams.home.name}`
              }
              onPress={() => setShowHomeTeam(!showHomeTeam)}
            />
          </View>

          {showHomeTeam ? (
            <View style={styles.teamLineup}>
              <Text style={styles.teamName}>
                {teams.home.name} -- Titulares --
              </Text>
              {lineups &&
                lineups.length > 0 &&
                lineups[0].startXI.map((player, index) => (
                  <Text key={index} style={styles.playerName}>
                    {player.player.name}
                  </Text>
                ))}

              <View style={styles.teamLineup}>
                <Text style={styles.teamName}> -- Reservas --</Text>
                {lineups &&
                  lineups.length > 0 &&
                  lineups[0].substitutes.map((player, index) => (
                    <Text key={index} style={styles.playerName}>
                      {player.player.name}
                    </Text>
                  ))}
              </View>
            </View>
          ) : (
            <View style={styles.teamLineup}>
              <Text style={styles.teamName}>
                {teams.away.name} -- Titulares --
              </Text>
              {lineups &&
                lineups.length > 1 &&
                lineups[1].startXI.map((player, index) => (
                  <Text key={index} style={styles.playerName}>
                    {player.player.name}
                  </Text>
                ))}
              <View style={styles.teamLineup}>
                <Text style={styles.teamName}> -- Reservas --</Text>
                {lineups &&
                  lineups.length > 1 &&
                  lineups[1].substitutes.map((player, index) => (
                    <Text key={index} style={styles.playerName}>
                      {player.player.name}
                    </Text>
                  ))}
              </View>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black", // cor de fundo escura
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "white", // texto em branco para contraste
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red", // manter o texto de erro vermelho
  },
  infoContainer: {
    padding: 20,
    alignItems: "center",
  },
  date: {
    fontSize: 18,
    color: "#666", // manter o texto da data em cinza suave
  },
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  team: {
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  teamName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  vsText: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 10,
    color: "white",
  },
  teamScore: {
    fontSize: 45,
    fontWeight: "bold",
    marginHorizontal: "4%",
    color: "white",
  },
  extraInfoContainer: {
    padding: 20,
    alignItems: "center",
  },
  extraInfoText: {
    fontSize: 16,
    color: "#999", // texto de informação extra em cinza claro
    marginVertical: 5,
  },
  lineupsContainer: {
    padding: 20,
    borderWidth: 1,
    borderColor: "#2f9fa6",
    backgroundColor: "#2C2C2E", // fundo escuro similar à outra página
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white", // título de seção em branco
  },
  teamLineup: {
    marginBottom: 20,
  },
  playerName: {
    fontSize: 16,
    color: "white", // nome dos jogadores em branco
    marginVertical: 2,
  },
  toggleButtonContainer: {
    padding: 20,
    alignItems: "center",
  },
  statisticsContainer: {
    padding: 20,
    borderWidth: 1,
    borderColor: "#2f9fa6",
    backgroundColor: "#2C2C2E", // manter fundo escuro nas estatísticas
    borderRadius: 8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statsRowContent: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    borderBottomWidth: 1,
    padding: 10,
    borderColor: "white",
  },
  statsText: {
    fontSize: 16,
    color: "white", // texto das estatísticas em branco
    fontWeight: "bold",
  },
  teamStatsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white", // título das estatísticas em branco
  },
  progressBarContainer: {
    flexDirection: "row",
    width: "60%",
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 5,
  },
  progressBar: {
    height: "100%",
  },
  ContainerStats: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  eventsContainer: {
    padding: 20,
    borderWidth: 1,
    borderColor: "#2f9fa6",
    backgroundColor: "#2C2C2E", // fundo escuro para a seção de eventos
    borderRadius: 8,
  },
  eventRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingTop: 5,
    marginTop: 5,
  },
  eventMinute: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    color: "white", // minutos dos eventos em branco
  },
  eventSide: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  eventDetailLeft: {
    fontSize: 14,
    marginRight: 5,
    color: "white", // detalhe do evento em branco
  },
  eventDetailRight: {
    fontSize: 14,
    marginLeft: 5,
    textAlign: "right",
    color: "white", // detalhe do evento em branco
  },
  periodTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "white", // título do período em verde-água
  },
  noEventsText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
