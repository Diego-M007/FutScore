import React, { useState } from "react"; // Importação do React e do hook useState
import { View, Button, Text, StyleSheet } from "react-native"; // Importação de componentes básicos do React Native
import { AnimatedCircularProgress } from "react-native-circular-progress"; // Biblioteca para animação circular de progresso

// Componente principal SpinRoleta
export default function SpinRoleta() {
  const [resultado, setResultado] = useState(null); // Estado para armazenar o resultado do giro
  const [isSpinning, setIsSpinning] = useState(false); // Estado para verificar se a roleta está girando

  // Lista de prêmios possíveis, com diferentes chances baseadas em suas quantidades
  const jogadores = [
    ...Array(52).fill("Ouro"), // Menor probabilidade (52 itens)
    ...Array(154).fill("Prata"), // Probabilidade média (154 itens)
    ...Array(154).fill("Bronze"), // Maior probabilidade (154 itens)
  ];

  // Função que inicia o giro da roleta
  const iniciarSpin = () => {
    setIsSpinning(true); // Define que a roleta está girando
    setResultado(null); // Reseta o resultado anterior

    // Simula um tempo de 3 segundos para o giro
    setTimeout(() => {
      // Sorteia aleatoriamente um item da lista "jogadores"
      const sorteado = jogadores[Math.floor(Math.random() * jogadores.length)];
      setResultado(sorteado); // Define o resultado sorteado
      setIsSpinning(false); // Finaliza o estado de giro
    }, 3000);
  };

  return (
    <View style={styles.container}>
      {/* Verifica se a roleta está girando */}
      {isSpinning ? (
        // Exibe a animação de progresso enquanto a roleta está girando
        <AnimatedCircularProgress
          size={200} // Tamanho do círculo (200px)
          width={3} // Espessura da borda do círculo
          fill={100} // Percentual de preenchimento (100% para simular o giro)
          tintColor="#00e0ff" // Cor do preenchimento
          backgroundColor="#3d5875" // Cor de fundo
          duration={3000} // Duração da animação (3 segundos)
          rotation={360} // Rotação completa
        />
      ) : (
        // Botão para iniciar o giro da roleta
        <Button title="Girar Roleta" onPress={iniciarSpin} color="#FFD700" />
      )}

      {/* Exibe o resultado se houver um */}
      {resultado && (
        <Text style={styles.resultado}>Resultado: {resultado}</Text>
      )}
    </View>
  );
}

// Estilos personalizados do componente
const styles = StyleSheet.create({
  container: {
    justifyContent: "center", // Centraliza o conteúdo verticalmente
    alignItems: "center", // Centraliza o conteúdo horizontalmente
    flex: 1, // Faz o componente ocupar a tela inteira
    backgroundColor: "#000", // Fundo preto
  },
  resultado: {
    marginTop: 20, // Espaço acima do texto do resultado
    fontSize: 24, // Tamanho grande para o texto
    color: "#FFF", // Texto branco
    fontWeight: "bold", // Texto em negrito
  },
});
