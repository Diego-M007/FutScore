import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import moment from "moment-timezone";
import CompeticoesPorPaisComponent from "../components/CompetiçõesPorPaises";
import HeaderComponent from "../components/HeaderComponent";
import { stylesPartidas } from "../styles/StylePartidas";
import { API_FOOTBALL_KEY } from "@env";
import TxtComponent from "../components/TxtComponent";
import EspaçoPropaganda from "../components/PropagandoComponent";

export default function Torneios() {
  const [competicoesPorPais, setCompeticoesPorPais] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const timezone = "America/Sao_Paulo";

  useEffect(() => {
    const fetchCompeticoes = async () => {
      try {
        const today = moment().tz(timezone).format("YYYY-MM-DD");

        const response = await axios.get(
          "https://v3.football.api-sports.io/fixtures",
          {
            params: {
              date: today,
              timezone: timezone,
            },
            headers: {
              "x-rapidapi-host": "v3.football.api-sports.io",
              "x-rapidapi-key": API_FOOTBALL_KEY,
            },
          }
        );

        const paises = {};

        response.data.response.forEach((jogo) => {
          const pais = jogo.league.country;
          const competicao = jogo.league.name;

          if (!paises[pais]) {
            paises[pais] = [];
          }

          let competicaoObj = paises[pais].find(
            (comp) => comp.nome === competicao
          );

          if (!competicaoObj) {
            competicaoObj = {
              nome: competicao,
              imagem: jogo.league.logo,
              jogos: [],
            };
            paises[pais].push(competicaoObj);
          }
        });

        setCompeticoesPorPais(paises);
      } catch (error) {
        console.error("Erro ao buscar as competições:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompeticoes();
  }, []);

  const openModal = (competicao) => {
    setSelectedCompetition(competicao);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCompetition(null);
  };

  if (loading) {
    return (
      <SafeAreaView style={stylesPartidas.all}>
        <StatusBar barStyle="light-content" />
        <HeaderComponent />
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={stylesPartidas.all}>
      <StatusBar barStyle="light-content" />
      <HeaderComponent />
      <EspaçoPropaganda />
      <TxtComponent
        texto={"Competições"}
        styleTxt={stylesPartidas.TextoPrincipal}
      />
      <ScrollView contentContainerStyle={stylesPartidas.Container}>
        {Object.keys(competicoesPorPais).map((pais) => (
          <View key={pais}>
            <TxtComponent
              texto={pais}
              styleTxt={stylesPartidas.TextoSecundario}
            />
            {competicoesPorPais[pais].map((competicao, index) => (
              <TouchableOpacity
                key={`${competicao.nome}-${index}`} // Adicionando uma key única
                onPress={() => openModal(competicao)}
              >
                <Text>{competicao.nome}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedCompetition?.nome}</Text>
            {/* Coloque aqui a tabela da competição */}
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.closeButton}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    color: "blue",
    fontSize: 16,
  },
});
