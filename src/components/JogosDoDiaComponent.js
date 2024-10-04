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

// Função para pegar o status do jogo
const getStatusDoJogo = (status) => {
  const statusMap = {
    P: "Pênaltis",
    PEN: "Pênaltis",
  };

  return statusMap[status] || "Indefinido";
};

const JogosDoDiaComponent = ({ jogos, statuses }) => {
  const navigation = useNavigation();

  const renderJogo = (jogo) => {
    const dataHoraInicio = moment
      .tz(jogo.dataHoraInicio, "America/Sao_Paulo")
      .format("DD/MM/YYYY HH:mm");

    // Pega o status e minutos do jogo pelo fixtureId
    const statusInfo = statuses[jogo.fixtureId] || {};
    const statusDoJogo = statusInfo.status || "Carregando...";
    const minutos = statusInfo.minutos || null;

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

        {/* Se o jogo estiver adiado, exibe 'Jogo adiado', senão exibe o horário ou resultado */}
        {statusDoJogo === "PST" ? (
          <Text style={styles.adiado}>Jogo adiado</Text>
        ) : statusDoJogo === "CANC" ? (
          <Text style={styles.adiado}>Jogo cancelado</Text>
        ) : statusDoJogo === "SUSP" ? (
          <Text style={styles.adiado}>Jogo suspenso</Text>
        ) : statusDoJogo === "ABD" ? (
          <Text style={styles.adiado}>Jogo abandonado</Text>
        ) : statusDoJogo === "AWD" ? (
          <Text style={styles.adiado}>Derrota técnica</Text>
        ) : statusDoJogo === "INT" ? (
          <Text style={styles.adiado}>Interrompido</Text>
        ) : statusDoJogo === "WO" ? (
          <Text style={styles.adiado}>W.O.</Text>
        ) : statusDoJogo === "LIVE" ||
          statusDoJogo === "1H" ||
          statusDoJogo === "2H" ||
          statusDoJogo === "PEN" ? (
          <>
            <View style={styles.ContainResultado}>
              <Text style={styles.aoVivo}>
                {`${minutos ? `${minutos} '` : ""}`}
              </Text>
              <Text style={styles.resultadoAoVivo}>{`${jogo.resultado}`}</Text>
            </View>
          </>
        ) : statusDoJogo === "ET" ? (
          <>
            <View style={styles.ContainResultado}>
              <Text style={styles.aoVivo}>
                {`"Prg" ${minutos ? `${minutos} '` : ""}`}
              </Text>
              <Text style={styles.resultadoAoVivo}>{`${jogo.resultado}`}</Text>
            </View>
          </>
        ) : statusDoJogo === "AET" ? (
          <>
            <View style={styles.ContainResultado}>
              <Text style={styles.aoVivo}>{`"PEN"`}</Text>
              <Text style={styles.resultadoAoVivo}>{`${jogo.resultado}`}</Text>
            </View>
          </>
        ) : statusDoJogo === "BT" || statusDoJogo === "HT" ? (
          <>
            <View style={styles.ContainResultado}>
              <Text style={{ color: "orange", fontSize: 8 }}>Intervalo</Text>
              <Text style={styles.resultadoAoVivo}>{`${jogo.resultado}`}</Text>
            </View>
          </>
        ) : statusDoJogo === "FT" ? (
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
    paddingHorizontal: 10,
    textAlign: "center",
    margin: "3%",
  },
  resultado: {
    fontSize: 16,
    color: "white",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#2f9fa6",
    paddingHorizontal: 10,
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
    color: "#2f9fa6",
  },
  ContainResultado: {
    color: "#f00",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#2f9fa6",
    paddingHorizontal: "3%",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    margin: "3%",
  },
  resultadoAoVivo: {
    fontSize: 16,
    color: "white",
    paddingHorizontal: "1%",
  },
});

export default JogosDoDiaComponent;
