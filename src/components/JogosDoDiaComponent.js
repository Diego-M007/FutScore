import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment-timezone";

const formatHorario = (horario) => {
  const [horas, minutos] = horario.split(":");
  return `${horas}:${minutos}`;
};

const JogosDoDiaComponent = ({ jogos }) => {
  const navigation = useNavigation();
  const [aoVivo, setAoVivo] = useState([]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      atualizarResultadosAoVivo();
    }, 30000); // Atualiza a cada 30 segundos

    return () => clearInterval(intervalo);
  }, [jogos]);

  const atualizarResultadosAoVivo = () => {
    const agora = moment();
    const aoVivoJogos = jogos.filter((jogo) => {
      const dataHoraInicio = moment.tz(
        jogo.dataHoraInicio,
        "America/Sao_Paulo"
      );
      const dataHoraFim = moment.tz(jogo.dataHoraFim, "America/Sao_Paulo");
      return (
        agora.isBetween(dataHoraInicio, dataHoraFim) && jogo.resultado === null
      );
    });

    setAoVivo(aoVivoJogos);
  };

  const renderJogo = (jogo) => {
    const dataHoraInicio = moment
      .tz(jogo.dataHoraInicio, "America/Sao_Paulo")
      .format("DD/MM/YYYY HH:mm");
    const aoVivoStyle = aoVivo.some((j) => j.fixtureId === jogo.fixtureId)
      ? styles.aoVivo
      : {};

    return (
      <TouchableOpacity
        key={jogo.fixtureId}
        style={[styles.jogoContainer, aoVivoStyle]}
        onPress={() => {
          console.log("Fixture ID:", jogo.fixtureId);
          navigation.navigate("DetalhesDoJogo", { jogoId: jogo.fixtureId });
        }}
      >
        <Image source={{ uri: jogo.logoCasa }} style={styles.logo} />
        <View style={styles.teamContainerHome}>
          <Text style={styles.equipes}>{jogo.timeCasa}</Text>
        </View>
        {jogo.resultado ? (
          <Text style={styles.resultado}>{jogo.resultado}</Text>
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
  aoVivo: {
    borderColor: "#f00",
    borderWidth: 2,
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
});

export default JogosDoDiaComponent;
