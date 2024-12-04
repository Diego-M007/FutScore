import React, { useState, useEffect } from "react"; // Importo React e hooks para gerenciar estado e efeitos colaterais
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native"; // Importo componentes do React Native
import axios from "axios"; // Axios para realizar chamadas HTTP
import HeaderComponent from "../components/HeaderComponent"; // Cabeçalho reutilizável
import EspacoPropaganda from "../components/PropagandoComponent"; // Componente de espaço publicitário
import { Video, ResizeMode } from "expo-av"; // Componente para exibição de vídeos
import { stylesTorneios } from "../styles/StyleTorneios"; // Estilos específicos para esta tela
import { API_FOOTBALL_KEY } from "@env"; // Variável de ambiente contendo a chave da API de futebol
import TorneioCardComponent from "../components/TorneioCardComponent"; // Cartão de torneios
import TxtComponent from "../components/TxtComponent"; // Componente para texto reutilizável
import { useNavigation } from "@react-navigation/native"; // Hook para navegação no app

// Componente principal da tela de Torneios
export default function Torneios() {
  const [loading, setLoading] = useState(true); // Estado para controlar carregamento
  const [torneios, setTorneios] = useState([]); // Lista de torneios
  const [paises, setPaises] = useState([]); // Lista de países únicos
  const [expandedPais, setExpandedPais] = useState({}); // Estados de expansão para os países
  const navigation = useNavigation(); // Hook para manipular navegação

  // Lista das melhores ligas para destaque
  const melhoresLigas = [
    { name: "Premier League", country: "England" },
    { name: "La Liga", country: "Spain" },
    { name: "Serie A", country: "Italy" },
    { name: "Bundesliga", country: "Germany" },
    { name: "Ligue 1", country: "France" },
    { name: "Serie A", country: "Brazil" },
  ];

  // useEffect para buscar os torneios assim que o componente for montado
  useEffect(() => {
    const fetchTorneios = async () => {
      try {
        // Requisição para a API de futebol
        const response = await axios.get(
          "https://v3.football.api-sports.io/leagues",
          {
            params: { season: new Date().getFullYear() }, // Ano atual como parâmetro
            headers: {
              "x-rapidapi-host": "v3.football.api-sports.io", // Host da API
              "x-rapidapi-key": API_FOOTBALL_KEY, // Chave da API
            },
          }
        );

        // Manipulo a resposta para separar ligas e países
        if (response.data && response.data.response) {
          let ligas = response.data.response.filter(
            (league) => league.league && league.league.type === "League"
          );

          const paisesUnicos = [
            ...new Set(ligas.map((liga) => liga.country.name)),
          ].sort(); // Obtém os nomes únicos dos países, ordenados

          // Separo as melhores ligas e outras ligas
          const melhores = ligas.filter((liga) =>
            melhoresLigas.some(
              (ml) =>
                ml.name === liga.league.name && ml.country === liga.country.name
            )
          );

          const outrasLigas = ligas
            .filter(
              (liga) =>
                !melhoresLigas.some(
                  (ml) =>
                    ml.name === liga.league.name &&
                    ml.country === liga.country.name
                )
            )
            .sort((a, b) => a.league.name.localeCompare(b.league.name));

          // Ordeno as melhores ligas para serem exibidas primeiro
          const melhoresOrdenadas = melhoresLigas
            .map((ml) =>
              melhores.find(
                (liga) =>
                  liga.league.name === ml.name &&
                  liga.country.name === ml.country
              )
            )
            .filter(Boolean);

          const ligasOrdenadas = [...melhoresOrdenadas, ...outrasLigas];

          setPaises(paisesUnicos); // Atualizo os países
          setTorneios(ligasOrdenadas); // Atualizo as ligas
        }
      } catch (error) {
        // Caso haja erro, exibo um alerta e registro no console
        console.error("Erro ao buscar torneios:", error.message);
        Alert.alert("Erro", "Não foi possível carregar os torneios.");
      } finally {
        setLoading(false); // Finalizo o estado de carregamento
      }
    };

    fetchTorneios(); // Chamo a função para buscar os torneios
  }, []);

  // Alterna o estado de expansão do país clicado
  const toggleExpandPais = (pais) => {
    setExpandedPais((prev) => ({
      ...prev,
      [pais]: !prev[pais],
    }));
  };

  // Navega para a página da liga específica
  const openPaginaLiga = (ligaId) => {
    navigation.navigate("PaginaLiga", { ligaId });
  };

  // Função para renderizar as ligas de um país ou categoria
  const renderLigas = (ligas, isCountry = false) =>
    ligas.length > 0 ? (
      ligas.map((torneio) => (
        <TorneioCardComponent
          key={torneio.league.id} // ID único para cada liga
          imagem={torneio.league.logo} // Logo da liga
          nome={torneio.league.name} // Nome da liga
          ligaId={torneio.league.id} // ID para navegação
        />
      ))
    ) : (
      <Text style={stylesTorneios.noDataText}>
        {isCountry
          ? "Nenhuma liga disponível para este país." // Mensagem para países sem ligas
          : "Nenhuma liga disponível."}{" "}
        // Mensagem geral
      </Text>
    );

  // Tela de carregamento enquanto os dados são buscados
  if (loading) {
    return (
      <SafeAreaView style={stylesTorneios.videoContainer}>
        <StatusBar barStyle="light-content" />
        <HeaderComponent />
        <View style={stylesTorneios.videoContainer}>
          <Video
            style={stylesTorneios.video} // Estilizo o vídeo de carregamento
            resizeMode={ResizeMode.CONTAIN} // Contém o vídeo no espaço disponível
            source={require("../assets/Images/Video/loading.mp4")} // Caminho do vídeo
            shouldPlay // O vídeo começa automaticamente
            isLooping // O vídeo é repetido
            isMuted // Sem áudio
          />
        </View>
      </SafeAreaView>
    );
  }

  // Renderização principal da tela
  return (
    <SafeAreaView style={stylesTorneios.all}>
      <StatusBar barStyle="light-content" />
      <HeaderComponent />
      <EspacoPropaganda />
      <ScrollView contentContainerStyle={stylesTorneios.Container}>
        {/* Seção de melhores ligas */}
        <View style={stylesTorneios.section}>
          <TxtComponent
            texto={"Melhores Ligas"}
            styleTxt={stylesTorneios.TextoPrincipal}
          />
          {renderLigas(
            torneios.filter((torneio) =>
              melhoresLigas.some(
                (ml) =>
                  ml.name === torneio.league.name &&
                  ml.country === torneio.country.name
              )
            )
          )}
        </View>

        {/* Seção para seleção de países */}
        <View style={stylesTorneios.section}>
          <TxtComponent
            texto={"Selecione o País"}
            styleTxt={stylesTorneios.TextoPrincipal}
          />
          {paises.map((pais) => (
            <View key={pais}>
              <TouchableOpacity
                onPress={() => toggleExpandPais(pais)}
                style={[
                  stylesTorneios.paisButton,
                  expandedPais[pais] && stylesTorneios.paisButtonSelected,
                ]}
              >
                <Text style={stylesTorneios.paisButtonText}>{pais}</Text>
              </TouchableOpacity>
              {expandedPais[pais] && (
                <View style={stylesTorneios.ligasContainer}>
                  {renderLigas(
                    torneios.filter((torneio) => torneio.country.name === pais),
                    true
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
