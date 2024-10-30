// SearchScreen.js
import React, { useState } from "react";
import { API_FOOTBALL_KEY } from "@env";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";

export default function SearchScreen({ onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        "https://v3.football.api-sports.io/fixtures?live=all",
        {
          headers: {
            "x-rapidapi-host": "v3.football.api-sports.io",
            "x-rapidapi-key": API_FOOTBALL_KEY,
          },
        }
      );

      if (!response.ok) {
        console.log(
          "Erro na resposta da API:",
          response.status,
          response.statusText
        );
        return;
      }

      const data = await response.json();
      console.log("API Response:", data.response);

      const filteredResults = data.response.filter(
        (item) =>
          item.teams.home.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.teams.away.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.league.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      console.log("Filtered Results:", filteredResults);
      setResults(filteredResults || []);
    } catch (error) {
      console.error("Erro ao buscar os resultados:", error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Digite para buscar times, partidas ou campeonatos"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        style={{
          borderColor: "#6200ee",
          borderWidth: 1,
          borderRadius: 8,
          padding: 8,
          marginBottom: 16,
        }}
      />
      <TouchableOpacity
        onPress={handleSearch}
        style={{ backgroundColor: "#6200ee", padding: 10, borderRadius: 8 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Buscar</Text>
      </TouchableOpacity>

      <FlatList
        data={results}
        keyExtractor={(item) => item.fixture.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{ padding: 16, borderBottomWidth: 1, borderColor: "#ddd" }}
          >
            <Text>{item.league.name}</Text>
            <Text>
              {item.teams.home.name} vs {item.teams.away.name}
            </Text>
          </View>
        )}
      />

      <TouchableOpacity
        onPress={onClose}
        style={{ padding: 10, marginTop: 20 }}
      >
        <Text style={{ color: "#6200ee", textAlign: "center" }}>Fechar</Text>
      </TouchableOpacity>
    </View>
  );
}
