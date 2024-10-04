import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const propagandaExemplo = [
  {
    id: 1,
    url: "https://i.ibb.co/gMr71yN/cardad.png",
  },
  {
    id: 2,
    url: "https://i.ibb.co/gMr71yN/cardad.png",
  },
];

export default function EspacoPropaganda() {
  const [visible, setVisible] = useState(true);
  const [currentAd, setCurrentAd] = useState(propagandaExemplo[0]);
  const [countdown, setCountdown] = useState(1); // Estado para o contador de 5 segundos
  const [canClose, setCanClose] = useState(false); // Controle de permissão para fechar

  useEffect(() => {
    // Intervalo para trocar o anúncio a cada 5 segundos
    const adInterval = setInterval(() => {
      setCurrentAd((prevAd) => {
        const nextAdIndex =
          (propagandaExemplo.indexOf(prevAd) + 1) % propagandaExemplo.length;
        return propagandaExemplo[nextAdIndex];
      });
    }, 5000);

    return () => {
      clearInterval(adInterval);
    };
  }, []);

  useEffect(() => {
    // Contagem regressiva de 5 segundos
    if (countdown > 0) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdownInterval);
    } else {
      setCanClose(true); // Permitir fechar o anúncio quando o contador chegar a 0
    }
  }, [countdown]);

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
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <Image
              source={{ uri: currentAd.url }}
              style={styles.adImage}
              resizeMode="contain" // Para garantir que a imagem caiba dentro do espaço
            />
          </TouchableWithoutFeedback>
          {/* Contador e botão de fechar */}
          <View style={styles.header}>
            {canClose ? (
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Icon name="times" size={24} color="white" />
              </TouchableOpacity>
            ) : (
              <Text style={styles.countdownText}>Fechar em {countdown}s</Text>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Fundo transparente escurecido
  },
  adImage: {
    width: 700, // Largura específica para a imagem
    height: 400, // Altura específica para a imagem
  },
  header: {
    position: "absolute",
    top: 150,
    right: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  countdownText: {
    fontSize: 16,
    color: "white",
    marginBottom: 10,
  },
  closeButton: {
    top: 30,
  },
});
