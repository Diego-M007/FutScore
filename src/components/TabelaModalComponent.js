import React, { useState, useEffect } from "react";
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

export default function TabelaModalComponent({ visible, onClose, ligaId }) {
  const [tabela, setTabela] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ligaId && visible) {
      fetchTabela();
    }
  }, [ligaId, visible]);

  const fetchTabela = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://v3.football.api-sports.io/standings`,
        {
          params: { league: ligaId, season: new Date().getFullYear() },
          headers: {
            "x-rapidapi-host": "v3.football.api-sports.io",
            "x-rapidapi-key": API_FOOTBALL_KEY,
          },
        }
      );

      if (response.data && response.data.response) {
        setTabela(response.data.response[0].league.standings[0]);
      }
    } catch (error) {
      console.error("Erro ao buscar tabela:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <ScrollView>
              {tabela.length > 0 ? (
                tabela.map((time, index) => (
                  <View key={time.team.id} style={styles.timeRow}>
                    <Text>
                      {index + 1} - {time.team.name}
                    </Text>
                    <Text>{time.points} pts</Text>
                  </View>
                ))
              ) : (
                <Text>Nenhuma tabela disponível.</Text>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  closeButtonText: {
    color: "red",
    fontSize: 16,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
});
