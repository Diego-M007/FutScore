import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment-timezone";
import axios from "axios";
import { API_FOOTBALL_KEY } from "@env";

const formatHorario = (horario) => {
  const [horas, minutos] = horario.split(":");
  return `${horas}:${minutos}`;
};

const getStatusDoJogo = (status) => {
  const statusMap = {
    TBD: "A Definir",
    NS: "Não Iniciado",
    "1H": "1º Tempo",
    HT: "Intervalo",
    "2H": "2º Tempo",
    ET: "Prorrogação",
    BT: "Intervalo (Prorrogação)",
    P: "Pênaltis",
    SUSP: "Suspenso",
    INT: "Interrompido",
    FT: "Finalizado",
    AET: "Finalizado (Prorrogação)",
    PEN: "Finalizado (Pênaltis)",
    PST: "Adiado",
    CANC: "Cancelado",
    ABD: "Abandonado",
    AWD: "Derrota Técnica",
    WO: "WO",
    LIVE: "Ao Vivo",
  };

  return statusMap[status] || "Indefinido";
};

const JogosDoDiaComponent = ({ jogos }) => {
  const navigation = useNavigation();
  const [statuses, setStatuses] = useState({}); // Armazena o status e minutos de cada jogo

  useEffect(() => {
    const intervalo = setInterval(() => {
      jogos.forEach((jogo) => pegarStatusDoJogo(jogo.fixtureId)); // Atualiza todos os jogos a cada 30 segundos
    }, 30000);

    return () => clearInterval(intervalo);
  }, [jogos]);

  // Função para buscar o status do jogo a partir do fixtureId
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

      // Atualiza o status e minutos de cada jogo no estado
      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        [fixtureId]: { status: getStatusDoJogo(status), minutos },
      }));

      console.log("Status do jogo:", getStatusDoJogo(status)); // Log do status no console
    } catch (error) {
      console.error("Erro ao buscar status do jogo:", error);
    }
  };

  const renderJogo = (jogo) => {
    const dataHoraInicio = moment
      .tz(jogo.dataHoraInicio, "America/Sao_Paulo")
      .format("DD/MM/YYYY HH:mm");

    // Pega o status e minutos do jogo pelo fixtureId se já foi buscado
    const statusInfo = statuses[jogo.fixtureId] || {};
    const statusDoJogo = statusInfo.status || "Carregando...";
    const minutos = statusInfo.minutos;

    useEffect(() => {
      pegarStatusDoJogo(jogo.fixtureId);
    }, [jogo.fixtureId]);

    return (
      <TouchableOpacity
        key={jogo.fixtureId}
        style={styles.jogoContainer}
        onPress={() => {
          console.log("Fixture ID:", jogo.fixtureId);
          navigation.navigate("DetalhesDoJogo", { jogoId: jogo.fixtureId });
        }}
      >
        <Image source={{ uri: jogo.logoCasa }} style={styles.logo} />
        <View style={styles.teamContainerHome}>
          <Text style={styles.equipes}>{jogo.timeCasa}</Text>
        </View>

        {/* Se o jogo estiver adiado, exibe 'Jogo adiado', senão exibe o horário ou resultado */}
        {statusDoJogo === "Adiado" ? (
          <Text style={styles.adiado}>Jogo adiado</Text>
        ) : jogo.resultado ? (
          <Text style={styles.resultado}>{jogo.resultado}</Text>
        ) : statusDoJogo === "Ao Vivo" ? (
          <Text style={styles.aoVivo}>
            {`${statusDoJogo} ${minutos ? `- ${minutos} min` : ""}`}
          </Text>
        ) : (
          <Text style={styles.horario}>{formatHorario(jogo.horario)}</Text>
        )}

        <View style={styles.teamContainerAway}>
          <Text style={styles.equipes}>{jogo.timeVisitante}</Text>
        </View>
        <Image source={{ uri: jogo.logoVisitante }} style={styles.logo} />
      </TouchableOpacity>
    );
  };

  return <View style={styles.container}>{jogos.map(renderJogo)}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  jogoContainer: {
    borderWidth: 1,
    borderColor: "#2f9fa6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
    padding: 5,
    borderRadius: 10,
  },
  teamContainerHome: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    flexWrap: "wrap",
  },
  teamContainerAway: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
    flexWrap: "wrap",
  },
  logo: {
    width: 35,
    height: 35,
    borderRadius: 10,
    resizeMode: "contain",
  },
  equipes: {
    fontSize: 13,
    color: "white",
  },
  horario: {
    fontSize: 12,
    color: "white",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#2f9fa6",
    paddingHorizontal: 10,
    textAlign: "center",
    margin: 10,
  },
  resultado: {
    fontSize: 15,
    color: "white",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#2f9fa6",
    paddingHorizontal: 10,
    textAlign: "center",
    margin: 10,
  },
  adiado: {
    fontSize: 10,
    color: "orange",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#2f9fa6",
    paddingHorizontal: 5,
    textAlign: "center",
    margin: 10,
  },
  aoVivo: {
    fontSize: 12,
    color: "#f00",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#f00",
    paddingHorizontal: 10,
    textAlign: "center",
    margin: 10,
  },
});

export default JogosDoDiaComponent;
