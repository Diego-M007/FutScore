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
import { API_FOOTBALL_KEY } from "@env";
import TabelaComponent from "../components/TabelaComponent";

const PaginaLiga = ({ route, navigation }) => {
  const { ligaId } = route.params;
  const [jogos, setJogos] = useState([]);
  const [artilheiros, setArtilheiros] = useState([]);
  const [assistentes, setAssistentes] = useState([]);
  const [anoSelecionado, setAnoSelecionado] = useState(
    new Date().getFullYear()
  );
  const [loading, setLoading] = useState(true);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState("Tabela");
  const [modalVisible, setModalVisible] = useState(false);
  const [ligaDetalhes, setLigaDetalhes] = useState(null); // Estado para armazenar detalhes da liga

  const temporadas = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i
  );

  useEffect(() => {
    if (!ligaId) return;

    const carregarDadosDaLiga = async () => {
      setLoading(true);
      try {
        // Carregar detalhes da liga
        const responseLiga = await axios.get(
          `https://v3.football.api-sports.io/leagues`,
          {
            params: { id: ligaId },
            headers: {
              "x-rapidapi-key": API_FOOTBALL_KEY,
              "x-rapidapi-host": "v3.football.api-sports.io",
            },
          }
        );
        const detalhes = responseLiga.data.response[0];
        setLigaDetalhes(detalhes);

        // Carregar jogos
        const responseJogos = await axios.get(
          `https://v3.football.api-sports.io/fixtures`,
          {
            params: { league: ligaId, season: anoSelecionado },
            headers: {
              "x-rapidapi-key": API_FOOTBALL_KEY,
              "x-rapidapi-host": "v3.football.api-sports.io",
            },
          }
        );
        setJogos(responseJogos.data.response);

        // Carregar artilheiros
        const responseArtilheiros = await axios.get(
          `https://v3.football.api-sports.io/players/topscorers`,
          {
            params: { league: ligaId, season: anoSelecionado },
            headers: {
              "x-rapidapi-key": API_FOOTBALL_KEY,
              "x-rapidapi-host": "v3.football.api-sports.io",
            },
          }
        );
        setArtilheiros(responseArtilheiros.data.response);

        // Carregar assistentes
        const responseAssistentes = await axios.get(
          `https://v3.football.api-sports.io/players/topassists`,
          {
            params: { league: ligaId, season: anoSelecionado },
            headers: {
              "x-rapidapi-key": API_FOOTBALL_KEY,
              "x-rapidapi-host": "v3.football.api-sports.io",
            },
          }
        );
        setAssistentes(responseAssistentes.data.response);
      } catch (error) {
        console.error("Erro ao carregar dados da liga:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosDaLiga();
  }, [ligaId, anoSelecionado]);

  const selecionarAno = (ano) => {
    setAnoSelecionado(ano);
    setModalVisible(false);
  };

  const renderJogos = () => {
    if (loading) return <ActivityIndicator size="large" color="#2f9fa6" />;
    if (jogos.length === 0)
      return <Text style={styles.noDataText}>Nenhum jogo encontrado.</Text>;

    return (
      <FlatList
        data={jogos}
        keyExtractor={(item) => item.fixture.id.toString()}
        renderItem={({ item }) => {
          const statusComponent =
            item.fixture.status.short === "FT" ? (
              <Text style={styles.statusText}>Fim</Text>
            ) : (
              <Text style={styles.statusText}>
                {item.fixture.status.elapsed
                  ? `${item.fixture.status.elapsed} min`
                  : "A iniciar"}
              </Text>
            );

          const placar =
            item.fixture.status.short === "FT" ||
            item.fixture.status.short === "2H" ||
            item.fixture.status.short === "HT" ||
            item.fixture.status.short === "1H"
              ? `${item.goals.home} - ${item.goals.away}`
              : "VS";

          return (
            <TouchableOpacity
              key={item.fixture.id}
              style={styles.jogoContainer}
              onPress={() =>
                navigation.navigate("DetalhesDoJogo", {
                  jogoId: item.fixture.id,
                })
              }
            >
              <View style={styles.teamContainer}>
                <Image
                  source={{ uri: item.teams.home.logo }}
                  style={styles.logo}
                />
                <Text style={styles.equipes}>{item.teams.home.name}</Text>
              </View>

              <View style={styles.scoreContainer}>
                <Text style={styles.placar}>{placar}</Text>
                {statusComponent}
              </View>

              <View style={styles.teamContainer}>
                <Image
                  source={{ uri: item.teams.away.logo }}
                  style={styles.logo}
                />
                <Text style={styles.equipes}>{item.teams.away.name}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  const renderArtilheiros = () => {
    if (loading) return <ActivityIndicator size="large" color="#2f9fa6" />;
    if (artilheiros.length === 0)
      return (
        <Text style={styles.noDataText}>Nenhum artilheiro encontrado.</Text>
      );

    return (
      <FlatList
        data={artilheiros}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.playerContainer}>
            <Image
              source={{ uri: item.player.photo }}
              style={styles.playerImage}
            />
            <Text style={styles.playerText}>
              {`${item.player.name} - ${item.statistics[0].goals.total} gols`}
            </Text>
          </View>
        )}
      />
    );
  };

  const renderAssistentes = () => {
    if (loading) return <ActivityIndicator size="large" color="#2f9fa6" />;
    if (assistentes.length === 0)
      return (
        <Text style={styles.noDataText}>Nenhum assistente encontrado.</Text>
      );

    return (
      <FlatList
        data={assistentes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.playerContainer}>
            <Image
              source={{ uri: item.player.photo }}
              style={styles.playerImage}
            />
            <Text style={styles.playerText}>
              {`${item.player.name} - ${item.statistics[0].goals.assists} assistências`}
            </Text>
          </View>
        )}
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      {ligaDetalhes && (
        <View style={styles.ligaHeader}>
          <Image
            source={{ uri: ligaDetalhes.league.logo }}
            style={styles.ligaLogo}
          />
          <Text style={styles.ligaNome}>{ligaDetalhes.league.name}</Text>
        </View>
      )}

      <View style={styles.yearSelector}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.selectedYearText}>
            Temporada {anoSelecionado}
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

      <ScrollView horizontal={true}>
        {["Tabela", "Jogos", "Artilheiros", "Assistentes"].map((opcao) => (
          <View style={styles.botoesContainer} key={opcao}>
            <View style={styles.BtnInfos}>
              <TouchableOpacity
                style={{
                  backgroundColor:
                    opcaoSelecionada === opcao ? "#2f9fa6" : "#2C2C2E",
                  alignItems: "center",
                  padding: 10,
                  borderRadius: 5,
                }}
                onPress={() => setOpcaoSelecionada(opcao)}
              >
                <Text style={{ color: "white" }}>{opcao}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {opcaoSelecionada === "Tabela" && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Tabela ao Vivo</Text>
          <TabelaComponent leagueId={ligaId} ano={anoSelecionado} />
        </View>
      )}

      {opcaoSelecionada === "Jogos" && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Jogos da Liga</Text>
          {renderJogos()}
        </View>
      )}

      {opcaoSelecionada === "Artilheiros" && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Artilheiros</Text>
          {renderArtilheiros()}
        </View>
      )}

      {opcaoSelecionada === "Assistentes" && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Assistentes</Text>
          {renderAssistentes()}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1C1C1E",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 16,
    justifyContent: "center",
  },
  ligaHeader: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 16,
  },
  ligaLogo: {
    width: 80,
    height: 80,
  },
  ligaNome: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#FFF",
  },
  selectedYearText: {
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
    marginVertical: 10,
  },
  yearSelector: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#2C2C2E",
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    color: "#FFF",
    marginBottom: 20,
  },
  modalOption: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  modalOptionText: {
    color: "#FFF",
    fontSize: 18,
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#2f9fa6",
    borderRadius: 5,
  },
  modalCloseText: {
    color: "white",
    fontSize: 16,
  },
  botoesContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  BtnInfos: {
    marginHorizontal: 5,
  },
  section: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  jogoContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#2F2F2F",
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    justifyContent: "space-between",
  },
  logo: {
    width: 36,
    height: 36,
    resizeMode: "contain",
  },
  equipes: {
    fontSize: 15,
    color: "#FFF",
    fontWeight: "500",
    maxWidth: 100, // Limita o comprimento do nome do time
    textAlign: "center",
  },
  statusText: {
    fontSize: 14,
    color: "#2f9fa6",
    textAlign: "center",
    marginTop: 4,
  },
  teamContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#444",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 8,
  },
  placar: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  playerText: {
    fontSize: 16,
    color: "#FFF",
    marginVertical: 5,
  },
  noDataText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  playerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
});

export default PaginaLiga;
