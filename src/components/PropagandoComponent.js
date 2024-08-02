import React, { useState, useEffect } from "react";
import { View, Text, Modal, StyleSheet, Button } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const propagandaExemplo = [
  "Promoção imperdível: 50% OFF!",
  "Novos produtos disponíveis!",
  "Visite nossa loja para mais ofertas!",
  "Compre 1, leve 2!",
];

export default function EspaçoPropaganda() {
  const [visible, setVisible] = useState(true);
  const [currentAd, setCurrentAd] = useState(propagandaExemplo[0]);

  useEffect(() => {
    const adInterval = setInterval(() => {
      setCurrentAd((prevAd) => {
        const nextAdIndex =
          (propagandaExemplo.indexOf(prevAd) + 1) % propagandaExemplo.length;
        return propagandaExemplo[nextAdIndex];
      });
    }, 5000); // 5 segundos

    return () => clearInterval(adInterval);
  }, []);

  const handleClose = () => setVisible(false);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalBackground}>
        <AntDesign
          style={styles.adIcon}
          name="closecircleo"
          size={24}
          color="white"
          onPress={handleClose}
        />
        <View style={styles.modalContainer}>
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
    left: "40%",
  },
});
