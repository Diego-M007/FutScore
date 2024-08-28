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
  const googleClientId = Constants.manifest.extra.googleClientId;

  const redirectUri = makeRedirectUri({
    useProxy: false, // Não usar proxy
    scheme: "FutScore", // Substitua pelo seu esquema
  });

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
        })
        .catch((error) => {
          console.error("Erro durante o login com Google: ", error);
        });
    } else if (response?.type === "error") {
      console.error("Erro durante o processo de login: ", response.error);
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
          promptAsync()
            .then((response) => {
              console.log("Response:", response);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }}
      />
    </SafeAreaView>
  );
}
