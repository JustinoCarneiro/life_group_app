import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native';

interface DadosPessoa {
    id?: string;
    name: string;
    contact: string;
    address: string;
    birth_date: string;
}

interface PersonFormModalProps {
    visivel: boolean;
    aoFechar: () => void;
    aoSubmeter: (pessoa: DadosPessoa) => void;
    dadosIniciais?: DadosPessoa | null;
}

const PersonFormModal: React.FC<PersonFormModalProps> = ({ visivel, aoFechar, aoSubmeter, dadosIniciais }) => {
    const [pessoa, setPessoa] = useState<DadosPessoa>({ name: '', contact: '', address: '', birth_date: '' });

    useEffect(() => {
        if (dadosIniciais) {
            setPessoa({
                ...dadosIniciais,
                birth_date: dadosIniciais.birth_date ? dadosIniciais.birth_date.split('T')[0] : '',
            });
        } else {
            setPessoa({ name: '', contact: '', address: '', birth_date: '' });
        }
    }, [dadosIniciais]);

    const handleMudanca = (campo: keyof DadosPessoa, valor: string) => {
        setPessoa(prev => ({ ...prev, [campo]: valor }));
    };

    const handleSubmeter = () => {
        aoSubmeter(pessoa);
    };

    return (
        <Modal
            visible={visivel}
            animationType="slide"
            onRequestClose={aoFechar}
            transparent={true}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>{dadosIniciais ? 'Editar Pessoa' : 'Adicionar Pessoa'}</Text>
                    <ScrollView style={{ width: '100%' }}>
                        <Text style={styles.label}>Nome Completo</Text>
                        <TextInput
                            style={styles.input}
                            value={pessoa.name}
                            onChangeText={(texto) => handleMudanca('name', texto)}
                            placeholder="Nome completo"
                        />
                        <Text style={styles.label}>Contacto</Text>
                        <TextInput
                            style={styles.input}
                            value={pessoa.contact}
                            onChangeText={(texto) => handleMudanca('contact', texto)}
                            placeholder="(xx) xxxxx-xxxx"
                            keyboardType="phone-pad"
                        />
                        <Text style={styles.label}>Endereço</Text>
                        <TextInput
                            style={styles.input}
                            value={pessoa.address}
                            onChangeText={(texto) => handleMudanca('address', texto)}
                            placeholder="Rua, número, bairro..."
                        />
                        <Text style={styles.label}>Data de Nascimento</Text>
                        <TextInput
                            style={styles.input}
                            value={pessoa.birth_date}
                            onChangeText={(texto) => handleMudanca('birth_date', texto)}
                            placeholder="AAAA-MM-DD"
                        />
                    </ScrollView>
                    <View style={styles.buttonContainer}>
                        <Button title="Cancelar" onPress={aoFechar} color="gray" />
                        <Button title={dadosIniciais ? 'Salvar Alterações' : 'Adicionar'} onPress={handleSubmeter} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalView: { width: '90%', maxHeight: '80%', backgroundColor: 'white', borderRadius: 20, padding: 20, alignItems: 'center' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    label: { alignSelf: 'flex-start', marginLeft: 5, marginTop: 10, marginBottom: 5, fontWeight: '500' },
    input: { width: '100%', height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 10 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20 }
});

export default PersonFormModal;