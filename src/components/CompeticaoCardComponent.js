import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Button,
} from "react-native";
import JogosDoDiaComponent from "./JogosDoDiaComponent";
import axios from "axios";
import { API_FOOTBALL_KEY } from "@env";

export default function CompeticaoCardComponent({
  imagem,
  nome,
  quantidadeJogos,
  jogos,
  finalizados,
  isUEFA,
  fixtureId,
  mostrarAoVivo,
}) {
  const [expanded, setExpanded] = useState(false);
  const [heightAnim] = useState(new Animated.Value(60));
  const [statuses, setStatuses] = useState({}); // Agora o estado statuses está aqui no componente pai

  const toggleExpand = () => {
    setExpanded(!expanded);

    Animated.timing(heightAnim, {
      toValue: expanded ? 60 : 70 + jogos.length * 2,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  // Função para pegar o status do jogo
  const pegarStatusDoJogo = async (fixtureId) => {
    try {
      const response = await axios.get(
        `https://v3.football.api-sports.io/fixtures`,
        {
          params: { id: fixtureId, timezone: "America/Sao_Paulo" },
          headers: {
            "x-rapidapi-key": API_FOOTBALL_KEY,
            "x-rapidapi-host": "v3.football.api-sports.io",
          },
        }
      );

      const jogo = response.data.response[0];
      const status = jogo.fixture.status.short;
      const minutos = jogo.fixture.status.elapsed; // Minutos do jogo

      return { fixtureId, status, minutos };
    } catch (error) {
      console.error("Erro ao buscar status do jogo:", error);
      return { fixtureId, status: "Erro", minutos: null }; // Retorna erro
    }
  };

  useEffect(() => {
    const intervalo = setInterval(async () => {
      const updates = await Promise.all(
        jogos.map((jogo) => pegarStatusDoJogo(jogo.fixtureId))
      );

      const newStatuses = {};
      updates.forEach((update) => {
        newStatuses[update.fixtureId] = {
          status: update.status,
          minutos: update.minutos,
        };
      });

      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        ...newStatuses,
      }));
    }, 15000);

    // Atualiza o status de todos os jogos na montagem do componente
    const initialUpdates = Promise.all(
      jogos.map((jogo) => pegarStatusDoJogo(jogo.fixtureId))
    );
    initialUpdates.then((updates) => {
      const newStatuses = {};
      updates.forEach((update) => {
        newStatuses[update.fixtureId] = {
          status: update.status,
          minutos: update.minutos,
        };
      });
      setStatuses(newStatuses);
    });

    return () => clearInterval(intervalo); // Limpa o intervalo quando o componente é desmontado
  }, [jogos]);

  const jogosFiltrados = mostrarAoVivo
    ? jogos.filter((jogo) => {
        const status = statuses[jogo.fixtureId];
        return (
          status &&
          (status.status === "LIVE" ||
            status.status === "1H" ||
            status.status === "2H" ||
            status.status === "ET" ||
            status.status === "HT" ||
            status.status === "BT" ||
            status.status === "P")
        );
      })
    : jogos;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpand}>
        <Animated.View style={[styles.card, { height: heightAnim }]}>
          <Image source={{ uri: imagem }} style={styles.imagem} />
          <View style={styles.info}>
            <Text style={styles.nome}>{isUEFA ? "UEFA" : nome}</Text>
            <Text style={styles.quantidadeJogos}>
              {`${finalizados} / ${quantidadeJogos} jogos`}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>

      {expanded && (
        <JogosDoDiaComponent
          jogos={jogosFiltrados} // Usa os jogos filtrados
          statuses={statuses} // Passa os statuses atualizados
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 5,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2f9fa6",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#2C2C2E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
    margin: 2,
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
});
