import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  Modal,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { API_FOOTBALL_KEY } from "@env"; // Chave da API que está armazenada em variáveis de ambiente
import { styles } from "../styles/StyleTabela"; // Estilos usados no componente (certifique-se de ter este arquivo)

// Componente para exibir a tabela de classificação dentro de um modal
export default function TabelaModalComponent({ leagueId, isVisible, onClose }) {
  const [tabela, setTabela] = useState([]); // Estado para guardar os dados da tabela
  const [loadingTabela, setLoadingTabela] = useState(true); // Estado para indicar se a tabela está carregando

  // Hook que executa quando o `leagueId` muda (ou seja, quando uma liga específica é selecionada)
  useEffect(() => {
    if (leagueId) {
      const fetchTabela = async () => {
        try {
          // Fazendo a requisição para a API para buscar a tabela de classificação
          const response = await axios.get(
            `https://v3.football.api-sports.io/standings`,
            {
              params: { league: leagueId, season: new Date().getFullYear() }, // Liga e temporada atual
              headers: {
                "x-rapidapi-key": API_FOOTBALL_KEY, // Minha chave da API
                "x-rapidapi-host": "v3.football.api-sports.io",
              },
            }
          );

          // Se houver dados, pega o primeiro grupo de classificação
          if (response.data.response && response.data.response.length > 0) {
            setTabela(response.data.response[0].league.standings[0]);
          } else {
            console.log("Nenhum dado de tabela encontrado."); // Caso a API não traga resultados
          }
        } catch (error) {
          console.error("Erro ao buscar a tabela:", error); // Tratando erros de requisição
        } finally {
          setLoadingTabela(false); // Finalizando o estado de carregamento
        }
      };

      fetchTabela(); // Chama a função para buscar a tabela
    }
  }, [leagueId]); // Roda sempre que `leagueId` mudar

  // Função para renderizar o desempenho dos times nos últimos jogos
  const renderDesempenho = (form) => {
    // Cada resultado é traduzido e estilizado com uma cor
    return form.split("").map((result, index) => {
      let color = "";
      let translatedResult = "";

      if (result === "W") {
        color = "limegreen"; // Vitória (verde)
        translatedResult = "V";
      }
      if (result === "D") {
        color = "gray"; // Empate (cinza)
        translatedResult = "E";
      }
      if (result === "L") {
        color = "red"; // Derrota (vermelho)
        translatedResult = "D";
      }

      return (
        <Text
          key={index}
          style={[styles.formCircle, { backgroundColor: color }]} // Círculo com a cor correspondente
        >
          {translatedResult} {/* Exibe a tradução do resultado */}
        </Text>
      );
    });
  };

  // Função para renderizar a tabela de classificação
  const renderTabela = () => {
    if (loadingTabela) {
      // Enquanto os dados estão carregando, exibe um indicador de carregamento
      return <ActivityIndicator size="large" color="#2f9fa6" />;
    }

    if (tabela.length === 0) {
      // Caso não tenha dados na tabela
      return <Text style={styles.noDataText}>Nenhuma tabela disponível.</Text>;
    }

    // Mapeia os times para renderizar cada linha da tabela
    return tabela.map((team, index) => (
      <View key={team.team.id} style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text style={styles.tablePosition}>{index + 1}</Text> {/* Posição */}
        </View>
        <View style={styles.tableCell1}>
          <Image source={{ uri: team.team.logo }} style={styles.teamLogo} />{" "}
          {/* Logo do time */}
          <Text style={styles.tableTeamName}>{team.team.name}</Text>{" "}
          {/* Nome do time */}
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tablePoints}>{team.points}</Text> {/* Pontos */}
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.teamStats}>{team.all.played}</Text>{" "}
          {/* Jogos disputados */}
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.teamStats}>
            {team.all.goals.for}:{team.all.goals.against}{" "}
            {/* Gols marcados e sofridos */}
          </Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.teamStats}>{team.goalsDiff}</Text>{" "}
          {/* Saldo de gols */}
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.teamStats}>{team.all.win}</Text> {/* Vitórias */}
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.teamStats}>{team.all.draw}</Text> {/* Empates */}
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.teamStats}>{team.all.lose}</Text> {/* Derrotas */}
        </View>
        <View style={styles.formContainer}>{renderDesempenho(team.form)}</View>{" "}
        {/* Últimos jogos */}
      </View>
    ));
  };

  // Estrutura do modal que exibe a tabela
  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        {/* Scroll horizontal para exibir a tabela completa */}
        <ScrollView horizontal={true}>
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.tableContainer}>
              {/* Cabeçalho da tabela */}
              <View style={styles.headerRow}>
                <View style={styles.headerCell}>
                  <Text style={styles.headerText}>Pos</Text>
                </View>
                <View style={styles.headerCell1}>
                  <Text style={styles.headerText}>Time</Text>
                </View>
                <View style={styles.headerCell}>
                  <Text style={styles.headerText}>P</Text>
                </View>
                <View style={styles.headerCell}>
                  <Text style={styles.headerText}>J</Text>
                </View>
                <View style={styles.headerCell}>
                  <Text style={styles.headerText}>Gol</Text>
                </View>
                <View style={styles.headerCell}>
                  <Text style={styles.headerText}>+/-</Text>
                </View>
                <View style={styles.headerCell}>
                  <Text style={styles.headerText}>V</Text>
                </View>
                <View style={styles.headerCell}>
                  <Text style={styles.headerText}>E</Text>
                </View>
                <View style={styles.headerCell}>
                  <Text style={styles.headerText}>D</Text>
                </View>
                <View style={styles.headerCell1}>
                  <Text style={styles.headerText}>Últimos Jogos</Text>
                </View>
              </View>
              {renderTabela()} {/* Renderiza a tabela */}
            </View>
          </ScrollView>
        </ScrollView>

        {/* Botão para fechar o modal */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
