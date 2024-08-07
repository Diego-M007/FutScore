import React, { useState, useEffect } from "react";
import {
  StatusBar,
  SafeAreaView,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import HeaderComponent from "../components/HeaderComponent";
import { stylesPartidas } from "../styles/StylePartidas";
import TxtComponent from "../components/TxtComponent";
import EspaçoPropaganda from "../components/PropagandoComponent";
import CompeticaoCardComponent from "../components/CompetiçaoCardComponent";
import apiFootball from "../configs/api";

// Função para obter o fuso horário local
const getLocalTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function Partidas() {
  const [jogosPorCompeticao, setJogosPorCompeticao] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timezone, setTimezone] = useState(null);

  useEffect(() => {
    // Obter o fuso horário local
    const localTimezone = getLocalTimezone();
    setTimezone(localTimezone);

    const fetchJogosDoDia = async () => {
      const today = new Date();
      const startOfToday = new Date(today.setHours(0, 0, 0, 0));
      const endOfToday = new Date(today.setHours(23, 59, 59, 999));

      try {
        const response = await apiFootball.get("/fixtures", {
          params: {
            date: new Date().toISOString().split("T")[0],
            timezone: localTimezone, // Adicionando o fuso horário na requisição
          },
        });

        const competicoes = {};

        response.data.response.forEach((jogo) => {
          const jogoDataUTC = new Date(jogo.fixture.date);
          const jogoData = new Date(
            jogoDataUTC.toLocaleString("en-US", { timeZone: localTimezone })
          );

          if (jogoData >= startOfToday && jogoData <= endOfToday) {
            const competicao = jogo.league.name;
            if (!competicoes[competicao]) {
              competicoes[competicao] = {
                imagem: jogo.league.logo,
                nome: competicao,
                jogos: [],
              };
            }

            competicoes[competicao].jogos.push({
              timeCasa: jogo.teams.home.name,
              logoCasa: jogo.teams.home.logo,
              timeVisitante: jogo.teams.away.name,
              logoVisitante: jogo.teams.away.logo,
              horario: jogoData.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              resultado:
                jogo.goals.home !== null && jogo.goals.away !== null
                  ? `${jogo.goals.home} - ${jogo.goals.away}`
                  : null,
            });
          }
        });

        setJogosPorCompeticao(Object.values(competicoes));
      } catch (error) {
        console.error("Erro ao buscar os jogos do dia:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJogosDoDia();
  }, [timezone]);

  if (loading) {
    return (
      <SafeAreaView style={stylesPartidas.all}>
        <StatusBar barStyle="light-content" />
        <HeaderComponent />
        <EspaçoPropaganda />
        <View style={stylesPartidas.Container}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={stylesPartidas.all}>
      <StatusBar barStyle="light-content" />
      <HeaderComponent />
      <EspaçoPropaganda />
      <ScrollView contentContainerStyle={stylesPartidas.Container}>
        <TxtComponent
          texto={"Jogos do Dia"}
          styleTxt={stylesPartidas.TextoPrincipal}
        />
        {jogosPorCompeticao.map((competicao, index) => (
          <CompeticaoCardComponent
            key={index}
            imagem={competicao.imagem}
            nome={competicao.nome}
            quantidadeJogos={competicao.jogos.length}
            jogos={competicao.jogos}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
