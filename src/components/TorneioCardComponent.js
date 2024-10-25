import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function TorneioCardComponent({ imagem, nome, ligaId }) {
  const navigation = useNavigation();

  const handlePress = () => {
    // Verifica se o ID da liga foi passado antes de navegar
    if (ligaId) {
      navigation.navigate("PaginaLiga", { ligaId });
    } else {
      console.error("Liga ID não foi passado corretamente.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.card}>
          <Image source={{ uri: imagem }} style={styles.imagem} />
          <Text style={styles.nome}>{nome}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: "#2f9fa6",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#2C2C2E",
  },
  imagem: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  nome: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
