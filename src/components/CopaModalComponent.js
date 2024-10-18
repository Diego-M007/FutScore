import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";

const CopaModalComponent = ({ visible, onClose, copaId }) => {
  const [groupStage, setGroupStage] = useState([]);
  const [knockoutStage, setKnockoutStage] = useState([]);
  const [currentStage, setCurrentStage] = useState("groups");

  useEffect(() => {
    if (copaId) {
      // Fetch data for the cup tournament when the modal is opened
      fetchCupData();
    }
  }, [copaId]);

  const fetchCupData = async () => {
    try {
      // Fetch data for the group stage
      const groupResponse = await axios.get(
        `https://api-football-endpoint/group-stage/${copaId}`
      );
      setGroupStage(groupResponse.data);

      // Fetch data for the knockout stage
      const knockoutResponse = await axios.get(
        `https://api-football-endpoint/knockout-stage/${copaId}`
      );
      setKnockoutStage(knockoutResponse.data);
    } catch (error) {
      console.error("Error fetching data for the cup: ", error);
    }
  };

  const renderGroupStage = () => (
    <View>
      {groupStage.map((group) => (
        <View key={group.id} style={styles.groupContainer}>
          <Text style={styles.groupName}>Grupo {group.name}</Text>
          {group.teams.map((team) => (
            <View key={team.id} style={styles.teamRow}>
              <Text>{team.name}</Text>
              <Text>{team.points}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  const renderKnockoutStage = () => (
    <View>
      {knockoutStage.map((round) => (
        <View key={round.id} style={styles.roundContainer}>
          <Text style={styles.roundName}>{round.name}</Text>
          {round.matches.map((match) => (
            <View key={match.id} style={styles.matchRow}>
              <Text>
                {match.homeTeam.name} vs {match.awayTeam.name}
              </Text>
              <Text>{match.score}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setCurrentStage("groups")}
              style={styles.headerButton}
            >
              <Text
                style={
                  currentStage === "groups"
                    ? styles.activeTab
                    : styles.inactiveTab
                }
              >
                Fase de Grupos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCurrentStage("knockout")}
              style={styles.headerButton}
            >
              <Text
                style={
                  currentStage === "knockout"
                    ? styles.activeTab
                    : styles.inactiveTab
                }
              >
                Eliminatórias
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.stageContainer}>
            {currentStage === "groups"
              ? renderGroupStage()
              : renderKnockoutStage()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    padding: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  closeButtonText: {
    color: "red",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  headerButton: {
    padding: 10,
  },
  activeTab: {
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "black",
  },
  inactiveTab: {
    color: "gray",
  },
  stageContainer: {
    maxHeight: 400,
  },
  groupContainer: {
    marginBottom: 20,
  },
  groupName: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  teamRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  roundContainer: {
    marginBottom: 20,
  },
  roundName: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  matchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
});

export default CopaModalComponent;
