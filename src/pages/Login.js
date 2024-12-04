import React, { useEffect } from "react"; // Importa o React e o useEffect para trabalhar com ciclos de vida do componente
import { SafeAreaView, StatusBar, Button } from "react-native"; // Importa os componentes visuais do React Native
import { makeRedirectUri, useAuthRequest } from "expo-auth-session"; // Ferramentas para gerenciar a autenticação
import * as Google from "expo-auth-session/providers/google"; // Provedor específico para login com Google
import Constants from "expo-constants"; // Para acessar informações da configuração do app
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth"; // Ferramentas do Firebase para autenticação

// Componente principal de Login
export default function Login() {
  const googleClientId = Constants.manifest.extra.googleClientId; // Obtém o ID do cliente do Google configurado no app

  const redirectUri = makeRedirectUri({
    useProxy: false, // Configura para não usar proxy
    scheme: "FutScore", // Esquema personalizado do app
  });

  // Configura o pedido de autenticação com Google
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: googleClientId, // ID do cliente do Google
    redirectUri, // URL de redirecionamento
  });

  // useEffect é chamado quando a resposta muda (após o login ser iniciado)
  useEffect(() => {
    if (response?.type === "success") {
      // Se a resposta for sucesso
      const { id_token } = response.params; // Extrai o token de identificação do Google

      const auth = getAuth(); // Obtém a instância de autenticação do Firebase
      const credential = GoogleAuthProvider.credential(id_token); // Cria uma credencial do Google com o token
      signInWithCredential(auth, credential) // Faz o login no Firebase com essa credencial
        .then((result) => {
          console.log("Usuário logado: ", result.user); // Mostra no console os dados do usuário logado
        })
        .catch((error) => {
          console.error("Erro durante o login com Google: ", error); // Exibe erros, caso aconteçam
        });
    } else if (response?.type === "error") {
      // Se houver erro no processo de login
      console.error("Erro durante o processo de login: ", response.error);
    }
  }, [response]); // Dependência: roda sempre que a resposta mudar

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }} // Centraliza o conteúdo na tela
    >
      <StatusBar barStyle={"light-content"} />{" "}
      {/* Define o estilo da barra de status */}
      <Button
        title="Login com Google" // Texto do botão
        disabled={!request} // Desativa o botão se o request ainda não foi configurado
        onPress={() => {
          promptAsync() // Inicia o processo de login ao clicar
            .then((response) => {
              console.log("Response:", response); // Loga a resposta do login
            })
            .catch((error) => {
              console.error("Error:", error); // Mostra erro, caso aconteça
            });
        }}
      />
    </SafeAreaView>
  );
}
