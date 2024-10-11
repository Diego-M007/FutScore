import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment-timezone";
import axios from "axios";
import { API_FOOTBALL_KEY } from "@env";

// Função para formatar o horário
const formatHorario = (horario) => {
  const [horas, minutos] = horario.split(":");
  return `${horas}:${minutos}`;
};

// Função para buscar status de um único jogo por ID
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
    const status = {
      status: jogo.fixture.status.short,
      minutos: jogo.fixture.status.elapsed,
      penaltyScore: jogo.score.penalty ? jogo.score.penalty : null, // Adiciona o score dos pênaltis
    };

    return { [fixtureId]: status };
  } catch (error) {
    console.error("Erro ao buscar status do jogo:", error);
    return {
      [fixtureId]: { status: "Erro", minutos: null, penaltyScore: null },
    };
  }
};

const JogosDoDiaComponent = ({ jogos }) => {
  const [statuses, setStatuses] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    if (jogos && jogos.length > 0) {
      jogos.forEach(async (jogo) => {
        const statusMap = await pegarStatusDoJogo(jogo.fixtureId);
        setStatuses((prevStatuses) => ({
          ...prevStatuses,
          ...statusMap,
        }));
      });

      const intervalo = setInterval(() => {
        jogos.forEach(async (jogo) => {
          const statusMap = await pegarStatusDoJogo(jogo.fixtureId);
          setStatuses((prevStatuses) => ({
            ...prevStatuses,
            ...statusMap,
          }));
        });
      }, 60000);

      return () => clearInterval(intervalo);
    }
  }, [jogos]);

  const renderJogo = (jogo) => {
    const dataHoraInicio = moment
      .tz(jogo.dataHoraInicio, "America/Sao_Paulo")
      .format("DD/MM/YYYY HH:mm");

    const statusInfo = statuses[jogo.fixtureId] || {};
    const statusDoJogo = statusInfo.status || "Carregando...";
    const minutos = statusInfo.minutos || null;

    let statusComponent;
    if (statusDoJogo === "PST") {
      statusComponent = <Text style={styles.adiado}>Jogo adiado</Text>;
    } else if (statusDoJogo === "CANC") {
      statusComponent = <Text style={styles.adiado}>Jogo cancelado</Text>;
    } else if (statusDoJogo === "SUSP") {
      statusComponent = <Text style={styles.adiado}>Jogo suspenso</Text>;
    } else if (statusDoJogo === "ABD") {
      statusComponent = <Text style={styles.adiado}>Jogo abandonado</Text>;
    } else if (statusDoJogo === "AWD") {
      statusComponent = <Text style={styles.adiado}>Derrota técnica</Text>;
    } else if (statusDoJogo === "INT") {
      statusComponent = <Text style={styles.adiado}>Interrompido</Text>;
    } else if (statusDoJogo === "WO") {
      statusComponent = <Text style={styles.adiado}>W.O.</Text>;
    } else if (["LIVE", "1H", "2H"].includes(statusDoJogo)) {
      statusComponent = (
        <View style={styles.ContainResultado}>
          <Text style={styles.aoVivo}>
            {`${minutos ? `${minutos} '` : ""}`}
          </Text>
          <Text style={styles.resultadoAoVivo}>{`${jogo.resultado}`}</Text>
        </View>
      );
    } else if (statusDoJogo === "ET") {
      statusComponent = (
        <View style={styles.ContainResultado}>
          <Text style={styles.aoVivo}>
            {`Prorr ${minutos ? `${minutos} '` : ""}`}
          </Text>
          <Text style={styles.resultadoAoVivo}>{`${jogo.resultado}`}</Text>
        </View>
      );
    } else if (statusDoJogo === "AET" || statusDoJogo === "PEN") {
      statusComponent = (
        <View style={styles.ContainResultado}>
          <Text style={styles.aoVivo}>PEN</Text>
          <Text style={styles.resultadoAoVivo}>{`${jogo.resultado}`}</Text>
          {statusInfo.penaltyScore && (
            <Text
              style={styles.penaltyScore}
            >{`${statusInfo.penaltyScore.home} - ${statusInfo.penaltyScore.away}`}</Text>
          )}
        </View>
      );
    } else if (statusDoJogo === "BT" || statusDoJogo === "HT") {
      statusComponent = (
        <View style={styles.ContainResultado}>
          <Text style={{ color: "orange", fontSize: 8 }}>Intervalo</Text>
          <Text style={styles.resultadoAoVivo}>{`${jogo.resultado}`}</Text>
        </View>
      );
    } else if (statusDoJogo === "FT") {
      statusComponent = <Text style={styles.resultado}>{jogo.resultado}</Text>;
    } else {
      statusComponent = (
        <Text style={styles.horario}>{formatHorario(jogo.horario)}</Text>
      );
    }

    return (
      <TouchableOpacity
        key={jogo.fixtureId}
        style={styles.jogoContainer}
        onPress={() => {
          navigation.navigate("DetalhesDoJogo", { jogoId: jogo.fixtureId });
        }}
      >
        <Image source={{ uri: jogo.logoCasa }} style={styles.logo} />
        <View style={styles.teamContainerHome}>
          <Text style={styles.equipes}>{jogo.timeCasa}</Text>
        </View>
        {statusComponent}
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
    padding: "1.5%",
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
    fontSize: 15,
    color: "white",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#2f9fa6",
    paddingHorizontal: "3%",
    textAlign: "center",
    margin: "3%",
  },
  resultado: {
    fontSize: 16,
    color: "white",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#2f9fa6",
    paddingHorizontal: "3%",
    textAlign: "center",
    margin: "3%",
  },
  adiado: {
    fontSize: 10,
    color: "orange",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#2f9fa6",
    paddingHorizontal: "3%",
    textAlign: "center",
    margin: "3%",
  },
  aoVivo: {
    fontSize: 10,
    color: "red",
    marginRight: "2%",
  },
  ContainResultado: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#2f9fa6",
    paddingHorizontal: "2%",
    textAlign: "center",
    margin: "3%",
    flexDirection: "column",
    alignItems: "center",
  },
  resultadoAoVivo: { fontSize: 16, color: "white" },
  penaltyScore: { fontSize: 12, color: "yellow", marginTop: 2 },
});

export default JogosDoDiaComponent;
