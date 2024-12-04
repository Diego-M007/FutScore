import React, { useState } from "react"; // Importa React e o hook useState para gerenciar estados
import { View, Button, Text, StyleSheet } from "react-native"; // Componentes para interface no React Native
import { AnimatedCircularProgress } from "react-native-circular-progress"; // Biblioteca para animações de progresso circular

// Componente principal da Roleta
export default function SpinRoleta() {
  const [resultado, setResultado] = useState(null); // Estado para armazenar o resultado do sorteio
  const [isSpinning, setIsSpinning] = useState(false); // Estado para controlar se a roleta está girando

  // Array de probabilidades para o sorteio
  const jogadores = [
    ...Array(52).fill("Ouro"), // 52 itens de "Ouro" (menor probabilidade)
    ...Array(154).fill("Prata"), // 154 itens de "Prata"
    ...Array(154).fill("Bronze"), // 154 itens de "Bronze" (maior probabilidade)
  ];

  // Função para iniciar o giro da roleta
  const iniciarSpin = () => {
    setIsSpinning(true); // Define que a roleta está girando
    setResultado(null); // Reseta o resultado anterior

    // Simula o tempo de giro com um delay
    setTimeout(() => {
      // Sorteia um item aleatório do array de jogadores
      const sorteado = jogadores[Math.floor(Math.random() * jogadores.length)];
      setResultado(sorteado); // Atualiza o estado com o resultado sorteado
      setIsSpinning(false); // Para o giro
    }, 3000); // Duração do giro: 3 segundos
  };

  return (
    <View style={styles.container}>
      {/* Verifica se a roleta está girando */}
      {isSpinning ? (
        // Exibe um componente animado enquanto a roleta gira
        <AnimatedCircularProgress
          size={200} // Tamanho do círculo
          width={3} // Espessura do traço
          fill={100} // Progresso do preenchimento (100% completo)
          tintColor="#00e0ff" // Cor do progresso
          backgroundColor="#3d5875" // Cor de fundo do círculo
          duration={3000} // Duração da animação (3 segundos)
          rotation={360} // Rotação completa (360 graus)
        />
      ) : (
        // Exibe o botão para iniciar o giro quando não está girando
        <Button title="Girar Roleta" onPress={iniciarSpin} color="#FFD700" />
      )}
      {/* Exibe o resultado quando o giro termina */}
      {resultado && (
        <Text style={styles.resultado}>Resultado: {resultado}</Text>
      )}
    </View>
  );
}

// Estilos personalizados
const styles = StyleSheet.create({
  container: {
    justifyContent: "center", // Centraliza os itens verticalmente
    alignItems: "center", // Centraliza os itens horizontalmente
    flex: 1, // Ocupa o espaço total disponível
    backgroundColor: "#000", // Fundo preto
  },
  resultado: {
    marginTop: 20, // Espaço acima do texto do resultado
    fontSize: 24, // Tamanho da fonte do resultado
    color: "#FFF", // Cor do texto: branco
    fontWeight: "bold", // Deixa o texto em negrito
  },
});
