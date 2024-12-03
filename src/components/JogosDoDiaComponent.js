import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment-timezone";
import axios from "axios";
import { API_FOOTBALL_KEY } from "@env";

// Função para formatar o horário no formato HH:mm
const formatHorario = (horario) => {
  const [horas, minutos] = horario.split(":");
  return `${horas}:${minutos}`;
};

// Função para buscar status de um jogo específico
const pegarStatusDoJogo = async (fixtureId) => {
  try {
    // Requisição para API de futebol
    const response = await axios.get(
      `https://v3.football.api-sports.io/fixtures`,
      {
        params: { id: fixtureId, timezone: "America/Sao_Paulo" },
        headers: {
          "x-rapidapi-key": API_FOOTBALL_KEY, // Chave da API
          "x-rapidapi-host": "v3.football.api-sports.io",
        },
      }
    );

    // Extrai os dados de status do jogo
    const jogo = response.data.response[0];
    const status = {
      status: jogo.fixture.status.short, // Status curto do jogo
      minutos: jogo.fixture.status.elapsed, // Minutos do jogo
      penaltyScore: jogo.score.penalty ? jogo.score.penalty : null, // Placar de pênaltis, se houver
    };

    return { [fixtureId]: status };
  } catch (error) {
    console.error("Erro ao buscar status do jogo:", error);
    // Retorna erro se falhar
    return {
      [fixtureId]: { status: "Erro", minutos: null, penaltyScore: null },
    };
  }
};

// Componente para exibir os jogos do dia
const JogosDoDiaComponent = ({ jogos }) => {
  const [statuses, setStatuses] = useState({}); // Estado para armazenar os status dos jogos
  const navigation = useNavigation(); // Hook de navegação

  // useEffect para buscar status ao carregar o componente e atualizar a cada 60 segundos
  useEffect(() => {
    if (jogos && jogos.length > 0) {
      // Busca o status de todos os jogos
      jogos.forEach(async (jogo) => {
        const statusMap = await pegarStatusDoJogo(jogo.fixtureId);
        setStatuses((prevStatuses) => ({
          ...prevStatuses,
          ...statusMap,
        }));
      });

      // Atualiza o status a cada 60 segundos
      const intervalo = setInterval(() => {
        jogos.forEach(async (jogo) => {
          const statusMap = await pegarStatusDoJogo(jogo.fixtureId);
          setStatuses((prevStatuses) => ({
            ...prevStatuses,
            ...statusMap,
          }));
        });
      }, 60000);

      // Limpa o intervalo quando o componente for desmontado
      return () => clearInterval(intervalo);
    }
  }, [jogos]);

  // Função que retorna o JSX para exibir cada jogo
  const renderJogo = (jogo) => {
    // Formata a data e hora do jogo
    const dataHoraInicio = moment
      .tz(jogo.dataHoraInicio, "America/Sao_Paulo")
      .format("DD/MM/YYYY HH:mm");

    // Obtém o status do jogo do estado
    const statusInfo = statuses[jogo.fixtureId] || {};
    const statusDoJogo = statusInfo.status || "Carregando...";
    const minutos = statusInfo.minutos || null;

    let statusComponent;
    // Define o componente a ser exibido com base no status
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
      // Exibe o minuto e o resultado ao vivo
      statusComponent = (
        <View style={styles.ContainResultado}>
          <Text style={styles.aoVivo}>{`${minutos ? `${minutos}'` : ""}`}</Text>
          <Text style={styles.resultadoAoVivo}>{`${jogo.resultado}`}</Text>
        </View>
      );
    } else if (statusDoJogo === "ET") {
      // Exibe o minuto e o resultado no tempo extra
      statusComponent = (
        <View style={styles.ContainResultado}>
          <Text style={styles.aoVivo}>
            {`Prorr ${minutos ? `${minutos} '` : ""}`}
          </Text>
          <Text style={styles.resultadoAoVivo}>{`${jogo.resultado}`}</Text>
        </View>
      );
    } else if (statusDoJogo === "AET" || statusDoJogo === "PEN") {
      // Exibe os pênaltis se o jogo estiver em prorrogação ou pênaltis
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
      // Exibe "Intervalo" se o jogo estiver no intervalo
      statusComponent = (
        <View style={styles.ContainResultado}>
          <Text style={{ color: "orange", fontSize: 8 }}>Intervalo</Text>
          <Text style={styles.resultadoAoVivo}>{`${jogo.resultado}`}</Text>
        </View>
      );
    } else if (statusDoJogo === "FT") {
      // Exibe o resultado final
      statusComponent = <Text style={styles.resultado}>{jogo.resultado}</Text>;
    } else {
      // Exibe o horário se o jogo ainda não começou
      statusComponent = (
        <Text style={styles.horario}>{formatHorario(jogo.horario)}</Text>
      );
    }

    return (
      <TouchableOpacity
        key={jogo.fixtureId}
        style={styles.jogoContainer}
        onPress={() => {
          // Navega para a tela de detalhes do jogo
          navigation.navigate("DetalhesDoJogo", { jogoId: jogo.fixtureId });
        }}
      >
        {/* Exibe os logos dos times */}
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

  // Retorna o JSX para todos os jogos
  return <View style={styles.container}>{jogos.map(renderJogo)}</View>;
};

// Estilos do componente
const styles = StyleSheet.create({
  container: { width: "100%" },
  jogoContainer: {
    borderWidth: 1,
    borderColor: "#2f9fa6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  logo: { width: 35, height: 35, borderRadius: 10, resizeMode: "contain" },

  equipes: { fontSize: 13, color: "white" },

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
    color: "orange",
    fontWeight: "bold",
    textAlign: "center",
  },
  resultadoAoVivo: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  penaltyScore: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  ContainResultado: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});

export default JogosDoDiaComponent;
