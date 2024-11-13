import React, { useState } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

export default function SpinRoleta() {
  const [resultado, setResultado] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const jogadores = [
    ...Array(52).fill("Ouro"),
    ...Array(154).fill("Prata"),
    ...Array(154).fill("Bronze"),
  ];

  const iniciarSpin = () => {
    setIsSpinning(true);
    setResultado(null);

    // Simulando tempo de giro
    setTimeout(() => {
      const sorteado = jogadores[Math.floor(Math.random() * jogadores.length)];
      setResultado(sorteado);
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      {isSpinning ? (
        <AnimatedCircularProgress
          size={200}
          width={3}
          fill={100}
          tintColor="#00e0ff"
          backgroundColor="#3d5875"
          duration={3000}
          rotation={360}
        />
      ) : (
        <Button title="Girar Roleta" onPress={iniciarSpin} color="#FFD700" />
      )}
      {resultado && (
        <Text style={styles.resultado}>Resultado: {resultado}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#000",
  },
  resultado: {
    marginTop: 20,
    fontSize: 24,
    color: "#FFF",
    fontWeight: "bold",
  },
});
