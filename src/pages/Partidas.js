import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { getGamesOfTheDay } from "../configs/api";
import HeaderComponent from "../components/HeaderComponent";
import { styles } from "../styles/StylePartidas";
const Partidas = () => {
  const [games, setGames] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      const gamesData = await getGamesOfTheDay();
      console.log("Games data:", gamesData);

      if (typeof gamesData !== "object" || gamesData === null) {
        console.error("Unexpected games data format:", gamesData);
        return;
      }

      setGames(gamesData);
    };

    fetchGames();
  }, []);

  const renderGame = ({ item }) => (
    <View style={styles.gameItem}>
      <View style={styles.teams}>
        <Image source={{ uri: item.teams.home.logo }} style={styles.teamLogo} />
        <Text>
          {item.teams.home.name} vs {item.teams.away.name}
        </Text>
        <Image source={{ uri: item.teams.away.logo }} style={styles.teamLogo} />
      </View>
      <Text>{new Date(item.fixture.date).toLocaleTimeString()}</Text>
    </View>
  );

  const renderLeague = ({ item }) => (
    <TouchableOpacity
      style={styles.leagueItem}
      onPress={() => setSelectedLeague(item)}
    >
      <Text>{item}</Text>
      <Text>{games[selectedCountry][item].length}</Text>
    </TouchableOpacity>
  );

  const renderCountry = ({ item }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => setSelectedCountry(item)}
    >
      <Text>{item}</Text>
      <Text>
        {Object.keys(games[item] || {}).reduce(
          (acc, league) => acc + games[item][league]?.length,
          0
        )}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.all}>
      <HeaderComponent />
      <Text style={styles.title}>Jogos do Dia</Text>
      {selectedCountry === null ? (
        <FlatList
          data={Object.keys(games)}
          keyExtractor={(item) => item}
          renderItem={renderCountry}
        />
      ) : selectedLeague === null ? (
        <FlatList
          data={Object.keys(games[selectedCountry] || {})}
          keyExtractor={(item) => item}
          renderItem={renderLeague}
        />
      ) : (
        <FlatList
          data={games[selectedCountry][selectedLeague] || []}
          keyExtractor={(item) => item.fixture.id.toString()}
          renderItem={renderGame}
        />
      )}
      {selectedCountry !== null && (
        <TouchableOpacity onPress={() => setSelectedCountry(null)}>
          <Text style={styles.backButton}>Voltar</Text>
        </TouchableOpacity>
      )}
      {selectedLeague !== null && (
        <TouchableOpacity onPress={() => setSelectedLeague(null)}>
          <Text style={styles.backButton}>Voltar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Partidas;
