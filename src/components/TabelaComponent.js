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
  const [tabela, setTabela] = useState([]);
  const [loadingTabela, setLoadingTabela] = useState(true);

  // Verifica a configuração de vagas específica da liga
  const vagas = leaguePositionsConfig[leagueId] || {
    libertadores: 4,
    sulamericana: 8,
    rebaixamento: 4,
  };

  useEffect(() => {
    const fetchTabela = async () => {
      const seasonYear = ano || new Date().getFullYear();
      try {
        const response = await axios.get(
          `https://v3.football.api-sports.io/standings`,
          {
            params: { league: leagueId, season: seasonYear },
            headers: {
              "x-rapidapi-key": API_FOOTBALL_KEY,
              "x-rapidapi-host": "v3.football.api-sports.io",
            },
          }
        );
        if (response.data.response && response.data.response.length > 0) {
          setTabela(response.data.response[0].league.standings[0]);
        } else {
          console.log("Nenhum dado de tabela encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar a tabela:", error);
      } finally {
        setLoadingTabela(false);
      }
    };

    fetchTabela();
  }, [leagueId, ano]);

  const renderDesempenho = (form) => {
    return form.split("").map((result, index) => {
      let color = "";
      let translatedResult = "";

      if (result === "W") {
        color = "limegreen";
        translatedResult = "V";
      }
      if (result === "D") {
        color = "gray";
        translatedResult = "E";
      }
      if (result === "L") {
        color = "red";
        translatedResult = "D";
      }

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

  const getPositionColor = (position) => {
    if (position <= vagas.libertadores) return "limegreen"; // Libertadores
    if (position <= vagas.sulamericana) return "blue"; // Sul-Americana
    if (position > tabela.length - vagas.rebaixamento) return "red"; // Rebaixamento
    return "transparent";
  };

  const renderTabela = () => {
    if (loadingTabela) {
      return <ActivityIndicator size="large" color="#2f9fa6" />;
    }

    if (tabela.length === 0) {
      return <Text style={styles.noDataText}>Nenhuma tabela disponível.</Text>;
    }

    return tabela.map((team, index) => (
      <View key={team.team.id} style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text style={styles.tablePosition}>{index + 1}</Text>
        </View>
        <View style={styles.tableCell1}>
          <View
            style={[
              styles.positionBar,
              { backgroundColor: getPositionColor(index + 1) },
            ]}
          />
          <Image source={{ uri: team.team.logo }} style={styles.teamLogo} />
          <Text style={styles.tableTeamName}>{team.team.name}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.tablePoints}>{team.points}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.teamStats}>{team.all.played}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.teamStats}>
            {team.all.goals.for}:{team.all.goals.against}
          </Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.teamStats}>{team.goalsDiff}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.teamStats}>{team.all.win}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.teamStats}>{team.all.draw}</Text>
        </View>
        <View style={styles.tableCell}>
          <Text style={styles.teamStats}>{team.all.lose}</Text>
        </View>
        <View style={styles.formContainer}>{renderDesempenho(team.form)}</View>
      </View>
    ));
  };

  return (
    <ScrollView horizontal={true}>
      <View style={styles.tableContainer}>
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
        {renderTabela()}
      </View>
    </ScrollView>
  );
}
