import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native';

// 1. Interface de dados traduzida
interface DadosPessoaForm {
    id?: string;
    nome: string;
    contato: string;
    endereco: string;
    dataNascimento: string;
}

interface PersonFormModalProps {
    visivel: boolean;
    aoFechar: () => void;
    aoSubmeter: (pessoa: DadosPessoaForm) => void;
    dadosIniciais?: any | null; // Recebe o DTO da API
}

const PersonFormModal: React.FC<PersonFormModalProps> = ({ visivel, aoFechar, aoSubmeter, dadosIniciais }) => {
    const [pessoa, setPessoa] = useState<DadosPessoaForm>({ nome: '', contato: '', endereco: '', dataNascimento: '' });

    useEffect(() => {
        if (dadosIniciais) {
            // 2. Mapeamento corrigido: lê as propriedades em português do DTO
            setPessoa({
                id: dadosIniciais.id,
                nome: dadosIniciais.nome || '',
                contato: dadosIniciais.contato || '',
                endereco: dadosIniciais.endereco || '',
                dataNascimento: dadosIniciais.dataNascimento ? dadosIniciais.dataNascimento.split('T')[0] : '',
            });
        } else {
            // Reseta para o estado inicial traduzido
            setPessoa({ nome: '', contato: '', endereco: '', dataNascimento: '' });
        }
    }, [dadosIniciais]);

    const handleMudanca = (campo: keyof DadosPessoaForm, valor: string) => {
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
                            value={pessoa.nome}
                            onChangeText={(texto) => handleMudanca('nome', texto)}
                            placeholder="Nome completo"
                        />
                        <Text style={styles.label}>Contacto</Text>
                        <TextInput
                            style={styles.input}
                            value={pessoa.contato}
                            onChangeText={(texto) => handleMudanca('contato', texto)}
                            placeholder="(xx) xxxxx-xxxx"
                            keyboardType="phone-pad"
                        />
                        <Text style={styles.label}>Endereço</Text>
                        <TextInput
                            style={styles.input}
                            value={pessoa.endereco}
                            onChangeText={(texto) => handleMudanca('endereco', texto)}
                            placeholder="Rua, número, bairro..."
                        />
                        <Text style={styles.label}>Data de Nascimento</Text>
                        <TextInput
                            style={styles.input}
                            value={pessoa.dataNascimento}
                            onChangeText={(texto) => handleMudanca('dataNascimento', texto)}
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

// ... (estilos permanecem os mesmos)
const styles = StyleSheet.create({
    centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalView: { width: '90%', maxHeight: '80%', backgroundColor: 'white', borderRadius: 20, padding: 20, alignItems: 'center' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    label: { alignSelf: 'flex-start', marginLeft: 5, marginTop: 10, marginBottom: 5, fontWeight: '500' },
    input: { width: '100%', height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 10 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20 }
});


export default PersonFormModal;