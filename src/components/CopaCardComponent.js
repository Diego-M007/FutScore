import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import TabelaCopaModalComponent from "./TabelaCopaModalComponent";

const CopaCardComponent = ({ copa }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <Text>{copa.nome}</Text>
      <Button title="Ver Tabela" onPress={() => setModalVisible(true)} />

      <TabelaCopaModalComponent
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        copa={copa}
      />
    </View>
  );
};

export default CopaCardComponent;
