import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  FlatList,
} from "react-native";
import axios from "axios";
import moment from "moment-timezone";

// Array com IDs das ligas que queremos filtrar

const LigasEspecificasComponent = () => {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);

  const ligasEspecificas = [123, 456, 789]; // Exemplo: Libertadores, Sul-Americana, Brasileirão

  // Função para buscar os jogos do dia
  useEffect(() => {
    const fetchJogos = async () => {
      try {
        const response = await axios.get(
          "https://v3.football.api-sports.io/fixtures",
          {
            headers: {
              "x-rapidapi-key": API_FOOTBALL_KEY, // Sua chave da API
              "x-rapidapi-host": "v3.football.api-sports.io",
            },
            params: {
              timezone: "America/Sao_Paulo",
              date: moment().format("YYYY-MM-DD"),
            },
          }
        );
        const jogosDoDia = response.data.response;
        setJogos(jogosDoDia);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar os jogos:", error);
        setLoading(false);
      }
    };
    fetchJogos();
  }, []);

  // Função para filtrar os jogos pelas ligas específicas
  const filtrarJogosPorLigas = (jogos) => {
    return jogos.filter((jogo) => ligasEspecificas.includes(jogo.league.id));
  };

  // Função para renderizar cada card de competição com os jogos filtrados
  const renderCompeticaoCard = ({ item }) => {
    const jogosCompeticao = filtrarJogosPorLigas(item.jogos);

    return (
      <TouchableOpacity onPress={() => {}}>
        <View style={styles.card}>
          <Image source={{ uri: item.imagem }} style={styles.imagem} />
          <View style={styles.info}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text
              style={styles.quantidadeJogos}
            >{`${jogosCompeticao.length} jogos`}</Text>
          </View>
        </View>
        {jogosCompeticao.map((jogo) => (
          <View key={jogo.fixtureId} style={styles.jogoContainer}>
            <Text style={styles.equipes}>
              {jogo.timeCasa} vs {jogo.timeVisitante}
            </Text>
            <Text style={styles.horario}>{jogo.horario}</Text>
          </View>
        ))}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <Text>Carregando jogos...</Text>;
  }

  return (
    <FlatList
      data={jogos}
      renderItem={renderCompeticaoCard}
      keyExtractor={(item) => item.nome}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2f9fa6",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#2C2C2E",
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imagem: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: "contain",
    borderRadius: 10,
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  quantidadeJogos: {
    fontSize: 12,
    color: "#fff",
  },
  jogoContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#3A3A3C",
  },
  equipes: {
    fontSize: 14,
    color: "#fff",
  },
  horario: {
    fontSize: 12,
    color: "#fff",
  },
});

export default LigasEspecificasComponent;
