import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView,
    TextInput, Button, TouchableOpacity, Alert
} from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { getLifegroupsBySector, createLifegroup, deleteLifegroup } from '../../services/api';
import ConfirmModal from '../../components/ConfirmModal';

const LifegroupScreen = () => {
    // Pega os parâmetros passados pela rota (neste caso, da tela de Setores)
    const { sectorId, sectorName } = useLocalSearchParams<{ sectorId: string, sectorName: string }>();

    const [lifegroups, setLifegroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newLifegroupName, setNewLifegroupName] = useState('');

    // Estados para controlar o modal de confirmação
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [lifegroupToDelete, setLifegroupToDelete] = useState<{ id: string, name: string } | null>(null);

    // Função para buscar os lifegroups da API
    const fetchLifegroups = useCallback(async () => {
        if (!sectorId) return;
        try {
            setIsLoading(true);
            setError(null);
            const data = await getLifegroupsBySector(sectorId);
            setLifegroups(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido');
        } finally {
            setIsLoading(false);
        }
    }, [sectorId]);

    useEffect(() => {
        fetchLifegroups();
    }, [fetchLifegroups]);

    // Função para criar um novo lifegroup
    const handleCreateLifegroup = async () => {
        if (!newLifegroupName.trim() || !sectorId) {
            Alert.alert('Erro', 'O nome do Lifegroup não pode ser vazio.');
            return;
        }
        try {
            // O backend espera um objeto Sector completo, então enviamos o ID dentro de um objeto
            const lifegroupData = { name: newLifegroupName, sector: { id: sectorId } };
            await createLifegroup(lifegroupData);
            setNewLifegroupName('');
            fetchLifegroups(); // Recarrega a lista
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível criar o Lifegroup.');
        }
    };
    
    // Funções para o processo de exclusão
    const startDeleteProcess = (id: string, name: string) => {
        setLifegroupToDelete({ id, name });
        setIsModalVisible(true);
    };

    const confirmDelete = async () => {
        if (!lifegroupToDelete) return;
        try {
            await deleteLifegroup(lifegroupToDelete.id);
            fetchLifegroups();
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível deletar o Lifegroup.');
        } finally {
            setIsModalVisible(false);
            setLifegroupToDelete(null);
        }
    };
    
    const cancelDelete = () => {
        setIsModalVisible(false);
        setLifegroupToDelete(null);
    };

    if (!sectorId) {
        return <Text>ID do Setor não fornecido.</Text>;
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Configura o título da página dinamicamente */}
            <Stack.Screen options={{ title: `Lifegroups de ${sectorName || 'Setor'}` }} />
            
            <Text style={styles.title}>Gerir Lifegroups</Text>
            <Text style={styles.subtitle}>Setor: {sectorName}</Text>
            
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nome do novo Lifegroup"
                    value={newLifegroupName}
                    onChangeText={setNewLifegroupName}
                />
                <Button title="Adicionar" onPress={handleCreateLifegroup} />
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : error ? (
                <View style={{alignItems: 'center'}}>
                    <Text style={styles.errorText}>Erro: {error}</Text>
                    <Button title="Tentar Novamente" onPress={fetchLifegroups} />
                </View>
            ) : (
                <FlatList
                    data={lifegroups}
                    keyExtractor={(item: any) => item.id.toString()}
                    renderItem={({ item }: { item: any }) => (
                        <Link 
                            href={{ 
                                pathname: `/pessoas/${item.id}`, 
                                params: { lifegroupName: item.name } 
                            } as any}
                            asChild
                        >
                            <TouchableOpacity style={styles.item}>
                                <View style={styles.linkArea}>
                                    <Text style={styles.itemText}>{item.name}</Text>
                                </View>
                                <TouchableOpacity 
                                    onPress={(e) => { 
                                        e.preventDefault(); 
                                        startDeleteProcess(item.id, item.name); 
                                    }}
                                    style={styles.deleteButtonContainer}
                                >
                                    <Text style={styles.deleteButton}>Deletar</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </Link>
                    )}
                    ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Nenhum Lifegroup cadastrado para este setor.</Text>}
                />
            )}

            {lifegroupToDelete && (
                 <ConfirmModal
                    visible={isModalVisible}
                    title="Confirmar Exclusão"
                    message={`Deseja deletar o Lifegroup "${lifegroupToDelete.name}"?`}
                    onCancel={cancelDelete}
                    onConfirm={confirmDelete}
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
    item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9', paddingVertical: 10, paddingHorizontal: 20, marginVertical: 8, marginHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
    linkArea: { flex: 1, paddingVertical: 10 },
    itemText: { fontSize: 18 },
    deleteButtonContainer: { paddingVertical: 10, paddingLeft: 20 },
    deleteButton: { color: 'red', fontSize: 14 },
    errorText: { color: 'red', margin: 16, textAlign: 'center' }
});

export default LifegroupScreen;