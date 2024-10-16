import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import HeaderComponent2 from "../components/HeaderComponent2";
import TxtComponent from "../components/TxtComponent";
import Icon from "react-native-vector-icons/Entypo";

export default function Album({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  const openPackModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent2 />

      <View style={styles.headerContainer}>
        <TxtComponent
          texto="Álbum de Colecionadores"
          styleTxt={styles.headerText}
        />

        <View style={styles.divider} />

        <View style={styles.sectionContainer}>
          <TouchableOpacity style={styles.sectionBox} onPress={() => {}}>
            <Icon name="star" size={30} style={styles.icon} />
            <TxtComponent
              texto="Minhas Cartas"
              styleTxt={styles.sectionTitle}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.sectionBox} onPress={() => {}}>
            <Icon name="grid" size={30} style={styles.icon} />
            <TxtComponent
              texto="Ver Todas as Cartas"
              styleTxt={styles.sectionTitle}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.sectionBox} onPress={() => {}}>
            <Icon name="shop" size={30} style={styles.icon} />
            <TxtComponent
              texto="Loja de Packs"
              styleTxt={styles.sectionTitle}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.sectionBox} onPress={() => {}}>
            <Icon name="box" size={30} style={styles.icon} />
            <TxtComponent texto="Meus Packs" styleTxt={styles.sectionTitle} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal para Packs */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Icon name="cross" size={20} />
                </TouchableOpacity>
                <TxtComponent
                  texto="Abrir Pack de Cartas"
                  styleTxt={styles.modalText}
                />
                <TxtComponent
                  texto="Ganhe novas cartas para colar no seu álbum!"
                  styleTxt={styles.modalTextsub}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    alignItems: "center",
    padding: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  divider: {
    width: "80%",
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  sectionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
  },
  sectionBox: {
    width: "40%",
    height: 100,
    backgroundColor: "#ddd",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    padding: 10,
  },
  icon: {
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 100,
  },
  modalTextsub: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
