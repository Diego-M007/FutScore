import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView, Modal } from "react-native";
import TxtComponent from "../components/TxtComponent";
import styles from "../styles/StylePerfil";
import Icon from "react-native-vector-icons/Entypo";

export default function Perfil() {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.iconTextContainer}>
          <View style={styles.rowContainer}>
            <View style={styles.iconBackground}>
              <Icon name="user" size={30} style={styles.icon} />
            </View>
            <TxtComponent
              texto="Entre na sua conta para acompanhar times, ligas e jogadores favoritos"
              styleTxt={styles.headerText}
            />
          </View>
          <View style={styles.divider} />
        </View>
        <TouchableOpacity style={styles.buttonEntrar} onPress={handlePress}>
          <TxtComponent texto="Entrar" styleTxt={styles.buttonText} />
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <TxtComponent texto="Você tem conta?" styleTxt={styles.text} />
      </View>

      {/* Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Icon name="cross" size={20} />
            </TouchableOpacity>
            <TxtComponent
              texto="Escolha uma opção:"
              styleTxt={styles.modalText}
            />
            <TouchableOpacity style={styles.button} onPress={closeModal}>
              <TxtComponent
                texto="Login com gogle"
                styleTxt={styles.buttonText}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
