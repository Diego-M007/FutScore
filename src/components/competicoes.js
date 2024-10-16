import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios"; // Se estiver usando Axios para chamadas de API

const Competicoes = ({ route }) => {
  const { country } = route.params; // Obtém o país passado como parâmetro
  const [competicoes, setCompeticoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para buscar competições por país na API
    const fetchCompeticoes = async () => {
      try {
        const response = await axios.get(
          `https://api-football-v1.p.rapidapi.com/v3/leagues?country=${country}`,
          {
            headers: {
              "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
              "x-rapidapi-key": "SUA_CHAVE_AQUI", // Substitua pela sua chave da API
            },
          }
        );
        setCompeticoes(response.data.response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompeticoes();
  }, [country]);

  const renderCompeticao = ({ item }) => (
    <View style={styles.competicaoContainer}>
      <Text style={styles.competicaoName}>{item.league.name}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando competições...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Competições em {country}:</Text>
      <FlatList
        data={competicoes}
        renderItem={renderCompeticao}
        keyExtractor={(item) => item.league.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  competicaoContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  competicaoName: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Competicoes;
