import { StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black", // cor de fundo escura
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  loadingText: {
    fontSize: 18,
    color: "white", // texto em branco para contraste
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red", // manter o texto de erro vermelho
  },
  infoContainer: {
    padding: 20,
    alignItems: "center",
  },
  date: {
    fontSize: 14,
    color: "white", // manter o texto da data em cinza suave
  },
  InfLeague: {
    justifyContent: "center",
    alignItems: "center",
  },
  League: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: "3%",
  },
  team: {
    alignItems: "center",
    width: "35%",
    justifyContent: "center",
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  logo1: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  teamName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
    textAlign: "center", // Centraliza o texto
    flexWrap: "wrap", // Permite quebra de linha
    maxWidth: windowWidth * 0.3, // Define um tamanho máximo para o texto
  },
  Placar: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "rgba(44,44,46, 0.7)",
    borderColor: "#2f9fa6",
    borderWidth: 1,
    width: "30%",
    borderRadius: 40,
    padding: 12,
  },
  vsText: {
    fontSize: 15,
    fontWeight: "bold",
    marginHorizontal: 10,
    color: "white",
  },
  teamScore: {
    fontSize: 30,
    fontWeight: "bold",
    marginHorizontal: "4%",
    color: "white",
  },
  extraInfoContainer: {
    padding: 20,
    alignItems: "center",
  },
  extraInfoText: {
    fontSize: 12,
    color: "white", // texto de informação extra em cinza claro
  },
  // Estilos atualizados
  lineupsContainer: {
    padding: 20,
    borderWidth: 1,
    borderColor: "#2f9fa6",
    backgroundColor: "#1C1C1E", // fundo ainda mais escuro para contraste
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: "#000", // Sombra para dar profundidade
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 24, // Tamanho maior para destacar
    fontWeight: "bold",
    marginBottom: 15,
    color: "white", // Título em azul claro para destaque
    textAlign: "center",
  },
  teamLineup: {
    marginBottom: 20,
    backgroundColor: "#333", // Fundo para diferenciar as seções
    borderRadius: 10,
    padding: 10,
  },
  lineupTeams: {
    justifyContent: "space-between",
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  teamName2: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  playerName: {
    fontSize: 16,
    color: "#fff", // Nome dos jogadores em branco
    marginVertical: 4,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#444", // Separador para cada jogador
  },
  noLineupContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  noLineupImage: {
    resizeMode: "contain",
    height: "30%",
    width: "30%",
  },
  noLineupText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
  starterPlayer: {
    fontSize: 16,
    color: "#2f9fa6", // Verde para titulares
    fontWeight: "bold",
    marginVertical: 4,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  substitutePlayer: {
    fontSize: 16,
    color: "#ff6347", // Vermelho claro para reservas
    marginVertical: 4,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  toggleButtonContainer: {
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  toggleButton: {
    backgroundColor: "#00d4ff", // Botão com fundo azul claro
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  toggleButtonText: {
    color: "#fff", // Texto do botão em branco
    fontSize: 16,
    fontWeight: "bold",
  },

  statisticsContainer: {
    padding: 20,
    borderWidth: 1,
    borderColor: "#2f9fa6",
    backgroundColor: "#2C2C2E", // manter fundo escuro nas estatísticas
    borderRadius: 8,
    marginVertical: 5,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statsRowContent: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    borderBottomWidth: 1,
    padding: 10,
    borderColor: "white",
  },
  StatsTeams: {
    justifyContent: "center",
    alignItems: "center",
  },
  statsText: {
    fontSize: 16,
    color: "white", // texto das estatísticas em branco
    fontWeight: "bold",
  },
  teamStatsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white", // título das estatísticas em branco
  },
  progressBarContainer: {
    flexDirection: "row",
    width: "60%",
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 5,
  },
  progressBar: {
    height: "100%",
  },
  ContainerStats: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  eventsContainer: {
    padding: 20,
    borderWidth: 1,
    borderColor: "#2f9fa6",
    backgroundColor: "#2C2C2E", // fundo escuro para a seção de eventos
    borderRadius: 8,
    marginVertical: 5,
  },
  eventRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingTop: 5,
    marginTop: 5,
  },
  eventMinute: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    color: "white", // minutos dos eventos em branco
  },
  eventSide: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  eventDetailLeft: {
    fontSize: 12,
    marginRight: 5,
    color: "white", // detalhe do evento em branco
    textAlign: "left",
    flexWrap: "wrap",
  },
  eventDetailRight: {
    fontSize: 12,
    marginLeft: 5,
    textAlign: "right",
    color: "white", // detalhe do evento em branco
    flexWrap: "wrap",
  },
  periodTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "white", // título do período em verde-água
  },
  noEventsText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  botoesContainer: {
    flexDirection: "row", // Disposição horizontal dos botões
    alignItems: "center",
    justifyContent: "flex-start", // Mantém os botões alinhados à esquerda
    marginVertical: "5%",
    paddingHorizontal: 10, // Adiciona espaço horizontal ao redor dos botões
  },
  BtnInfos: {
    marginHorizontal: 5, // Adiciona espaço entre os botões
    width: 110,
  },
  containerField: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  teamLineup: {
    marginVertical: 20,
  },
  field: {
    width: 300,
    height: 400,
    backgroundColor: "#43A047",
    position: "relative",
    borderWidth: 1,
    borderColor: "#fff",
  },
  player: {
    position: "absolute",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
  },
  playerImage: {
    width: 30, // ajuste o tamanho conforme necessário
    height: 30, // ajuste o tamanho conforme necessário
    borderRadius: 15, // para deixar a imagem redonda
    marginRight: 10,
  },
  playerName: {
    fontSize: 10,
    textAlign: "center",
  },
  teamName3: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  containerh2: {
    width: "100%",
  },
  jogoContainerh2: {
    borderWidth: 1,
    borderColor: "#2f9fa6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
    padding: "1.5%",
    borderRadius: 10,
    backgroundColor: "#2C2C2E",
  },
  teamContainerHomeh2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    flexWrap: "wrap",
  },
  teamContainerAwayh2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
    flexWrap: "wrap",
  },
  logoh2: {
    width: 35,
    height: 35,
    borderRadius: 10,
    resizeMode: "contain",
  },
  equipesh2: {
    fontSize: 13,
    color: "white",
  },
  resultadoAoVivoh2: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  h2hDate: {
    fontSize: 12,
    color: "white",
    textAlign: "center",
  },
  h2hCompetition: {
    fontSize: 10,
    color: "#2f9fa6",
    textAlign: "center",
    flexWrap: "wrap",
  },
  noH2hText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginVertical: 20,
  },
  ContainResultadoh2: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#2f9fa6",
    paddingHorizontal: "2%",
    textAlign: "center",
    margin: "3%",
    flexDirection: "column",
    alignItems: "center",
  },
  imagemEventos: {
    width: 20,
    height: 20,
    marginHorizontal: 5,
  },
});
