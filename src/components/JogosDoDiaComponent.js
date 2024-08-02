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
        <View key={index} style={styles.shadowContainer}>
          <View style={styles.jogoContainer}>
            <Image source={{ uri: jogo.logoCasa }} style={styles.logo} />
            <View style={styles.teamContainerHome}>
              <Text style={styles.equipes}>{`${jogo.timeCasa}`}</Text>
            </View>
            <Text style={styles.horario}>{formatHorario(jogo.horario)}</Text>
            <View style={styles.teamContainerAway}>
              <Text style={styles.equipes}>{`${jogo.timeVisitante}`}</Text>
            </View>
            <Image source={{ uri: jogo.logoVisitante }} style={styles.logo} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  shadowContainer: {
    shadowColor: "#E5E5E7",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginVertical: 10,
    backgroundColor: "transparent",
    borderRadius: 10,
  },
  jogoContainer: {
    borderWidth: 1,
    borderColor: "#2f9fa6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10,
    backgroundColor: "#2C2C2E",
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
    width: 30,
    height: 30,
  },
  equipes: {
    fontSize: 15,
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
    marginHorizontal: 10,
  },
});
