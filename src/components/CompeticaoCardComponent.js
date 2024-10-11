import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import JogosDoDiaComponent from "./JogosDoDiaComponent";

export default function CompeticaoCardComponent({
  imagem,
  nome,
  quantidadeJogos,
  jogos,
  finalizados,
  isUEFA,
}) {
  const [expanded, setExpanded] = useState(false);
  const [heightAnim] = useState(new Animated.Value(60));
  const [statuses, setStatuses] = useState({}); // Estado dos statuses agora centralizado

  const toggleExpand = () => {
    setExpanded(!expanded);

    Animated.timing(heightAnim, {
      toValue: expanded ? 60 : 70 + jogos.length * 1, // Aumentando o cálculo da altura
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

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

      {expanded && <JogosDoDiaComponent jogos={jogos} statuses={statuses} />}
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
