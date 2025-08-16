import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, Button, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { buscarPessoasPorLifeGroup, criarPessoa, deletarPessoa, atualizarPessoa } from '../../services/api';
import ConfirmModal from '../../components/ConfirmModal';
import PersonFormModal from '../../components/PersonFormModal';

interface DadosPessoaForm {
    id?: string;
    nome: string;
    contato: string;
    endereco: string;
    dataNascimento: string;
}

const TelaPessoas = () => {
    const { lifegroupId, lifegroupName } = useLocalSearchParams<{ lifegroupId: string, lifegroupName: string }>();
    
    const [pessoas, setPessoas] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const [modalDeletarVisivel, setModalDeletarVisivel] = useState(false);
    const [pessoaParaDeletar, setPessoaParaDeletar] = useState<{ id: string, nome: string } | null>(null);
    const [formModalVisivel, setFormModalVisivel] = useState(false);
    const [pessoaParaEditar, setPessoaParaEditar] = useState<any | null>(null);

    const buscarDados = useCallback(async () => {
        if (!lifegroupId) return;
        try {
            setCarregando(true);
            setErro(null);
            const dados = await buscarPessoasPorLifeGroup(lifegroupId);
            setPessoas(dados);
        } catch (err) {
            setErro(err instanceof Error ? err.message : 'Ocorreu um erro');
        } finally {
            setCarregando(false);
        }
    }, [lifegroupId]);

    useEffect(() => {
        buscarDados();
    }, [buscarDados]);

    const handleAdicionarNovaPessoa = () => {
        setPessoaParaEditar(null);
        setFormModalVisivel(true);
    };
    
    const handleEditarPessoa = (pessoa: any) => {
        setPessoaParaEditar(pessoa);
        setFormModalVisivel(true);
    };

    const handleSubmeterFormulario = async (dadosForm: DadosPessoaForm) => {
        try {
            if (pessoaParaEditar) {
                await atualizarPessoa(pessoaParaEditar.id, dadosForm);
            } else {
                const novaPessoa = { ...dadosForm, idLifeGroup: lifegroupId };
                await criarPessoa(novaPessoa);
            }
            setFormModalVisivel(false);
            buscarDados();
        } catch (err) {
            Alert.alert('Erro', `Não foi possível ${pessoaParaEditar ? 'atualizar' : 'criar'} a pessoa.`);
        }
    };
    
    const iniciarProcessoDeletar = (id: string, nome: string) => {
        setPessoaParaDeletar({ id, nome });
        setModalDeletarVisivel(true);
    };

    const confirmarDeletar = async () => {
        if (!pessoaParaDeletar) return;
        try {
            await deletarPessoa(pessoaParaDeletar.id);
            buscarDados();
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível deletar a pessoa.');
        } finally {
            setModalDeletarVisivel(false);
            setPessoaParaDeletar(null);
        }
    };
    
    const cancelarDeletar = () => {
        setModalDeletarVisivel(false);
        setPessoaParaDeletar(null);
    };

    if (carregando) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
    if (erro) return <View><Text style={styles.errorText}>Erro: {erro}</Text><Button title="Tentar Novamente" onPress={buscarDados} /></View>;

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: `Membros de ${lifegroupName || 'LifeGroup'}` }} />
            <Text style={styles.title}>Gerir Pessoas</Text>
            <Text style={styles.subtitle}>LifeGroup: {lifegroupName}</Text>
            <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
                <Button title="Adicionar Nova Pessoa" onPress={handleAdicionarNovaPessoa} />
            </View>

            <FlatList
                data={pessoas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                     <View style={styles.item}>
                        <View style={styles.linkArea}>
                            <Text style={styles.itemText}>{item.nome}</Text>
                            <Text style={styles.itemSubText}>{item.contato}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => handleEditarPessoa(item)} style={styles.actionButton}>
                                <Text style={styles.editButton}>Editar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => iniciarProcessoDeletar(item.id, item.nome)} style={styles.actionButton}>
                                <Text style={styles.deleteButton}>Deletar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Nenhuma pessoa cadastrada neste LifeGroup.</Text>}
            />

            <PersonFormModal 
                visivel={formModalVisivel}
                aoFechar={() => setFormModalVisivel(false)}
                aoSubmeter={handleSubmeterFormulario}
                dadosIniciais={pessoaParaEditar}
            />

            {pessoaParaDeletar && (
                 <ConfirmModal
                    visivel={modalDeletarVisivel}
                    titulo="Confirmar Exclusão"
                    mensagem={`Deseja deletar "${pessoaParaDeletar.nome}"?`}
                    aoCancelar={cancelarDeletar}
                    aoConfirmar={confirmarDeletar}
                />
            )}
        </SafeAreaView>
    );
};

// ... (Estilos permanecem os mesmos)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f4f8' },
    title: { fontSize: 28, fontWeight: 'bold', marginTop: 20, marginBottom: 8, textAlign: 'center' },
    subtitle: { fontSize: 16, color: 'gray', textAlign: 'center', marginBottom: 16 },
    item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 20, marginVertical: 8, marginHorizontal: 16, borderRadius: 8, elevation: 2 },
    linkArea: { flex: 1 },
    itemText: { fontSize: 18, fontWeight: '500' },
    itemSubText: { fontSize: 14, color: '#666', marginTop: 4 },
    actionButton: { padding: 8 },
    editButton: { color: '#007AFF' },
    deleteButton: { color: 'red' },
    errorText: { color: 'red', margin: 16, textAlign: 'center' }
});

export default TelaPessoas;