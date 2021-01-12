import * as React from 'react';
import { View } from "react-native";
import { Modal, Text, Button } from 'react-native-paper';

const ModalContent = ({setModal}) => {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};

  return (
        <Modal visible={setModal} onDismiss={hideModal} contentContainerStyle={containerStyle}>
            <Text>Example Modal.  Click outside this area to dismiss.</Text>
            <Button style={{marginTop: 30}} onPress={hideModal}>
                OK
            </Button>
        </Modal>
  );
};

export default ModalContent;