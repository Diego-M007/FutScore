// src/components/JogosDoDiaComponent.js
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const formatHorario = (horario) => {
  const [horas, minutos] = horario.split(":");
  return `${horas}:${minutos}`;
};

export default function JogosDoDiaComponent({ jogos }) {
  return (
    <View style={styles.container}>
      {jogos.map((jogo, index) => (
        <View key={index} style={styles.jogoContainer}>
          <Image source={{ uri: jogo.logoCasa }} style={styles.logo} />
          <View style={styles.teamContainerHome}>
            <Text style={styles.equipes}>{`${jogo.timeCasa}`}</Text>
          </View>
          {jogo.resultado ? (
            <Text style={styles.resultado}>{jogo.resultado}</Text>
          ) : (
            <Text style={styles.horario}>{formatHorario(jogo.horario)}</Text>
          )}
          <View style={styles.teamContainerAway}>
            <Text style={styles.equipes}>{`${jogo.timeVisitante}`}</Text>
          </View>
          <Image source={{ uri: jogo.logoVisitante }} style={styles.logo} />
        </View>
      ))}
    </View>
  );
}

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
});
