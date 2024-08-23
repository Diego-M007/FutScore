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

export default function TorneioCardComponent({ imagem, nome }) {
  const [expanded, setExpanded] = useState(false);
  const [heightAnim] = useState(new Animated.Value(60));

  const toggleExpand = () => {
    setExpanded(!expanded);

    Animated.timing(heightAnim, {
      toValue: expanded ? 60 : 100, // Ajusta o valor de expansão
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpand}>
        <Animated.View style={[styles.card, { height: heightAnim }]}>
          <View style={styles.paisContainer}>
            <View style={styles.paisHeader}>
              <Image source={{ uri: imagem }} style={styles.imagem} />
              <Text style={styles.paisTitulo}>{nome}</Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    width: "100%",
  },
  paisContainer: {
    marginBottom: 10,
    width: "100%",
    borderWidth: 0.5,
    borderColor: "#2f9fa6",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#2C2C2E",
  },
  paisHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  paisTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#fff",
  },
  imagem: {
    width: 40, // Ajuste de largura para manter a proporção
    height: 40, // Ajuste de altura para manter a proporção
    resizeMode: "contain",
    borderRadius: 20,
  },
});
