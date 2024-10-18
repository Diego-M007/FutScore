import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import { API_FOOTBALL_KEY } from "@env";

export default function TorneioCardComponent({ imagem, nome, ligaId, tipo }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [tabela, setTabela] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTabela = async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint =
        tipo === "liga"
          ? "https://v3.football.api-sports.io/standings"
          : "https://v3.football.api-sports.io/standings";

      const response = await axios.get(endpoint, {
        params: {
          season: new Date().getFullYear(),
          league: ligaId,
        },
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": API_FOOTBALL_KEY,
        },
      });

      if (response.data && response.data.response.length > 0) {
        const tournamentData = response.data.response[0];
        if (tournamentData.league && tournamentData.league.standings) {
          setTabela(tournamentData.league.standings);
        } else {
          setError("Dados do torneio não disponíveis.");
        }
      } else {
        setError("Nenhuma resposta válida da API.");
      }
    } catch (error) {
      setError("Erro ao buscar a tabela: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    setModalVisible(true);
    fetchTabela();
  };

  // Função para estilizar os últimos jogos (forma)
  const renderForma = (formaString) => {
    return formaString.split("").map((result, index) => {
      let color;
      if (result === "W") color = "#90EE90"; // Verde claro para vitória
      else if (result === "D") color = "gray"; // Empate
      else if (result === "L") color = "red"; // Derrota

      return (
        <View
          key={index}
          style={[styles.formCircle, { backgroundColor: color }]}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.card}>
          <Image source={{ uri: imagem }} style={styles.imagem} />
          <Text style={styles.nome}>{nome}</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#00ff00" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <ScrollView horizontal>
              <View>
                {/* Header da tabela com os nomes das colunas */}
                <View style={styles.tableHeader}>
                  <Text style={styles.headerText}>#</Text>
                  <Text style={styles.headerText}>Time</Text>
                  <Text style={styles.headerText}>P</Text>
                  <Text style={styles.headerText}>V</Text>
                  <Text style={styles.headerText}>E</Text>
                  <Text style={styles.headerText}>D</Text>
                  <Text style={styles.headerText}>SG</Text>
                  <Text style={styles.headerText}>Forma</Text>
                </View>

                {/* Tabela com os dados */}
                <ScrollView>
                  {tabela.length > 0 ? (
                    tabela.map((group, groupIndex) => (
                      <View key={groupIndex}>
                        {group.map((team, index) => (
                          <View key={team.team.id} style={styles.teamRow}>
                            <Text style={styles.teamPosition}>{index + 1}</Text>
                            <View style={styles.teamInfo}>
                              <Image
                                source={{ uri: team.team.logo }}
                                style={styles.teamLogo}
                              />
                              <Text style={styles.teamName}>
                                {team.team.name}
                              </Text>
                            </View>
                            <Text style={styles.teamStat}>{team.points}</Text>
                            <Text style={styles.teamStat}>{team.all.win}</Text>
                            <Text style={styles.teamStat}>{team.all.draw}</Text>
                            <Text style={styles.teamStat}>{team.all.lose}</Text>
                            <Text style={styles.teamStat}>
                              {team.goalsDiff}
                            </Text>
                            <View style={styles.formContainer}>
                              {renderForma(team.form)}
                            </View>
                          </View>
                        ))}
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noDataText}>
                      Nenhuma tabela disponível.
                    </Text>
                  )}
                </ScrollView>
              </View>
            </ScrollView>
          )}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: "#2f9fa6",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#2C2C2E",
  },
  imagem: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  nome: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 10,
    backgroundColor: "#333",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    width: 60, // Define uma largura consistente para centralizar
    textAlign: "center",
  },
  teamRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  teamPosition: {
    fontSize: 18,
    color: "#fff",
    width: 30,
    textAlign: "center",
  },
  teamInfo: {
    flexDirection: "row",
    alignItems: "center",
    width: 150, // Ajuste a largura para controlar o espaço
  },
  teamLogo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  teamName: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 10,
    flexShrink: 1, // Evita que o texto exceda seu contêiner
    maxWidth: 100, // Limita o tamanho máximo do nome do time
  },
  teamStat: {
    fontSize: 16,
    color: "#fff",
    width: 60, // Centraliza os dados com a largura definida
    textAlign: "center",
  },
  noDataText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#2f9fa6",
    alignItems: "center",
    borderRadius: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  formContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 100,
    justifyContent: "center",
  },
  formCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
  },
});
