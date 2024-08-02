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

export default function Partidas() {
  const [competicoes, setCompeticoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJogosPorCompeticao = async () => {
      try {
        const response = await apiFootball.get("/fixtures", {
          params: {
            date: new Date().toISOString().split("T")[0],
          },
        });

        const competicoesMap = new Map();

        response.data.response.forEach((jogo) => {
          const compId = jogo.league.id;
          if (!competicoesMap.has(compId)) {
            competicoesMap.set(compId, {
              nome: jogo.league.name,
              imagem: jogo.league.logo,
              quantidadeJogos: 0,
              jogos: [],
            });
          }
          const competicao = competicoesMap.get(compId);
          competicao.quantidadeJogos += 1;
          competicao.jogos.push({
            timeCasa: jogo.teams.home.name,
            logoCasa: jogo.teams.home.logo,
            timeVisitante: jogo.teams.away.name,
            logoVisitante: jogo.teams.away.logo,
            horario: new Date(jogo.fixture.date).toLocaleTimeString(),
          });
        });

        setCompeticoes(Array.from(competicoesMap.values()));
      } catch (error) {
        console.error("Erro ao buscar os jogos do dia:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJogosPorCompeticao();
  }, []);

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
        {competicoes.map((comp, index) => (
          <CompeticaoCardComponent
            key={index}
            imagem={comp.imagem}
            nome={comp.nome}
            quantidadeJogos={comp.quantidadeJogos}
            jogos={comp.jogos}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
