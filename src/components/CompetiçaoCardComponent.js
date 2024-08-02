// src/components/CompeticaoCardComponent.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import JogosDoDiaComponent from "./JogosDoDiaComponent"; // Certifique-se de ajustar o caminho conforme necessário

export default function CompeticaoCardComponent({
  imagem,
  nome,
  quantidadeJogos,
  jogos,
}) {
  const [expanded, setExpanded] = useState(false);
  const [heightAnim] = useState(new Animated.Value(50)); // Altura inicial do card

  const toggleExpand = () => {
    setExpanded(!expanded);

    Animated.timing(heightAnim, {
      toValue: expanded ? 60 : 60 + jogos.length * 1, // Ajuste a altura conforme necessário
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity onPress={toggleExpand}>
        <Animated.View style={[styles.card, { height: heightAnim }]}>
          <Image source={{ uri: imagem }} style={styles.imagem} />
          <View style={styles.info}>
            <Text style={styles.nome}>{nome}</Text>
            <Text
              style={styles.quantidadeJogos}
            >{`${quantidadeJogos} jogos`}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
      {expanded && jogos && <JogosDoDiaComponent jogos={jogos} />}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
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
  },
  imagem: {
    width: 35,
    height: 35,
    marginRight: 10,
    borderRadius: 5,
    resizeMode: "contain",
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  quantidadeJogos: {
    fontSize: 14,
    color: "white",
  },
});
