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

  useEffect(() => {
    if (!ligaId) return;

    const carregarDadosDaLiga = async () => {
      setLoading(true);
      try {
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

  const formatarTemporada = (ano) => {
    const proximoAno = ano + 1;
    return `${ano % 100}/${proximoAno % 100}`;
  };

  const temporadas = [2024, 2023, 2022];

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
                {item.fixture.status.elapsed} min
              </Text>
            );

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
              <Image
                source={{ uri: item.teams.home.logo }}
                style={styles.logo}
              />
              <View style={styles.teamContainerHome}>
                <Text style={styles.equipes}>{item.teams.home.name}</Text>
              </View>
              {statusComponent}
              <View style={styles.teamContainerAway}>
                <Text style={styles.equipes}>{item.teams.away.name}</Text>
              </View>
              <Image
                source={{ uri: item.teams.away.logo }}
                style={styles.logo}
              />
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
          <Text
            style={styles.playerText}
          >{`${item.player.name} - ${item.statistics[0].goals.total} gols`}</Text>
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
          <Text
            style={styles.playerText}
          >{`${item.player.name} - ${item.statistics[0].goals.assists} assistências`}</Text>
        )}
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Informações da Liga</Text>

      <View style={styles.yearSelector}>
        <Text style={styles.label}>Selecione a temporada:</Text>
        {temporadas.map((ano) => (
          <TouchableOpacity
            key={ano}
            style={[
              styles.yearButton,
              anoSelecionado === ano && styles.yearButtonSelected,
            ]}
            onPress={() => setAnoSelecionado(ano)}
          >
            <Text style={styles.yearButtonText}>{formatarTemporada(ano)}</Text>
          </TouchableOpacity>
        ))}
      </View>

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
          <TabelaComponent leagueId={ligaId} />
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
    backgroundColor: "black",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  yearSelector: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
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
  botoesContainer: {
    marginBottom: 20,
    flexDirection: "row",
  },
  BtnInfos: {
    marginRight: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  section: {
    marginBottom: 20,
  },
  noDataText: {
    color: "white",
    textAlign: "center",
    marginTop: 10,
  },
});

export default PaginaLiga;
