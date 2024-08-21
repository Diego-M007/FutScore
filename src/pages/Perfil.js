// Perfil.js
import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  StatusBar,
  Button,
  ImageBackground,
} from "react-native";
import TxtComponent from "../components/TxtComponent";
import styles from "../styles/StylePerfil";
import Icon from "react-native-vector-icons/Entypo";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import Constants from "expo-constants";
import HeaderComponent2 from "../components/HeaderComponent2";
import Google from "../assets/Images/Video/";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

export default function Perfil({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  const googleClientId =
    "880894382932-3jovad1stn0bl0l21rj5pposmhur5q27.apps.googleusercontent.com";

  if (!googleClientId) {
    console.log(
      "Google Client ID: ",
      Constants.manifest?.extra?.googleClientId
    );
    console.error(
      "Google Client ID is missing. Please check your app.json configuration."
    );
    return null;
  }

  const redirectUri = "https://1euao1c-anonymous-8081.exp.direct";

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: googleClientId,
    redirectUri,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      const auth = getAuth();
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((result) => {
          console.log("Usuário logado: ", result.user);
          closeModal();
        })
        .catch((error) => {
          console.error("Erro durante o login com Google: ", error);
        });
    }
  }, [response]);

  const handlePress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.Container}>
      <HeaderComponent2 />

      <ImageBackground
        source={require("../assets/Images/imagemfundoperfil.png")}
        style={styles.imagemFundo}
        resizeMode="Cover"
      >
        <View style={styles.headerContainer}>
          <View style={styles.iconBackground}>
            <Icon name="user" size={60} style={styles.icon} />
          </View>

          <TxtComponent
            texto="Crie ou entre na sua conta para acompanhar times, ligas e jogadores favoritos"
            styleTxt={styles.headerText}
          />

          <View style={styles.divider} />

          <TouchableOpacity style={styles.buttonEntrar} onPress={handlePress}>
            <TxtComponent texto="Entrar" styleTxt={styles.buttonText} />
          </TouchableOpacity>
        </View>

        {/* Modal */}
        <Modal
          transparent={true}
          animationType="fade"
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Icon name="cross" size={20} />
              </TouchableOpacity>
              <TxtComponent
                texto="Entre no FutScore"
                styleTxt={styles.modalText}
              />
              <TxtComponent
                texto="Infinitas estatísticas"
                styleTxt={styles.modalTextsub}
              />

              {/* Botão de Login com Google */}
              <SafeAreaView
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <StatusBar barStyle={"light-content"} />
                <Button
                  title="Fazer login com Google"
                  disabled={!request}
                  onPress={() => {
                    promptAsync();
                  }}
                />
                <Image
                  source={require("../assets/Images/New-Google-Logo.jpg")}
                  style={styles.google}
                />
              </SafeAreaView>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </View>
  );
}
