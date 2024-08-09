import React, { useEffect } from "react";
import { SafeAreaView, StatusBar, Button } from "react-native";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import Constants from "expo-constants";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

export default function Login() {
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

  // Defina o redirectUri manualmente
  const redirectUri = "https://1euao1c-anonymous-8081.exp.direct";

  // Configuração do request de autenticação com Google
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: googleClientId,
    redirectUri,
  });

  // Efeito para gerenciar a resposta da autenticação
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      const auth = getAuth();
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((result) => {
          console.log("Usuário logado: ", result.user);
        })
        .catch((error) => {
          console.error("Erro durante o login com Google: ", error);
        });
    }
  }, [response]);

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <StatusBar barStyle={"light-content"} />
      <Button
        title="Login com Google"
        disabled={!request}
        onPress={() => {
          promptAsync();
        }}
      />
    </SafeAreaView>
  );
}
