import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { buscarLifeGroupsPorSetor, criarLifeGroup, deletarLifeGroup } from '../../services/api';
import ConfirmModal from '../../components/ConfirmModal';

const TelaLifeGroups = () => {
    const { sectorId, sectorName } = useLocalSearchParams<{ sectorId: string, sectorName: string }>();

    const [lifegroups, setLifegroups] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [novoNomeLifeGroup, setNovoNomeLifeGroup] = useState('');

    const [modalDeletarVisivel, setModalDeletarVisivel] = useState(false);
    const [lifeGroupParaDeletar, setLifeGroupParaDeletar] = useState<{ id: string, nome: string } | null>(null);

    const buscarDados = useCallback(async () => {
        if (!sectorId) return;
        try {
            setCarregando(true);
            setErro(null);
            const dados = await buscarLifeGroupsPorSetor(sectorId);
            setLifegroups(dados);
        } catch (err) {
            setErro(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido');
        } finally {
            setCarregando(false);
        }
    }, [sectorId]);

    useEffect(() => {
        buscarDados();
    }, [buscarDados]);

    const handleCriarLifeGroup = async () => {
        if (!novoNomeLifeGroup.trim() || !sectorId) return;
        try {
            const dadosLifeGroup = { nome: novoNomeLifeGroup, setorId: sectorId };
            await criarLifeGroup(dadosLifeGroup);
            setNovoNomeLifeGroup('');
            buscarDados();
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível criar o LifeGroup.');
        }
    };
    
    const iniciarProcessoDeletar = (id: string, nome: string) => {
        setLifeGroupParaDeletar({ id, nome });
        setModalDeletarVisivel(true);
    };

    const confirmarDeletar = async () => {
        if (!lifeGroupParaDeletar) return;
        try {
            await deletarLifeGroup(lifeGroupParaDeletar.id);
            buscarDados();
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível deletar o LifeGroup.');
        } finally {
            setModalDeletarVisivel(false);
            setLifeGroupParaDeletar(null);
        }
    };
    
    const cancelarDeletar = () => {
        setModalDeletarVisivel(false);
        setLifeGroupParaDeletar(null);
    };
    
    const renderizarItem = ({ item }: { item: any }) => (
        <View style={styles.item}>
            <Link href={{ pathname: `/pessoas/${item.id}`, params: { lifegroupName: item.nome } } as any} asChild>
                <TouchableOpacity style={styles.linkArea}>
                    <Text style={styles.itemText}>{item.nome}</Text>
                </TouchableOpacity>
            </Link>
            <TouchableOpacity onPress={() => iniciarProcessoDeletar(item.id, item.nome)} style={styles.deleteButtonContainer}>
                <Text style={styles.deleteButton}>Deletar</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: `Lifegroups de ${sectorName || 'Setor'}` }} />
            
            <Text style={styles.title}>Gerir Lifegroups</Text>
            <Text style={styles.subtitle}>Setor: {sectorName}</Text>
            
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nome do novo Lifegroup"
                    value={novoNomeLifeGroup}
                    onChangeText={setNovoNomeLifeGroup}
                />
                <Button title="Adicionar" onPress={handleCriarLifeGroup} />
            </View>

            {carregando ? <ActivityIndicator size="large" /> : erro ? (
                <View style={{alignItems: 'center'}}>
                    <Text style={styles.errorText}>Erro: {erro}</Text>
                    <Button title="Tentar Novamente" onPress={buscarDados} />
                </View>
            ) : (
                <FlatList
                    data={lifegroups}
                    keyExtractor={(item: any) => item.id.toString()}
                    renderItem={renderizarItem}
                    ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Nenhum Lifegroup cadastrado para este setor.</Text>}
                />
            )}

            {lifeGroupParaDeletar && (
                 <ConfirmModal
                    visivel={modalDeletarVisivel}
                    titulo="Confirmar Exclusão"
                    mensagem={`Deseja deletar o Lifegroup "${lifeGroupParaDeletar.nome}"?`}
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
    inputContainer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16, gap: 8 },
    input: { flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, fontSize: 16 },
    item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 20, marginVertical: 8, marginHorizontal: 16, borderRadius: 8, elevation: 2 },
    linkArea: { flex: 1, paddingVertical: 10 },
    itemText: { fontSize: 18, fontWeight: '500' },
    deleteButtonContainer: { paddingVertical: 10, paddingLeft: 20 },
    deleteButton: { color: 'red', fontSize: 14 },
    errorText: { color: 'red', margin: 16, textAlign: 'center' }
});

export default TelaLifeGroups;