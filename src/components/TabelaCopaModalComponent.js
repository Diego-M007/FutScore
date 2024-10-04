import React from "react";
import { View, Text, Modal, Button } from "react-native";

const TabelaCopaModalComponent = ({ visible, onClose, copa }) => {
  return (
    <Modal visible={visible} animationType="slide">
      <View>
        <Text>{copa.nome}</Text>
        {/* Aqui você exibe as informações da copa */}
        {/* Exemplo: */}
        <Text>Fase atual: {copa.faseAtual}</Text>
        <Text>Partidas:</Text>
        {/* Renderize as partidas ou tabelas aqui */}
        {/* ... */}

        <Button title="Fechar" onPress={onClose} />
      </View>
    </Modal>
  );
};

export default TabelaCopaModalComponent;
