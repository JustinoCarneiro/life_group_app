import React from 'react';
import { Modal, View, Text, StyleSheet, Button } from 'react-native';

interface ConfirmModalProps {
    visivel: boolean;
    titulo: string;
    mensagem: string;
    aoCancelar: () => void;
    aoConfirmar: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ visivel, titulo, mensagem, aoCancelar, aoConfirmar }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visivel}
            onRequestClose={aoCancelar}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>{titulo}</Text>
                    <Text style={styles.modalText}>{mensagem}</Text>
                    <View style={styles.buttonContainer}>
                        <Button title="Cancelar" onPress={aoCancelar} color="#666" />
                        <View style={{ width: 16 }} />
                        <Button title="Confirmar" onPress={aoConfirmar} color="red" />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalView: { margin: 20, backgroundColor: 'white', borderRadius: 20, padding: 35, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    modalTitle: { marginBottom: 10, textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
    modalText: { marginBottom: 20, textAlign: 'center' },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' }
});

export default ConfirmModal;