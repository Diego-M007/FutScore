import React, { useState, useEffect } from "react"; // Importa React e os hooks para estado e efeitos
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  TouchableWithoutFeedback,
} from "react-native"; // Componentes para interface e interação no React Native
import TxtComponent from "../components/TxtComponent"; // Componente personalizado para texto
import styles from "../styles/StylePerfil"; // Importa os estilos definidos para o perfil
import Icon from "react-native-vector-icons/Entypo"; // Biblioteca para ícones vetoriais
import { makeRedirectUri, useAuthRequest } from "expo-auth-session"; // Funções para gerenciar autenticação com o Expo
import * as Google from "expo-auth-session/providers/google"; // Configuração de provedor Google para autenticação
import Constants from "expo-constants"; // Utilitários do Expo para acessar configurações do app
import HeaderComponent2 from "../components/HeaderComponent2"; // Componente de cabeçalho personalizado
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth"; // Métodos de autenticação do Firebase
import { Video, ResizeMode } from "expo-av"; // Componente de vídeo do Expo

// Função principal do componente de perfil
export default function Perfil({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false); // Controla a visibilidade do modal

  // ID do cliente para autenticação Google
  const googleClientId =
    "880894382932-3jovad1stn0bl0l21rj5pposmhur5q27.apps.googleusercontent.com";

  // Verifica se o ID do cliente Google está configurado corretamente
  if (!googleClientId) {
    console.log(
      "Google Client ID: ",
      Constants.manifest?.extra?.googleClientId
    ); // Log do ID configurado
    console.error(
      "Google Client ID is missing. Please check your app.json configuration."
    ); // Erro caso esteja ausente
    return null; // Interrompe o componente se o ID for inválido
  }

  // URI de redirecionamento usada na autenticação
  const redirectUri = "https://1euao1c-anonymous-8081.exp.direct";

  // Configuração de solicitação de autenticação Google
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: googleClientId,
    redirectUri,
  });

  // Hook para monitorar a resposta da autenticação
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params; // Obtém o token de ID da resposta

      const auth = getAuth(); // Instância de autenticação do Firebase
      const credential = GoogleAuthProvider.credential(id_token); // Cria uma credencial para autenticação
      signInWithCredential(auth, credential) // Realiza o login com a credencial
        .then((result) => {
          console.log("Usuário logado: ", result.user); // Log do usuário autenticado
          closeModal(); // Fecha o modal após login bem-sucedido
        })
        .catch((error) => {
          console.error("Erro durante o login com Google: ", error); // Log de erros de autenticação
        });
    }
  }, [response]); // Dependência para monitorar mudanças na resposta

  // Função para abrir o modal
  const handlePress = () => {
    setModalVisible(true);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.Container}>
      {/* Componente de cabeçalho */}
      <HeaderComponent2 />

      {/* Fundo com imagem personalizada */}
      <ImageBackground
        source={require("../assets/Images/imagemfundoperfil.png")}
        style={styles.imagemFundo}
        resizeMode="Cover"
      >
        <View style={styles.headerContainer}>
          {/* Ícone do perfil */}
          <View style={styles.iconBackground}>
            <Icon name="user" size={60} style={styles.icon} />
          </View>

          {/* Texto de descrição */}
          <TxtComponent
            texto="Crie ou entre na sua conta para acompanhar times, ligas e jogadores favoritos"
            styleTxt={styles.headerText}
          />

          {/* Linha divisória */}
          <View style={styles.divider} />

          {/* Botão de login */}
          <TouchableOpacity style={styles.buttonEntrar} onPress={handlePress}>
            <TxtComponent texto="Entrar" styleTxt={styles.buttonText} />
          </TouchableOpacity>
        </View>

        {/* Modal de login */}
        <Modal
          transparent={true}
          animationType="fade"
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          {/* Fecha o modal ao clicar fora dele */}
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  {/* Botão para fechar o modal */}
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeModal}
                  >
                    <Icon name="cross" size={20} />
                  </TouchableOpacity>

                  {/* Textos explicativos no modal */}
                  <TxtComponent
                    texto="Entre no FutScore"
                    styleTxt={styles.modalText}
                  />
                  <TxtComponent
                    texto="Acompanhe infinitas estatísticas, resultados ao vivo e em tempo real, classificações atualizadas e muito mais somente com FUTSCORE."
                    styleTxt={styles.modalTextsub}
                  />

                  {/* Vídeo promocional */}
                  <Video
                    style={styles.video}
                    resizeMode={ResizeMode.CONTAIN}
                    source={require("../assets/Images/Video/videopropaganda.mp4")}
                    shouldPlay
                    isLooping={true}
                    isMuted={true}
                    onError={(error) =>
                      console.error("Erro ao carregar o vídeo:", error)
                    }
                  />

                  {/* Área segura para login */}
                  <SafeAreaView
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <StatusBar barStyle={"light-content"} />

                    {/* Botão de login com Google */}
                    <TouchableOpacity
                      disabled={!request}
                      onPress={() => {
                        promptAsync(); // Inicia o fluxo de autenticação
                      }}
                      style={styles.ButtonGoogle}
                    >
                      <Image
                        source={require("../assets/Images/IconGoogle.png")}
                        style={styles.LogoGoogle}
                      />
                      <TxtComponent
                        texto={"Fazer login com Google"}
                        styleTxt={styles.txtLogin}
                      />
                    </TouchableOpacity>

                    {/* Botão para voltar sem realizar login */}
                    <View style={styles.ViewFecharModal}>
                      <TouchableOpacity
                        style={styles.FecharModal}
                        onPress={closeModal}
                      >
                        <TxtComponent
                          texto={"Voltar"}
                          styleTxt={styles.FecharModalTxt}
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
