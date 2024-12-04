import React from "react";
// Importa o React para usar componentes

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
// Importa componentes do React Native para construir a interface

import TxtComponent from "../components/TxtComponent";
// Componente de texto customizado

import { useNavigation } from "@react-navigation/native";
// Hook para navegar entre telas

import HeaderComponent from "../components/HeaderComponent2";
// Cabeçalho reutilizável

import { FontAwesome } from "@expo/vector-icons";
// Ícones da biblioteca FontAwesome

import { stylesFavoritos } from "../styles/StyleFavoritos";
// Importa os estilos específicos da tela de favoritos

import { ImageBackground } from "react-native";
// Componente para exibir imagens de fundo

import { useState, useEffect } from "react";
// Hooks para gerenciar estados e efeitos

import Icon from "react-native-vector-icons/Entypo";
// Ícones da biblioteca Entypo

import * as Google from "expo-auth-session/providers/google";
// Provedor de autenticação do Google

import { Video, ResizeMode } from "expo-av";
// Componente para exibir vídeos

export default function Favoritos() {
  // Função principal que renderiza a tela de Favoritos
  const navigation = useNavigation();
  // Inicializa a navegação

  const [modalVisible, setModalVisible] = useState(false);
  // Estado para controlar se o modal está visível

  const googleClientId =
    "880894382932-3jovad1stn0bl0l21rj5pposmhur5q27.apps.googleusercontent.com";
  // ID do cliente do Google para autenticação

  if (!googleClientId) {
    // Verifica se o ID do cliente está configurado
    console.log(
      "Google Client ID: ",
      Constants.manifest?.extra?.googleClientId
    );
    console.error(
      "Google Client ID is missing. Please check your app.json configuration."
    );
    return null;
    // Se não estiver configurado, exibe erro e interrompe a execução
  }

  const redirectUri = "https://1euao1c-anonymous-8081.exp.direct";
  // URL para redirecionamento após o login

  const [request, response, promptAsync] = Google.useAuthRequest({
    // Configura a requisição de login com o Google
    clientId: googleClientId,
    redirectUri,
  });

  useEffect(() => {
    // Efeito executado quando a resposta de login muda
    if (response?.type === "success") {
      // Verifica se o login foi bem-sucedido
      const { id_token } = response.params;
      // Pega o token de login

      const auth = getAuth();
      const credential = GoogleAuthProvider.credential(id_token);
      // Cria as credenciais para autenticação com o Firebase

      signInWithCredential(auth, credential)
        .then((result) => {
          // Caso o login funcione, exibe o usuário no console
          console.log("Usuário logado: ", result.user);
          closeModal();
          // Fecha o modal
        })
        .catch((error) => {
          // Caso ocorra erro no login, exibe o erro
          console.error("Erro durante o login com Google: ", error);
        });
    }
  }, [response]);
  // Executa sempre que a resposta muda

  const handlePress = () => {
    // Função para abrir o modal
    setModalVisible(true);
  };

  const closeModal = () => {
    // Função para fechar o modal
    setModalVisible(false);
  };

  return (
    <View style={stylesFavoritos.Principal}>
      {/* Container principal da tela */}
      <HeaderComponent />
      {/* Exibe o cabeçalho */}
      <ImageBackground
        source={require("../assets/Images/ImagemFundoFav.png")}
        // Imagem de fundo da tela
        resizeMode="cover"
        style={stylesFavoritos.imagemFundo}
      >
        <View style={stylesFavoritos.Container}>
          {/* Conteúdo principal da tela */}
          <FontAwesome name={"star"} size={60} color={"white"} />
          {/* Ícone de estrela */}
          <TxtComponent
            texto={
              "Para acessar seus Favoritos, clique no botão abaixo e faça login."
            }
            // Texto explicativo
            styleTxt={stylesFavoritos.Textos}
          />
          <TouchableOpacity
            onPress={handlePress}
            // Botão para abrir o modal
            style={stylesFavoritos.Button}
          >
            <FontAwesome name={"user"} size={30} color={"white"} />
            {/* Ícone de usuário */}
            <TxtComponent
              styleTxt={stylesFavoritos.TxtButton}
              texto={"Faça Login"}
              // Texto do botão
            />
          </TouchableOpacity>
          <TxtComponent
            texto={
              "Assim você pode acompanhar seus Jogadores, Times e Competições preferidas, não perca tempo e faça seu Login ou Cadastro."
            }
            // Texto incentivando o login
            styleTxt={stylesFavoritos.Textos}
          />
        </View>
        <Modal
          transparent={true}
          animationType="fade"
          visible={modalVisible}
          // Modal que aparece ao clicar em "Faça Login"
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            {/* Fecha o modal ao clicar fora */}
            <View style={stylesFavoritos.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={stylesFavoritos.modalContent}>
                  <TouchableOpacity
                    style={stylesFavoritos.closeButton}
                    onPress={closeModal}
                    // Botão para fechar o modal
                  >
                    <Icon name="cross" size={20} />
                    {/* Ícone de fechar */}
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
                    // Vídeo promocional
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
                        // Chama o login com Google
                      }}
                      style={stylesFavoritos.ButtonGoogle}
                    >
                      <Image
                        source={require("../assets/Images/IconGoogle.png")}
                        // Ícone do Google
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
                        // Botão para voltar
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
