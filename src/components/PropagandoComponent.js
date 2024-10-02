import React, { useState, useEffect } from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const propagandaExemplo = [
  "Promoção imperdível: 50% OFF!",
  "Novos produtos disponíveis!",
  "Visite nossa loja para mais ofertas!",
  "Compre 1, leve 2!",
];

export default function EspaçoPropaganda() {
  const [visible, setVisible] = useState(true);
  const [canClose, setCanClose] = useState(false); // Estado para controlar se pode fechar
  const [timeLeft, setTimeLeft] = useState(1); // Tempo restante para fechar
  const [currentAd, setCurrentAd] = useState(propagandaExemplo[0]);

  useEffect(() => {
    // Muda o anúncio a cada 5 segundos
    const adInterval = setInterval(() => {
      setCurrentAd((prevAd) => {
        const nextAdIndex =
          (propagandaExemplo.indexOf(prevAd) + 1) % propagandaExemplo.length;
        return propagandaExemplo[nextAdIndex];
      });
    }, 5000);

    // Inicia o contador para fechar o anúncio
    const countdown = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 1) {
          return prevTime - 1;
        } else {
          setCanClose(true); // Habilita o botão de fechar
          clearInterval(countdown); // Para o contador quando chegar a 0
          return 0;
        }
      });
    }, 1000); // Decrementa a cada 1 segundo

    // Limpa os intervalos quando o componente for desmontado
    return () => {
      clearInterval(adInterval);
      clearInterval(countdown);
    };
  }, []);

  const handleClose = () => {
    if (canClose) {
      setVisible(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalBackground}>
        {/* Temporizador acima do modal */}
        <Text style={styles.countdownText}>
          {canClose ? "" : `Fechar em ${timeLeft} segundos`}
        </Text>

        <View style={styles.modalContainer}>
          {/* Ícone de fechar na parte superior */}
          <AntDesign
            style={styles.adIcon}
            name="closecircleo"
            size={24}
            color="white"
            onPress={handleClose}
            disabled={!canClose}
          />
          <Text style={styles.adText}>{currentAd}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  adText: {
    fontSize: 16,
    marginBottom: 10,
  },
  adIcon: {
    position: "absolute",
    top: -40, // Posiciona o botão acima do modal
    right: -10,
  },
  countdownText: {
    position: "absolute",
    top: 350, // Posição acima do modal
    fontSize: 14,
    color: "white",
    textAlign: "center",
  },
});
