import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { API_FOOTBALL_KEY } from "@env";
import TabelaComponent from "./TabelaComponent"; // Importando o TabelaComponent

export default function TorneioCardComponent({ imagem, nome, ligaId, tipo }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabela, setTabela] = useState(null); // Inicializando a tabela

  const fetchTabela = async () => {
    setLoading(true);
    setError(null);

    try {
      // Endpoint para buscar a tabela de ligas
      const response = await axios.get(
        "https://v3.football.api-sports.io/standings",
        {
          params: {
            season: new Date().getFullYear(),
            league: ligaId, // Passando o ID da liga
          },
          headers: {
            "x-rapidapi-host": "v3.football.api-sports.io",
            "x-rapidapi-key": API_FOOTBALL_KEY,
          },
        }
      );

      console.log("Dados da API:", response.data); // Log para verificar os dados recebidos

      // Verificando se a resposta contém dados válidos
      if (response.data && response.data.response.length > 0) {
        const tournamentData = response.data.response[0];
        if (
          tournamentData.league &&
          tournamentData.league.standings &&
          tournamentData.league.standings.length > 0
        ) {
          setTabela(tournamentData.league.standings[0]); // Defina a tabela corretamente
        } else {
          setError("Dados da tabela não disponíveis.");
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
    fetchTabela(); // Busca os dados da tabela ao abrir o modal
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
            // Passando ligaId, tabela e renderForma para o TabelaComponent
            <TabelaComponent
              ligaId={ligaId}
              tabela={tabela}
              renderForma={renderForma}
            />
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
  errorText: {
    color: "red",
    textAlign: "center",
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
  formCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
  },
});
