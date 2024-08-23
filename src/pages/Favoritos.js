import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import TxtComponent from "../components/TxtComponent";
import { useNavigation } from "@react-navigation/native";
import HeaderComponent from "../components/HeaderComponent2";
import { FontAwesome } from "@expo/vector-icons";
import { stylesFavoritos } from "../styles/StyleFavoritos";
import { ImageBackground } from "react-native";
import { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/Entypo";
import * as Google from "expo-auth-session/providers/google";
import { Video, ResizeMode } from "expo-av";

export default function Favoritos() {
  const navigation = useNavigation();

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
    <View style={stylesFavoritos.Principal}>
      <HeaderComponent />
      <ImageBackground
        source={require("../assets/Images/ImagemFundoFav.png")}
        resizeMode="cover"
        style={stylesFavoritos.imagemFundo}
      >
        <View style={stylesFavoritos.Container}>
          <FontAwesome name={"star"} size={60} color={"white"} />
          <TxtComponent
            texto={
              "Para acessar seus Favoritos, clique no botão abaixo e faça login."
            }
            styleTxt={stylesFavoritos.Textos}
          />
          <TouchableOpacity
            onPress={handlePress}
            style={stylesFavoritos.Button}
          >
            <FontAwesome name={"user"} size={30} color={"white"} />
            <TxtComponent
              styleTxt={stylesFavoritos.TxtButton}
              texto={"Faça Login"}
            />
          </TouchableOpacity>
          <TxtComponent
            texto={
              "Assim você pode acompanhar seus Jogadores, Times e Competições preferidas, não perca tempo e faça seu Login ou Cadastro."
            }
            styleTxt={stylesFavoritos.Textos}
          />
        </View>
        <Modal
          transparent={true}
          animationType="fade"
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={stylesFavoritos.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={stylesFavoritos.modalContent}>
                  <TouchableOpacity
                    style={stylesFavoritos.closeButton}
                    onPress={closeModal}
                  >
                    <Icon name="cross" size={20} />
                  </TouchableOpacity>
                  <TxtComponent
                    texto="Entre no FutScore"
                    styleTxt={stylesFavoritos.modalText}
                  />
                  <TxtComponent
                    texto="Acompanhe infinitas estatísticas, resultados ao vivo e em tempo real, classificações atualizadas e muito mais somente com FUTSCORE."
                    styleTxt={stylesFavoritos.modalTextsub}
                  />

                  <Video
                    style={stylesFavoritos.video}
                    resizeMode={ResizeMode.CONTAIN}
                    source={require("../assets/Images/Video/videopropaganda.mp4")}
                    shouldPlay
                    isLooping={true}
                    isMuted={true}
                    onError={(error) =>
                      console.error("Erro ao carregar o vídeo:", error)
                    }
                  />
                  <SafeAreaView
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <StatusBar barStyle={"light-content"} />
                    <TouchableOpacity
                      disabled={!request}
                      onPress={() => {
                        promptAsync();
                      }}
                      style={stylesFavoritos.ButtonGoogle}
                    >
                      <Image
                        source={require("../assets/Images/IconGoogle.png")}
                        style={stylesFavoritos.LogoGoogle}
                      />
                      <TxtComponent
                        texto={"Fazer login com Google"}
                        styleTxt={stylesFavoritos.txtLogin}
                      />
                    </TouchableOpacity>
                    <View style={stylesFavoritos.ViewFecharModal}>
                      <TouchableOpacity
                        style={stylesFavoritos.FecharModal}
                        onPress={closeModal}
                      >
                        <TxtComponent
                          texto={"Voltar"}
                          styleTxt={stylesFavoritos.FecharModalTxt}
                        />
                      </TouchableOpacity>
                    </View>
                  </SafeAreaView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ImageBackground>
    </View>
  );
}
