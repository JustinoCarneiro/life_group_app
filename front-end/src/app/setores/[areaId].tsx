import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { buscarSetoresPorArea, criarSetor, deletarSetor } from '../../services/api';
import ConfirmModal from '../../components/ConfirmModal';

const TelaSetores = () => {
    const { areaId, areaName } = useLocalSearchParams<{ areaId: string, areaName: string }>();
    const [setores, setSetores] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [novoNomeSetor, setNovoNomeSetor] = useState('');

    const [modalDeletarVisivel, setModalDeletarVisivel] = useState(false);
    const [setorParaDeletar, setSetorParaDeletar] = useState<{ id: string, name: string } | null>(null);

    const buscarDados = useCallback(async () => {
        if (!areaId) return;
        try {
            setCarregando(true);
            setErro(null);
            // Chamada da função traduzida
            const dados = await buscarSetoresPorArea(areaId);
            setSetores(dados);
        } catch (err) {
            setErro(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido');
        } finally {
            setCarregando(false);
        }
    }, [areaId]);

    useEffect(() => {
        buscarDados();
    }, [buscarDados]);

    const handleCriarSetor = async () => {
        if (!novoNomeSetor.trim() || !areaId) return;
        try {
            const dadosSetor = { 
                name: novoNomeSetor, 
                areaId: areaId 
            };
            await criarSetor(dadosSetor);
            setNovoNomeSetor('');
            buscarDados();
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível criar o setor.');
        }
    };
    
    const iniciarProcessoDeletar = (id: string, name: string) => {
        setSetorParaDeletar({ id, name });
        setModalDeletarVisivel(true);
    };

    const confirmarDeletar = async () => {
        if (!setorParaDeletar) return;
        try {
            // Chamada da função traduzida
            await deletarSetor(setorParaDeletar.id);
            buscarDados();
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível deletar o setor.');
        } finally {
            setModalDeletarVisivel(false);
            setSetorParaDeletar(null);
        }
    };
    
    const cancelarDeletar = () => {
        setModalDeletarVisivel(false);
        setSetorParaDeletar(null);
    };

    if (!areaId) {
        return <Text>ID da Área não fornecido.</Text>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: `Setores de ${areaName || 'Área'}` }} />
            <Text style={styles.title}>Gerir Setores</Text>
            <Text style={styles.subtitle}>Área: {areaName}</Text>
            
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nome do novo setor"
                    value={novoNomeSetor}
                    onChangeText={setNovoNomeSetor}
                />
                <Button title="Adicionar" onPress={handleCriarSetor} />
            </View>

            {carregando ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : erro ? (
                <View style={{alignItems: 'center'}}>
                    <Text style={styles.errorText}>Erro: {erro}</Text>
                    <Button title="Tentar Novamente" onPress={buscarDados} />
                </View>
            ) : (
                <FlatList
                    data={setores}
                    keyExtractor={(item: any) => item.id.toString()}
                    renderItem={({ item }: { item: any }) => (
                        <Link 
                            href={{ 
                                pathname: `/lifegroups/${item.id}`, 
                                params: { sectorName: item.nome } 
                            } as any} 
                            asChild
                        >
                            <TouchableOpacity style={styles.item}>
                                <Text style={styles.itemText}>{item.nome}</Text>
                                <TouchableOpacity 
                                    onPress={(e) => {
                                        e.preventDefault(); 
                                        iniciarProcessoDeletar(item.id, item.nome); 
                                    }}
                                >
                                    <Text style={styles.deleteButton}>Deletar</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </Link>
                    )}
                    ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Nenhum setor cadastrado para esta área.</Text>}
                />
            )}

            {setorParaDeletar && (
                 <ConfirmModal
                    visivel={modalDeletarVisivel}
                    titulo="Confirmar Exclusão"
                    mensagem={`Deseja deletar o setor "${setorParaDeletar.name}"?`}
                    aoCancelar={cancelarDeletar}
                    aoConfirmar={confirmarDeletar}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    title: { fontSize: 28, fontWeight: 'bold', marginTop: 20, marginBottom: 8, textAlign: 'center' },
    subtitle: { fontSize: 16, color: 'gray', textAlign: 'center', marginBottom: 16 },
    inputContainer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16, gap: 8 },
    input: { flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, fontSize: 16 },
    item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 20, marginVertical: 8, marginHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
    itemText: { fontSize: 18 },
    deleteButton: { color: 'red', fontSize: 14 },
    errorText: { color: 'red', margin: 16, textAlign: 'center' }
});

export default TelaSetores;