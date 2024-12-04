import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import axios from "axios";
import moment from "moment-timezone";

// Componente principal que exibe os jogos filtrados de ligas específicas
const LigasEspecificasComponent = () => {
  const [jogos, setJogos] = useState([]); // Estado para armazenar os jogos buscados
  const [loading, setLoading] = useState(true); // Estado para indicar se os dados estão carregando

  // Lista de ligas específicas que quero filtrar (IDs das ligas)
  const ligasEspecificas = [123, 456, 789]; // Exemplo de IDs: Libertadores, Sul-Americana, Brasileirão

  // Hook que roda uma vez ao carregar o componente para buscar os jogos do dia
  useEffect(() => {
    const fetchJogos = async () => {
      try {
        // Fazendo a chamada à API para buscar os jogos do dia
        const response = await axios.get(
          "https://v3.football.api-sports.io/fixtures",
          {
            headers: {
              "x-rapidapi-key": API_FOOTBALL_KEY, // Minha chave da API
              "x-rapidapi-host": "v3.football.api-sports.io",
            },
            params: {
              timezone: "America/Sao_Paulo", // Definindo o fuso horário
              date: moment().format("YYYY-MM-DD"), // Pegando a data de hoje no formato correto
            },
          }
        );
        const jogosDoDia = response.data.response; // Pegando a lista de jogos da resposta
        setJogos(jogosDoDia); // Salvando os jogos no estado
        setLoading(false); // Indicando que o carregamento terminou
      } catch (error) {
        console.error("Erro ao buscar os jogos:", error); // Tratando o erro no console
        setLoading(false); // Mesmo com erro, marcamos o carregamento como concluído
      }
    };

    fetchJogos(); // Chamando a função
  }, []); // O array vazio significa que roda apenas uma vez

  // Função para filtrar os jogos pelas ligas que coloquei no array
  const filtrarJogosPorLigas = (jogos) => {
    return jogos.filter((jogo) => ligasEspecificas.includes(jogo.league.id));
  };

  // Função que renderiza os cards de competição com os jogos
  const renderCompeticaoCard = ({ item }) => {
    // Filtrando apenas os jogos das ligas que me interessam
    const jogosCompeticao = filtrarJogosPorLigas(item.jogos);

    return (
      <TouchableOpacity onPress={() => {}}>
        <View style={styles.card}>
          {/* Mostra a imagem da competição */}
          <Image source={{ uri: item.imagem }} style={styles.imagem} />
          <View style={styles.info}>
            {/* Nome da competição */}
            <Text style={styles.nome}>{item.nome}</Text>
            {/* Quantidade de jogos na competição */}
            <Text
              style={styles.quantidadeJogos}
            >{`${jogosCompeticao.length} jogos`}</Text>
          </View>
        </View>
        {/* Exibindo os jogos da competição */}
        {jogosCompeticao.map((jogo) => (
          <View key={jogo.fixtureId} style={styles.jogoContainer}>
            <Text style={styles.equipes}>
              {jogo.timeCasa} vs {jogo.timeVisitante} {/* Exibe os times */}
            </Text>
            <Text style={styles.horario}>{jogo.horario}</Text>{" "}
            {/* Exibe o horário */}
          </View>
        ))}
      </TouchableOpacity>
    );
  };

  // Enquanto os dados estão carregando, mostro uma mensagem
  if (loading) {
    return <Text>Carregando jogos...</Text>;
  }

  // Exibe a lista de competições com os jogos
  return (
    <FlatList
      data={jogos} // Lista de jogos que buscamos
      renderItem={renderCompeticaoCard} // Função para renderizar cada item
      keyExtractor={(item) => item.nome} // Chave única para cada item (usada no React Native)
    />
  );
};

// Estilos para o layout do componente
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2f9fa6",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#2C2C2E",
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imagem: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: "contain",
    borderRadius: 10,
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  quantidadeJogos: {
    fontSize: 12,
    color: "#fff",
  },
  jogoContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#3A3A3C",
  },
  equipes: {
    fontSize: 14,
    color: "#fff",
  },
  horario: {
    fontSize: 12,
    color: "#fff",
  },
});

export default LigasEspecificasComponent;
