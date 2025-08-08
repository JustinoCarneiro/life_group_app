import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
// A correção está na linha abaixo
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { getSectorsByArea, createSector, deleteSector } from '../../services/api';
import ConfirmModal from '../../components/ConfirmModal';

const SectorScreen = () => {
    const { areaId, areaName } = useLocalSearchParams<{ areaId: string, areaName: string }>();
    const [sectors, setSectors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newSectorName, setNewSectorName] = useState('');

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [sectorToDelete, setSectorToDelete] = useState<{ id: string, name: string } | null>(null);

    const fetchSectors = useCallback(async () => {
        if (!areaId) return;
        try {
            setIsLoading(true);
            setError(null);
            const data = await getSectorsByArea(areaId);
            setSectors(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido');
        } finally {
            setIsLoading(false);
        }
    }, [areaId]);

    useEffect(() => {
        fetchSectors();
    }, [fetchSectors]);

    const handleCreateSector = async () => {
        if (!newSectorName.trim() || !areaId) return;
        try {
            const sectorData = { name: newSectorName, area: { id: areaId } };
            await createSector(sectorData);
            setNewSectorName('');
            fetchSectors();
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível criar o setor.');
        }
    };
    
    const startDeleteProcess = (id: string, name: string) => {
        setSectorToDelete({ id, name });
        setIsModalVisible(true);
    };

    const confirmDelete = async () => {
        if (!sectorToDelete) return;
        try {
            await deleteSector(sectorToDelete.id);
            fetchSectors();
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível deletar o setor.');
        } finally {
            setIsModalVisible(false);
            setSectorToDelete(null);
        }
    };
    
    const cancelDelete = () => {
        setIsModalVisible(false);
        setSectorToDelete(null);
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
                    value={newSectorName}
                    onChangeText={setNewSectorName}
                />
                <Button title="Adicionar" onPress={handleCreateSector} />
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : error ? (
                <View style={{alignItems: 'center'}}>
                    <Text style={styles.errorText}>Erro: {error}</Text>
                    <Button title="Tentar Novamente" onPress={fetchSectors} />
                </View>
            ) : (
                <FlatList
                    data={sectors}
                    keyExtractor={(item: any) => item.id.toString()}
                    renderItem={({ item }: { item: any }) => (
                        <Link 
                            href={{ 
                                pathname: `/lifegroups/${item.id}`, 
                                params: { sectorName: item.name } 
                            } as any} 
                            asChild
                        >
                            <TouchableOpacity style={styles.item}>
                                <Text style={styles.itemText}>{item.name}</Text>
                                <TouchableOpacity 
                                    onPress={(e) => { 
                                        e.preventDefault(); 
                                        startDeleteProcess(item.id, item.name); 
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

            {sectorToDelete && (
                 <ConfirmModal
                    visible={isModalVisible}
                    title="Confirmar Exclusão"
                    message={`Deseja deletar o setor "${sectorToDelete.name}"?`}
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
    item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 20, marginVertical: 8, marginHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
    itemText: { fontSize: 18 },
    deleteButton: { color: 'red', fontSize: 14 },
    errorText: { color: 'red', margin: 16, textAlign: 'center' }
});

export default SectorScreen;