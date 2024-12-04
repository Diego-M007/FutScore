import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import axios from "axios";
import moment from "moment-timezone"; // Biblioteca para manipulação de datas
import CompeticoesPorPaisComponent from "../components/CompetiçõesPorPaises"; // Componente para exibir competições por país
import HeaderComponent from "../components/HeaderComponent"; // Componente de cabeçalho
import { stylesPartidas } from "../styles/StylePartidas"; // Estilos personalizados para a tela
import { API_FOOTBALL_KEY } from "@env"; // Chave da API Football
import TxtComponent from "../components/TxtComponent"; // Componente de texto customizado
import EspaçoPropaganda from "../components/PropagandoComponent"; // Componente de propaganda/ads
import { Video, ResizeMode } from "expo-av"; // Biblioteca para reprodução de vídeo
import LigasEspecificasComponent from "../components/PrincipaisLigasComponente"; // Componente para principais ligas

// Componente principal que exibe as partidas do dia
export default function Partidas() {
  const [jogosPorPais, setJogosPorPais] = useState({}); // Estado que armazena jogos organizados por país e competição
  const [loading, setLoading] = useState(true); // Indicador de carregamento
  const [selectedDate, setSelectedDate] = useState(new Date()); // Data selecionada para buscar os jogos
  const timezone = "America/Sao_Paulo"; // Fuso horário para manipulação de datas

  // Efeito para buscar jogos ao alterar a data selecionada
  useEffect(() => {
    const fetchJogos = async (date) => {
      try {
        // Formata a data selecionada no formato necessário para a API
        const formattedDate = moment(date).tz(timezone).format("YYYY-MM-DD");

        // Faz uma requisição para buscar os jogos da data formatada
        const response = await axios.get(
          "https://v3.football.api-sports.io/fixtures",
          {
            params: { date: formattedDate, timezone },
            headers: {
              "x-rapidapi-host": "v3.football.api-sports.io",
              "x-rapidapi-key": API_FOOTBALL_KEY,
            },
          }
        );

        // Organiza os jogos por país e competição
        const paises = {};
        response.data.response.forEach((jogo) => {
          const pais = jogo.league.country; // Obtém o país da competição
          const competicao = jogo.league.name; // Nome da competição

          if (!paises[pais]) {
            paises[pais] = []; // Cria um array para o país se não existir
          }

          // Verifica se a competição já está listada para o país
          let competicaoObj = paises[pais].find(
            (comp) => comp.nome === competicao
          );

          if (!competicaoObj) {
            competicaoObj = {
              nome: competicao,
              imagem: jogo.league.logo, // Logo da competição
              jogos: [], // Array para armazenar os jogos
            };
            paises[pais].push(competicaoObj);
          }

          // Filtra os jogos do dia
          const jogoDate = moment(jogo.fixture.date).tz(timezone);
          if (jogoDate.isSame(formattedDate, "day")) {
            competicaoObj.jogos.push({
              timeCasa: jogo.teams.home.name,
              logoCasa: jogo.teams.home.logo,
              timeVisitante: jogo.teams.away.name,
              logoVisitante: jogo.teams.away.logo,
              horario: jogoDate.format("HH:mm"), // Horário formatado
              resultado:
                jogo.goals.home !== null && jogo.goals.away !== null
                  ? `${jogo.goals.home} - ${jogo.goals.away}` // Resultado final (se disponível)
                  : null,
              fixtureId: jogo.fixture.id, // ID único do jogo
            });
          }
        });

        // Atualiza o estado com os jogos organizados
        setJogosPorPais(paises);
      } catch (error) {
        console.error("Erro ao buscar os jogos do dia:", error); // Log de erro
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    fetchJogos(selectedDate); // Chama a função ao montar o componente ou alterar a data
  }, [selectedDate]);

  // Exibe uma tela de carregamento enquanto os dados não estão prontos
  if (loading) {
    return (
      <SafeAreaView style={stylesPartidas.all}>
        <StatusBar barStyle="light-content" />
        <HeaderComponent />
        <View style={styles.videoContainer}>
          <Video
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            source={require("../assets/Images/Video/loading.mp4")} // Vídeo de loading
            shouldPlay
            isLooping={false}
            isMuted={true}
            onError={(error) =>
              console.error("Erro ao carregar o vídeo:", error)
            }
          />
        </View>
      </SafeAreaView>
    );
  }

  // Renderiza o conteúdo principal após carregar os dados
  return (
    <SafeAreaView style={stylesPartidas.all}>
      <StatusBar barStyle="light-content" />
      <HeaderComponent onDateChange={setSelectedDate} /> {/* Cabeçalho */}
      <EspaçoPropaganda /> {/* Componente de propaganda */}
      <ScrollView contentContainerStyle={stylesPartidas.Container}>
        {/* Texto principal */}
        <TxtComponent
          texto={"Jogos do Dia"}
          styleTxt={stylesPartidas.TextoPrincipal}
        />

        {/* Componente para exibir competições organizadas por país */}
        <CompeticoesPorPaisComponent jogosPorPais={jogosPorPais} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "1550%",
    height: "50%",
  },
});
