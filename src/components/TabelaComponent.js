import React, { useState, useEffect } from "react";
import { View, Text, Image, ActivityIndicator, ScrollView } from "react-native";
import axios from "axios";
import { API_FOOTBALL_KEY } from "@env";
import { styles } from "../styles/StyleTabela";

// Configuração de vagas manual por liga (exemplo)
const leaguePositionsConfig = {
  // Exemplo para o Brasileirão Série A
  71: { libertadores: 4, sulamericana: 8, rebaixamento: 4 },
  // Exemplo para La Liga
  140: { championsLeague: 4, europaLeague: 6, rebaixamento: 3 },
};

export default function TabelaComponent({ leagueId, ano }) {
  const [tabela, setTabela] = useState([]); // Estado para armazenar os dados da tabela
  const [loadingTabela, setLoadingTabela] = useState(true); // Estado para controlar o carregamento da tabela

  // Verifica a configuração de vagas específica da liga
  const vagas = leaguePositionsConfig[leagueId] || {
    libertadores: 4,
    sulamericana: 8,
    rebaixamento: 4,
  };

  useEffect(() => {
    // Função que busca a tabela da liga
    const fetchTabela = async () => {
      const seasonYear = ano || new Date().getFullYear(); // Ano da temporada, se não informado usa o ano atual
      try {
        // Requisição para buscar a tabela de classificação da liga
        const response = await axios.get(
          `https://v3.football.api-sports.io/standings`,
          {
            params: { league: leagueId, season: seasonYear }, // Passa os parâmetros de liga e temporada
            headers: {
              "x-rapidapi-key": API_FOOTBALL_KEY, // Chave da API
              "x-rapidapi-host": "v3.football.api-sports.io", // Host da API
            },
          }
        );
        // Verifica se a resposta contém dados e os armazena no estado 'tabela'
        if (response.data.response && response.data.response.length > 0) {
          setTabela(response.data.response[0].league.standings[0]);
        } else {
          console.log("Nenhum dado de tabela encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar a tabela:", error);
      } finally {
        // Define o estado de loading como falso após o carregamento
        setLoadingTabela(false);
      }
    };

    fetchTabela(); // Chama a função para buscar os dados da tabela
  }, [leagueId, ano]); // Efeito depende de 'leagueId' e 'ano'

  // Função para renderizar o desempenho dos times (V, E, D)
  const renderDesempenho = (form) => {
    return form.split("").map((result, index) => {
      let color = "";
      let translatedResult = "";

      if (result === "W") {
        // Vitória
        color = "limegreen";
        translatedResult = "V";
      }
      if (result === "D") {
        // Empate
        color = "gray";
        translatedResult = "E";
      }
      if (result === "L") {
        // Derrota
        color = "red";
        translatedResult = "D";
      }

      // Retorna o desempenho estilizado
      return (
        <Text
          key={index}
          style={[styles.formCircle, { backgroundColor: color }]}
        >
          {translatedResult}
        </Text>
      );
    });
  };

  // Função para determinar a cor da posição na tabela
  const getPositionColor = (position) => {
    if (position <= vagas.libertadores) return "limegreen"; // Libertadores
    if (position <= vagas.sulamericana) return "blue"; // Sul-Americana
    if (position > tabela.length - vagas.rebaixamento) return "red"; // Rebaixamento
    return "transparent"; // Caso não se enquadre em nenhuma das opções
  };

  // Função para renderizar a tabela de classificação
  const renderTabela = () => {
    if (loadingTabela) {
      return <ActivityIndicator size="large" color="#2f9fa6" />; // Exibe o carregamento enquanto os dados não são carregados
    }

    if (tabela.length === 0) {
      return <Text style={styles.noDataText}>Nenhuma tabela disponível.</Text>; // Caso não haja dados na tabela
    }

    // Renderiza cada linha da tabela com as informações do time
    return tabela.map((team, index) => (
      <View key={team.team.id} style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text style={styles.tablePosition}>{index + 1}</Text>
          {/* Exibe a posição */}
        </View>
        <View style={styles.tableCell1}>
          <View
            style={[
              styles.positionBar,
              { backgroundColor: getPositionColor(index + 1) }, // Cor da posição
            ]}
          />
          <Image source={{ uri: team.team.logo }} style={styles.teamLogo} />
          {/* Exibe o logo do time */}
          <Text style={styles.tableTeamName}>{team.team.name}</Text>
          {/* Exibe o nome do time */}
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tablePoints}>{team.points}</Text>
          {/* Exibe os pontos */}
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.teamStats}>{team.all.played}</Text>
          {/* Exibe o número de jogos */}
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.teamStats}>
            {team.all.goals.for}:{team.all.goals.against}
            {/* Exibe o placar de gols */}
          </Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.teamStats}>{team.goalsDiff}</Text>
          {/* Exibe a diferença de gols */}
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.teamStats}>{team.all.win}</Text>
          {/* Exibe o número de vitórias */}
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.teamStats}>{team.all.draw}</Text>
          {/* Exibe o número de empates */}
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.teamStats}>{team.all.lose}</Text>
          {/* Exibe o número de derrotas */}
        </View>
        <View style={styles.formContainer}>{renderDesempenho(team.form)}</View>
        {/* Exibe os últimos resultados */}
      </View>
    ));
  };

  return (
    <ScrollView horizontal={true}>
      {/* Permite rolagem horizontal da tabela */}
      <View style={styles.tableContainer}>
        <View style={styles.headerRow}>
          {/* Cabeçalho da tabela */}
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
        {renderTabela()} {/* Exibe a tabela de classificação */}
      </View>
    </ScrollView>
  );
}
