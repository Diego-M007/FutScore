import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import HeaderComponent from "../components/HeaderComponent";
import EspacoPropaganda from "../components/PropagandoComponent";
import { Video, ResizeMode } from "expo-av";
import { stylesTorneios } from "../styles/StyleTorneios";
import { API_FOOTBALL_KEY } from "@env";
import TorneioCardComponent from "../components/TorneioCardComponent";
import TxtComponent from "../components/TxtComponent";
import TabelaModalComponent from "../components/TabelaModalComponent"; // Adicionei o componente de Tabela

export default function Torneios() {
  const [loading, setLoading] = useState(true);
  const [torneios, setTorneios] = useState([]);
  const [paises, setPaises] = useState([]);
  const [expandedPais, setExpandedPais] = useState({});
  const [isTabelaModalVisible, setTabelaModalVisible] = useState(false); // Estado do modal de tabela
  const [selectedLigaId, setSelectedLigaId] = useState(null); // Liga ou copa selecionada

  const melhoresLigas = [
    { name: "Premier League", country: "England" },
    { name: "La Liga", country: "Spain" },
    { name: "Serie A", country: "Italy" },
    { name: "Bundesliga", country: "Germany" },
    { name: "Ligue 1", country: "France" },
    { name: "Serie A", country: "Brazil" },
  ];

  useEffect(() => {
    const fetchTorneios = async () => {
      try {
        const response = await axios.get(
          "https://v3.football.api-sports.io/leagues",
          {
            params: { season: new Date().getFullYear() },
            headers: {
              "x-rapidapi-host": "v3.football.api-sports.io",
              "x-rapidapi-key": API_FOOTBALL_KEY,
            },
          }
        );

        if (response.data && response.data.response) {
          let ligas = response.data.response.filter(
            (league) => league.league && league.league.type === "League"
          );
          let copas = response.data.response.filter(
            (league) => league.league && league.league.type === "Cup"
          );

          const paisesUnicos = [
            ...new Set(ligas.map((liga) => liga.country.name)),
          ].sort();

          const melhores = ligas.filter((liga) =>
            melhoresLigas.some(
              (ml) =>
                ml.name === liga.league.name && ml.country === liga.country.name
            )
          );

          const outrasLigas = ligas
            .filter(
              (liga) =>
                !melhoresLigas.some(
                  (ml) =>
                    ml.name === liga.league.name &&
                    ml.country === liga.country.name
                )
            )
            .sort((a, b) => a.league.name.localeCompare(b.league.name));

          const melhoresOrdenadas = melhoresLigas
            .map((ml) =>
              melhores.find(
                (liga) =>
                  liga.league.name === ml.name &&
                  liga.country.name === ml.country
              )
            )
            .filter(Boolean);

          const ligasOrdenadas = [...melhoresOrdenadas, ...outrasLigas];

          setPaises(paisesUnicos);
          setTorneios(ligasOrdenadas);
        }
      } catch (error) {
        console.error("Erro ao buscar ligas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTorneios();
  }, []);

  const toggleExpandPais = (pais) => {
    setExpandedPais((prev) => ({
      ...prev,
      [pais]: !prev[pais],
    }));
  };

  // Função para abrir o modal de tabela
  const openTabelaModal = (ligaId) => {
    setSelectedLigaId(ligaId);
    setTabelaModalVisible(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={stylesTorneios.videoContainer}>
        <StatusBar barStyle="light-content" />
        <HeaderComponent />
        <View style={stylesTorneios.videoContainer}>
          <Video
            style={stylesTorneios.video}
            resizeMode={ResizeMode.CONTAIN}
            source={require("../assets/Images/Video/loading.mp4")}
            shouldPlay
            isLooping
            isMuted
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={stylesTorneios.all}>
      <StatusBar barStyle="light-content" />
      <HeaderComponent />
      <EspacoPropaganda />
      <ScrollView contentContainerStyle={stylesTorneios.Container}>
        {/* Exibição das Melhores Ligas */}
        <View style={stylesTorneios.section}>
          <TxtComponent
            texto={"Melhores Ligas"}
            styleTxt={stylesTorneios.TextoPrincipal}
          />
          {torneios.length > 0 ? (
            torneios
              .filter((torneio) =>
                melhoresLigas.some(
                  (ml) =>
                    ml.name === torneio.league.name &&
                    ml.country === torneio.country.name
                )
              )
              .map((torneio) => (
                <TorneioCardComponent
                  key={torneio.league.id}
                  imagem={torneio.league.logo}
                  nome={torneio.league.name}
                  ligaId={torneio.league.id}
                  onPress={() => openTabelaModal(torneio.league.id)} // Abre o modal de tabela
                  style={stylesTorneios.torneioCard}
                />
              ))
          ) : (
            <Text style={stylesTorneios.noDataText}>
              Nenhuma liga disponível.
            </Text>
          )}
        </View>

        {/* Exibição dos Países */}
        <View style={stylesTorneios.section}>
          <TxtComponent
            texto={"Selecione o País"}
            styleTxt={stylesTorneios.TextoPrincipal}
          />
          {paises.length > 0 ? (
            paises.map((pais) => (
              <View key={pais}>
                <TouchableOpacity
                  onPress={() => toggleExpandPais(pais)}
                  style={[
                    stylesTorneios.paisButton,
                    expandedPais[pais] && stylesTorneios.paisButtonSelected,
                  ]}
                >
                  <Text style={stylesTorneios.paisButtonText}>{pais}</Text>
                </TouchableOpacity>
                {expandedPais[pais] && (
                  <View style={stylesTorneios.ligasContainer}>
                    {torneios
                      .filter((torneio) => torneio.country.name === pais)
                      .map((torneio) => (
                        <TorneioCardComponent
                          key={torneio.league.id}
                          imagem={torneio.league.logo}
                          nome={torneio.league.name}
                          ligaId={torneio.league.id}
                          onPress={() => openTabelaModal(torneio.league.id)} // Abre o modal de tabela
                          style={stylesTorneios.torneioCard}
                        />
                      ))}
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text style={stylesTorneios.noDataText}>
              Nenhum país disponível.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Modal de Tabela */}
      <TabelaModalComponent
        visible={isTabelaModalVisible}
        onClose={() => setTabelaModalVisible(false)}
        ligaId={selectedLigaId}
      />
    </SafeAreaView>
  );
}
