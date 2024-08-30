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

export default function TorneioCardComponent({ imagem, nome, ligaId }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [tabela, setTabela] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTabela = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://v3.football.api-sports.io/standings`,
        {
          params: {
            season: new Date().getFullYear(),
            league: ligaId,
          },
          headers: {
            "x-rapidapi-host": "v3.football.api-sports.io",
            "x-rapidapi-key": API_FOOTBALL_KEY,
          },
        }
      );

      // Verificação adicional para evitar erros
      if (
        response.data &&
        response.data.response &&
        response.data.response.length > 0
      ) {
        const leagueData = response.data.response[0];
        if (leagueData.league && leagueData.league.standings) {
          const standings = leagueData.league.standings[0];
          setTabela(standings);
        } else {
          console.error("Dados da liga não disponíveis.");
        }
      } else {
        console.error("Resposta inesperada da API.");
      }
    } catch (error) {
      console.error("Erro ao buscar a tabela:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    setModalVisible(true);
    fetchTabela();
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
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {tabela.length > 0 ? (
                tabela.map((team, index) => (
                  <View key={team.team.id} style={styles.teamContainer}>
                    <Text style={styles.teamPosition}>{index + 1}</Text>
                    <Image
                      source={{ uri: team.team.logo }}
                      style={styles.teamLogo}
                    />
                    <Text style={styles.teamName}>{team.team.name}</Text>
                    <Text style={styles.teamPoints}>{team.points} pts</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>
                  Nenhuma tabela disponível.
                </Text>
              )}
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
  scrollContainer: {
    paddingBottom: 20,
  },
  teamContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  teamPosition: {
    fontSize: 18,
    color: "#fff",
    width: 30,
  },
  teamLogo: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
    resizeMode: "contain",
  },
  teamName: {
    fontSize: 18,
    color: "#fff",
    flex: 1,
  },
  teamPoints: {
    fontSize: 18,
    color: "#fff",
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
});
