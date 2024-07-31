import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  getCountries,
  getLeaguesByCountry,
  getStandingsByLeague,
} from "../configs/api";

const Torneios = () => {
  const [countries, setCountries] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [standings, setStandings] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      const countriesData = await getCountries();
      setCountries(countriesData);
    };

    fetchCountries();
  }, []);

  const handleCountrySelect = async (country) => {
    setSelectedCountry(country);
    const leaguesData = await getLeaguesByCountry(country.name);
    // Ordenar ligas por popularidade
    leaguesData.sort((a, b) => b.league.popularity - a.league.popularity);
    setLeagues(leaguesData);
  };

  const handleLeagueSelect = async (league) => {
    setSelectedLeague(league);
    const standingsData = await getStandingsByLeague(league.league.id);
    setStandings(standingsData);
  };

  const renderCountry = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleCountrySelect(item)}
    >
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderLeague = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleLeagueSelect(item)}
    >
      <Text>{item.league.name}</Text>
    </TouchableOpacity>
  );

  const renderStanding = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.team.name}</Text>
      <Text>{item.points}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {selectedCountry === null ? (
        <FlatList
          data={countries}
          keyExtractor={(item) => item.name}
          renderItem={renderCountry}
        />
      ) : selectedLeague === null ? (
        <FlatList
          data={leagues}
          keyExtractor={(item) => item.league.id.toString()}
          renderItem={renderLeague}
        />
      ) : standings.length > 0 ? (
        <FlatList
          data={standings}
          keyExtractor={(item) => item.team.id.toString()}
          renderItem={renderStanding}
        />
      ) : (
        <Text>No standings data available for this league.</Text>
      )}
      {(selectedCountry !== null || selectedLeague !== null) && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (selectedLeague !== null) {
              setSelectedLeague(null);
              setStandings([]);
            } else {
              setSelectedCountry(null);
              setLeagues([]);
            }
          }}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 10,
    backgroundColor: "#ccc",
    alignItems: "center",
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: "blue",
  },
});

export default Torneios;
