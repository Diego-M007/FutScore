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
  Modal,
} from "react-native";
import axios from "axios";
import moment from "moment-timezone";
import { API_FOOTBALL_KEY } from "@env";

const PaginaTime = ({ route, navigation }) => {
  const { timeId } = route.params;
  const [jogos, setJogos] = useState([]);
  const [teamInfo, setTeamInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anoSelecionado, setAnoSelecionado] = useState(
    new Date().getFullYear()
  );
  const [jogadores, setJogadores] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const temporadas = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i
  );

  useEffect(() => {
    if (!timeId) return;

    const carregarDadosDoTime = async () => {
      setLoading(true);
      try {
        // Requisição para obter informações do time e logo
        const responseTime = await axios.get(
          `https://v3.football.api-sports.io/teams`,
          {
            params: { id: timeId },
            headers: {
              "x-rapidapi-key": API_FOOTBALL_KEY,
              "x-rapidapi-host": "v3.football.api-sports.io",
            },
          }
        );
        setTeamInfo(responseTime.data.response[0].team);

        // Requisição para obter os jogos
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

        // Requisição para obter a lista de jogadores do time
        let todosJogadores = [];
        let page = 1; // Começa na página 1
        let totalJogadores = 0;

        do {
          const responseJogadores = await axios.get(
            `https://v3.football.api-sports.io/players`,
            {
              params: {
                team: timeId,
                season: anoSelecionado,
                page: page,
              },
              headers: {
                "x-rapidapi-key": API_FOOTBALL_KEY,
                "x-rapidapi-host": "v3.football.api-sports.io",
              },
            }
          );

          const jogadoresPagina = responseJogadores.data.response.map(
            (item) => item.player
          );

          // Adiciona os jogadores da página atual ao array total de jogadores
          todosJogadores = [...todosJogadores, ...jogadoresPagina];
          totalJogadores = responseJogadores.data.paging.total;

          page++;
        } while ((page - 1) * 20 < totalJogadores); // Ajusta a condição para o total

        // Atualiza o estado com todos os jogadores
        setJogadores(todosJogadores);
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

  const selecionarAno = (ano) => {
    setAnoSelecionado(ano);
    setModalVisible(false);
  };

  const renderJogo = ({ item }) => {
    const dataFormatada = moment(item.fixture.date).format("DD/MM/YYYY");
    const statusDoJogo = item.fixture.status.short;
    const horarioFormatado = moment(item.fixture.date).format("HH:mm");

    let resultadoOuHorario;

    if (statusDoJogo === "NS") {
      resultadoOuHorario = (
        <Text style={styles.h2hHorario}>{horarioFormatado}</Text>
      );
    } else if (statusDoJogo === "FT") {
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

  const renderJogador = ({ item }) => (
    <View style={styles.jogadorContainer}>
      <Image source={{ uri: item.photo }} style={styles.jogadorFoto} />
      <View style={{ flexDirection: "column" }}>
        <Text style={styles.jogadorNome}>{item.name}</Text>
        <Text style={styles.jogadorIdade}>Idade: {item.age}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {teamInfo && (
        <View style={styles.header}>
          <Image
            source={{
              uri: `https://media.api-sports.io/football/teams/${teamInfo.id}.png`,
            }}
            style={styles.teamLogo}
          />
          <Text style={styles.title}>{teamInfo.name}</Text>
        </View>
      )}

      <View style={styles.yearSelector}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.selectedYearText}>
            Temporada: {anoSelecionado}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal para selecionar temporada */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione a Temporada</Text>
            {temporadas.map((ano) => (
              <TouchableOpacity
                key={ano}
                style={styles.modalOption}
                onPress={() => selecionarAno(ano)}
              >
                <Text style={styles.modalOptionText}>{ano}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {loading ? (
        <ActivityIndicator size="large" color="#2f9fa6" />
      ) : (
        <>
          <Text style={styles.sectionTitle}>Próximos Jogos</Text>
          <FlatList
            data={jogos}
            keyExtractor={(item) => item.fixture.id.toString()}
            renderItem={renderJogo}
          />

          <Text style={styles.sectionTitle}>Jogadores</Text>
          <FlatList
            data={jogadores}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderJogador}
          />
        </>
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
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  teamLogo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
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
  jogadorContainer: {
    backgroundColor: "#1f1f1f",
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
  },
  jogadorFoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  jogadorNome: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  jogadorIdade: {
    color: "gray",
    fontSize: 14,
  },
  jogadorPosicao: {
    color: "gray",
    fontSize: 14,
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
  yearSelector: {
    marginBottom: 20,
    alignItems: "center",
  },
  selectedYearText: {
    fontSize: 16,
    color: "#2f9fa6",
    textDecorationLine: "underline",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalOption: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#2f9fa6",
  },
  modalCloseButton: {
    marginTop: 15,
  },
  modalCloseText: {
    fontSize: 16,
    color: "#2f9fa6",
  },
});

export default PaginaTime;
