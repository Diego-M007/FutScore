import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { styles } from "../styles/StyleDetalhesDoJogo";
import axios from "axios";
import moment from "moment-timezone";
import { API_FOOTBALL_KEY } from "@env";
import {
  FontAwesome5,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome6,
} from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import TabelaComponent from "../components/TabelaComponent";

export default function DetalhesDoJogo({ route }) {
  const { jogoId } = route.params;
  const [jogo, setJogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [minutagem, setMinutagem] = useState(null);
  const [showHomeTeam, setShowHomeTeam] = useState(true);
  const [h2hData, setH2hData] = useState([]);

  const [opcaoSelecionada, setOpcaoSelecionada] = useState("Eventos");

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
          setMinutagem(response.data.response[0].fixture.status.elapsed || 0);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do jogo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalhesDoJogo();
  }, [jogoId]);

  useEffect(() => {
    let intervalId;
    if (
      jogo &&
      (jogo.fixture.status.short === "LIVE" ||
        jogo.fixture.status.short === "1H" ||
        jogo.fixture.status.short === "2H")
    ) {
      intervalId = setInterval(() => {
        setMinutagem((prevMinutagem) => prevMinutagem + 1);
      }, 30000); // Atualiza a cada 30 segundos
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId); // Limpa o intervalo quando o componente for desmontado
      }
    };
  }, [jogo]);

  useEffect(() => {
    const fetchH2HData = async () => {
      if (teams?.home?.id && teams?.away?.id) {
        // Verifique se teams está definido
        try {
          const response = await axios.get(
            "https://v3.football.api-sports.io/fixtures/headtohead",
            {
              headers: {
                "x-rapidapi-key": API_FOOTBALL_KEY,
                "x-rapidapi-host": "v3.football.api-sports.io",
              },
              params: {
                h2h: `${teams.home.id}-${teams.away.id}`,
              },
            }
          );
          setH2hData(response.data.response); // Armazena os confrontos diretos
        } catch (error) {
          console.error("Erro ao buscar dados de H2H:", error);
        }
      }
    };

    if (
      opcaoSelecionada === "Confrontos" &&
      teams?.home?.id &&
      teams?.away?.id
    ) {
      fetchH2HData();
    }
  }, [opcaoSelecionada, teams]); // Adicione "teams" como dependência

  if (loading) {
    return (
      <View style={stylesVideo.videoContainer}>
        <Video
          style={stylesVideo.video}
          resizeMode={ResizeMode.CONTAIN}
          source={require("../assets/Images/Video/loading.mp4")}
          shouldPlay
          isLooping={false}
          isMuted={true}
          onError={(error) => console.error("Erro ao carregar o vídeo:", error)}
        />
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

  const { teams, fixture, lineups, statistics, events, goals, league } = jogo;

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

  const extrairRodada = (round) => {
    if (!round) return ""; // Verifica se existe o valor
    const partes = round.split(" - "); // Divide a string pelo " - "
    return partes[1] ? partes[1] : round; // Retorna a segunda parte (rodada ou fase) ou a string completa se não houver " - "
  };

  const jogoEncerrado = fixture.status.short === "FT";
  const jogoAoVivo =
    fixture.status.short === "LIVE" ||
    fixture.status.short === "2H" ||
    fixture.status.short === "1H";
  const JogoIntervalo = fixture.status.short === "HT";
  const JogonaoIniciado = fixture.status.short === "NS";
  const JogoSuspenso = fixture.status.short === "SUSP";
  const JogoInterrompido = fixture.status.short === "INT";
  const JogoAdiado = fixture.status.short === "PST";
  const JogoCancelado = fixture.status.short === "CANC";
  const JogoAbandonado = fixture.status.short === "ABD";

  const renderEventIcon = (event) => {
    switch (event.type) {
      case "Goal":
        if (event.detail === "Own Goal") {
          return <FontAwesome5 name="futbol" size={16} color="orange" />; // Gol contra
        } else if (event.detail === "Missed Penalty") {
          return (
            <Image
              source={require("../assets/Images/penaltiperdido.png")}
              resizeMode="contain"
              style={styles.imagemEventos}
            />
          );
          // Pênalti perdido
        } else if (event.detail === "Penalty") {
          return (
            <Image
              source={require("../assets/Images/penaltigol.png")}
              resizeMode="contain"
              style={styles.imagemEventos}
            />
          ); // Pênalti convertido
        } else {
          return <FontAwesome5 name="futbol" size={16} color="green" />; // Gol normal
        }
      case "Card":
        if (event.detail === "Yellow Card") {
          return <MaterialIcons name="square" size={16} color="yellow" />;
        } else if (event.detail === "Red Card") {
          return <MaterialIcons name="square" size={16} color="red" />;
        } else if (event.detail === "Second Yellow card") {
          return (
            <Image
              source={require("../assets/Images/1.png")}
              resizeMode="contain"
              style={styles.imagemEventos}
            />
          );
        }
      case "Var":
        if (event.detail === "Goal cancelled") {
          return (
            <Image
              source={require("../assets/Images/golanulado.png")}
              resizeMode="contain"
              style={styles.imagemEventos}
            />
          );
        }
        // Gol anulado
        else if (event.detail === "Penalty confirmed") {
          return (
            <Image
              source={require("../assets/Images/penalticonfirmado.png")}
              resizeMode="contain"
              style={styles.imagemEventos}
            />
          );
        } // Penalti confrmado
        break;
      case "subst":
        return (
          <Image
            source={require("../assets/Images/substituição.png")}
            resizeMode="contain"
            style={styles.imagemEventos}
          />
        );
      default:
        return null;
    }
  };

  const handleLeagueClick = () => {
    // Navegar para a página da liga passando o ID da liga como parâmetro
    navigation.navigate("PaginaLiga", { ligaId: jogo.league.id });
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
                    {event.type === "Goal" && event.detail === "Normal Goal"
                      ? `${event.player.name}, (${event.assist.name})` // Gol normal
                      : event.type === "Goal" && event.detail === "Own Goal"
                      ? `${event.player.name} (Gol Contra)` // Gol contra
                      : event.type === "Goal" && event.detail === "Penalty"
                      ? `${event.player.name} (Pênalti)` // Pênalti confirmado
                      : event.type === "Goal" &&
                        event.detail === "Missed Penalty"
                      ? `${event.player.name} (Pênalti Perdido)` // Pênalti perdido
                      : event.type === "Goal" &&
                        event.detail === "Cancelled Goal"
                      ? `${event.player.name} (Gol Anulado)` // Gol anulado
                      : event.type === "subst" && event.assist
                      ? `${event.assist.name} entrou, ${event.player.name} saiu`
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
                    {event.type === "Goal" && event.detail === "Normal Goal"
                      ? `${event.player.name} (${event.assist.name})` // Gol normal
                      : event.type === "Goal" && event.detail === "Own Goal"
                      ? `${event.player.name} (Gol Contra)` // Gol contra
                      : event.type === "Goal" && event.detail === "Penalty"
                      ? `${event.player.name} (Pênalti)` // Pênalti confirmado
                      : event.type === "Goal" &&
                        event.detail === "Missed Penalty"
                      ? `${event.player.name} (Pênalti Perdido)` // Pênalti perdido
                      : event.type === "Var" &&
                        event.detail === "Goal cancelled"
                      ? `${event.player.name} (Gol Anulado)`
                      : event.type === "Var" &&
                        event.detail === "Penalty confirmed"
                      ? `Penalti Confirmado` // Gol anulado
                      : event.type === "subst" && event.assist
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

      <ImageBackground
        source={require("../assets/Images/fundoplacar.png")}
        resizeMode="cover"
      >
        <View style={styles.infoContainer}>
          <Text style={styles.date}>{dataHoraJogo}</Text>
        </View>

        <TouchableOpacity onPress={handleLeagueClick} style={styles.InfLeague}>
          <Text style={styles.League}>
            {league.name}, Rodada {extrairRodada(league.round)}
          </Text>
        </TouchableOpacity>

        <View style={styles.teamsContainer}>
          <TouchableOpacity style={styles.team}>
            <Image source={{ uri: teams.home.logo }} style={styles.logo} />
            <Text style={styles.teamName}>{teams.home.name}</Text>
          </TouchableOpacity>

          <View
            style={[
              styles.Placar,
              (JogonaoIniciado ||
                JogoAbandonado ||
                JogoAdiado ||
                JogoCancelado ||
                JogoInterrompido ||
                JogoSuspenso) && {
                backgroundColor: "transparent",
                borderWidth: 0,
              },
            ]}
          >
            {jogoEncerrado && (
              <Text
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#2f9fa6",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                Jogo Finalizado
              </Text>
            )}

            {jogoAoVivo && (
              <Text
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#2f9fa6",
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                {minutagem}'
              </Text>
            )}
            {JogoIntervalo && (
              <Text
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  color: "orange",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                Intervalo
              </Text>
            )}
            {JogoSuspenso && (
              <Text
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  color: "orange",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                Jogo Suspenso
              </Text>
            )}
            {JogoInterrompido && (
              <Text
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  color: "orange",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                Jogo Interrompido
              </Text>
            )}
            {JogoAdiado && (
              <Text
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  color: "orange",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                Jogo Adiado
              </Text>
            )}
            {JogoCancelado && (
              <Text
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  color: "orange",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                Jogo Cancelado
              </Text>
            )}
            {JogoAbandonado && (
              <Text
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  color: "orange",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                Jogo JogoAbandonado
              </Text>
            )}

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
          </View>
          <TouchableOpacity style={styles.team}>
            {/* Placar time visitante */}

            <Image source={{ uri: teams.away.logo }} style={styles.logo} />
            <Text style={styles.teamName}>{teams.away.name}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.extraInfoContainer}>
          <Text style={styles.extraInfoText}>
            Estádio: {fixture.venue.name}
          </Text>
          <Text style={styles.extraInfoText}>
            Árbitro: {fixture.referee || "Informação não disponível"}
          </Text>
        </View>
      </ImageBackground>
      <ScrollView horizontal={true}>
        <View style={styles.botoesContainer}>
          <View style={styles.BtnInfos}>
            <TouchableOpacity
              style={{
                backgroundColor:
                  opcaoSelecionada === "Eventos" ? "#2f9fa6" : "#2C2C2E",
                alignItems: "center",
                padding: 10,
                borderRadius: 5,
              }}
              onPress={() => setOpcaoSelecionada("Eventos")}
            >
              <FontAwesome5 name="exchange-alt" size={20} color="white" />
              <Text style={{ color: "white" }}>Eventos</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.BtnInfos}>
            <TouchableOpacity
              style={{
                backgroundColor:
                  opcaoSelecionada === "Escalacoes" ? "#2f9fa6" : "#2C2C2E",
                alignItems: "center",
                padding: 10,
                borderRadius: 5,
              }}
              onPress={() => setOpcaoSelecionada("Escalacoes")}
            >
              <MaterialCommunityIcons
                name="soccer-field"
                size={20}
                color="white"
              />
              <Text style={{ color: "white" }}>Escalações</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.BtnInfos}>
            <TouchableOpacity
              style={{
                backgroundColor:
                  opcaoSelecionada === "Estatisticas" ? "#2f9fa6" : "#2C2C2E",
                alignItems: "center",
                padding: 10,
                borderRadius: 5,
              }}
              onPress={() => setOpcaoSelecionada("Estatisticas")}
            >
              <Ionicons name="stats-chart" size={20} color="white" />
              <Text style={{ color: "white" }}>Estatísticas</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.BtnInfos}>
            <TouchableOpacity
              style={{
                backgroundColor:
                  opcaoSelecionada === "Tabela" ? "#2f9fa6" : "#2C2C2E",
                alignItems: "center",
                padding: 10,
                borderRadius: 5,
              }}
              onPress={() => setOpcaoSelecionada("Tabela")}
            >
              <FontAwesome6 name="table-list" size={20} color="white" />
              <Text style={{ color: "white" }}>Tabela</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.BtnInfos}>
            <TouchableOpacity
              style={{
                backgroundColor:
                  opcaoSelecionada === "Confrontos" ? "#2f9fa6" : "#2C2C2E",
                alignItems: "center",
                padding: 10,
                borderRadius: 5,
              }}
              onPress={() => setOpcaoSelecionada("Confrontos")}
            >
              <FontAwesome6 name="table-list" size={20} color="white" />
              <Text style={{ color: "white" }}>Confrontos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {opcaoSelecionada === "Estatisticas" && (
        <View style={styles.statisticsContainer}>
          <Text style={styles.sectionTitle}>Estatísticas da Partida</Text>
          {statistics && statistics.length >= 2 && (
            <>
              <View style={styles.statsRow}>
                <View style={styles.StatsTeams}>
                  <Image
                    source={{ uri: teams.home.logo }}
                    style={styles.logo1}
                  />
                  <Text style={styles.teamStatsTitle}>{teams.home.name}</Text>
                </View>
                <View style={styles.StatsTeams}>
                  <Image
                    source={{ uri: teams.away.logo }}
                    style={styles.logo1}
                  />
                  <Text style={styles.teamStatsTitle}>{teams.away.name}</Text>
                </View>
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

      {opcaoSelecionada === "Tabela" && (
        <TabelaComponent leagueId={jogo.league.id} />
      )}

      {opcaoSelecionada === "Escalacoes" && (
        <View style={styles.lineupsContainer}>
          <Text style={styles.sectionTitle}>Escalações</Text>

          <View style={styles.toggleButtonContainer}>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowHomeTeam(!showHomeTeam)}
            >
              <Text style={styles.toggleButtonText}>
                {showHomeTeam
                  ? `Ver Escalação ${teams.away.name}`
                  : `Ver Escalação ${teams.home.name}`}
              </Text>
            </TouchableOpacity>
          </View>

          {showHomeTeam ? (
            <View style={styles.teamLineup}>
              <View style={styles.lineupTeams}>
                <Text style={styles.teamName2}>
                  {teams.home.name}, {lineups[0]?.formation}
                </Text>
                <Image source={{ uri: teams.home.logo }} style={styles.logo1} />
              </View>
              <Text style={styles.teamName2}>-- Titulares --</Text>
              {lineups &&
                lineups.length > 0 &&
                lineups[0].startXI.map((player, index) => (
                  <Text key={index} style={styles.starterPlayer}>
                    {player.player.name}
                  </Text>
                ))}

              <View style={styles.teamLineup}>
                <Text style={styles.teamName2}> -- Reservas --</Text>
                {lineups &&
                  lineups.length > 0 &&
                  lineups[0].substitutes.map((player, index) => (
                    <Text key={index} style={styles.substitutePlayer}>
                      {player.player.name}
                    </Text>
                  ))}
              </View>
              <Text style={styles.teamName2}>
                Treinador: {lineups[0]?.coach?.name}
              </Text>
            </View>
          ) : (
            <View style={styles.teamLineup}>
              <View style={styles.lineupTeams}>
                <Text style={styles.teamName2}>
                  {teams.away.name}, {lineups[1]?.formation}
                </Text>
                <Image source={{ uri: teams.away.logo }} style={styles.logo1} />
              </View>
              <Text style={styles.teamName2}>-- Titulares --</Text>
              {lineups &&
                lineups.length > 1 &&
                lineups[1].startXI.map((player, index) => (
                  <Text key={index} style={styles.starterPlayer}>
                    {player.player.name}
                  </Text>
                ))}

              <View style={styles.teamLineup}>
                <Text style={styles.teamName2}> -- Reservas --</Text>
                {lineups &&
                  lineups.length > 1 &&
                  lineups[1].substitutes.map((player, index) => (
                    <Text key={index} style={styles.substitutePlayer}>
                      {player.player.name}
                    </Text>
                  ))}
              </View>
              <Text style={styles.teamName2}>
                Treinador: {lineups[1]?.coach?.name}
              </Text>
            </View>
          )}
        </View>
      )}
      {opcaoSelecionada === "Confrontos" && (
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Últimos Confrontos Diretos</Text>
          {h2hData && h2hData.length > 0 ? (
            h2hData
              .sort(
                (a, b) => new Date(b.fixture.date) - new Date(a.fixture.date)
              ) // Ordena por data, mais recente primeiro
              .slice(0, 10) // Limita aos 10 últimos jogos
              .map((confronto, index) => (
                <TouchableOpacity key={index} style={styles.jogoContainerh2}>
                  <Image
                    source={{ uri: confronto.teams.home.logo }}
                    style={styles.logoh2}
                  />
                  <View style={styles.teamContainerHomeh2}>
                    <Text style={styles.equipesh2}>
                      {confronto.teams.home.name}
                    </Text>
                  </View>
                  <View style={styles.ContainResultadoh2}>
                    <Text style={styles.resultadoAoVivoh2}>
                      {confronto.goals.home} - {confronto.goals.away}
                    </Text>
                    <Text style={styles.h2hDate}>
                      {moment(confronto.fixture.date).format("DD/MM/YYYY")}
                    </Text>
                    <Text style={styles.h2hCompetition}>
                      {confronto.league.name}
                    </Text>
                  </View>
                  <View style={styles.teamContainerAwayh2}>
                    <Text style={styles.equipesh2}>
                      {confronto.teams.away.name}
                    </Text>
                  </View>
                  <Image
                    source={{ uri: confronto.teams.away.logo }}
                    style={styles.logoh2}
                  />
                </TouchableOpacity>
              ))
          ) : (
            <Text style={styles.noH2hText}>Nenhum confronto disponível</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const stylesVideo = StyleSheet.create({
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  video: {
    width: "1550%",
    height: "50%",
  },
});
