import React, { useEffect } from "react"; // Importo React e o hook useEffect para executar efeitos colaterais
import { StyleSheet, View } from "react-native"; // Importo os componentes de estilo e layout do React Native
import { Video, ResizeMode } from "expo-av"; // Importo o componente de vídeo da biblioteca expo-av
import { CommonActions, useNavigation } from "@react-navigation/native"; // Ferramentas para navegação no app

// Componente Splash: Tela inicial com vídeo de introdução
export default function Splash() {
  const navigation = useNavigation(); // Acesso à navegação para redirecionar o usuário

  // useEffect executa uma vez ao montar o componente
  useEffect(() => {
    // Timer de 5 segundos (ajustado para o tempo do vídeo)
    setTimeout(() => {
      // Reseto a pilha de navegação para ir diretamente para "Jogos do Dia"
      navigation.dispatch(
        CommonActions.reset({
          index: 0, // Define o índice inicial como 0
          routes: [{ name: "Jogos do Dia" }], // Define o destino como "Jogos do Dia"
        })
      );
    }, 5000); // Tempo do timeout em milissegundos (5 segundos)
  }, [navigation]); // Dependência do efeito: atualiza se navigation mudar

  return (
    <View style={styles.container}>
      {/* Componente de vídeo para exibir o splash */}
      <Video
        style={styles.video} // Estilizo o vídeo
        resizeMode={ResizeMode.CONTAIN} // Ajuste do vídeo para caber no contêiner sem cortar conteúdo
        source={require("../assets/Images/Video/Splash.mp4")} // Caminho do arquivo de vídeo
        shouldPlay // O vídeo começa a rodar automaticamente
        isLooping={false} // Não é necessário repetir o vídeo
        isMuted={true} // Desativo o som do vídeo
        onError={(error) => console.error("Erro ao carregar o vídeo:", error)} // Trato erros de carregamento do vídeo
      />
    </View>
  );
}

// Estilos personalizados
const styles = StyleSheet.create({
  container: {
    flex: 1, // O container ocupa todo o espaço da tela
    justifyContent: "center", // Centralizo o conteúdo verticalmente
    alignItems: "center", // Centralizo o conteúdo horizontalmente
    backgroundColor: "black", // Fundo preto para evitar bordas visíveis no vídeo
  },
  video: {
    width: "100%", // O vídeo ocupa 100% da largura da tela
    height: "100%", // O vídeo ocupa 100% da altura da tela
  },
});
