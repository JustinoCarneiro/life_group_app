import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView,
    TextInput, Button, TouchableOpacity, Alert
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { getPeopleByLifegroup, createPerson, deletePerson } from '../../services/api';
import ConfirmModal from '../../components/ConfirmModal';

const PeopleScreen = () => {
    const { lifegroupId, lifegroupName } = useLocalSearchParams<{ lifegroupId: string, lifegroupName: string }>();

    const [people, setPeople] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newPersonName, setNewPersonName] = useState('');

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [personToDelete, setPersonToDelete] = useState<{ id: string, name: string } | null>(null);

    const fetchPeople = useCallback(async () => {
        if (!lifegroupId) return;
        try {
            setIsLoading(true);
            setError(null);
            const data = await getPeopleByLifegroup(lifegroupId);
            setPeople(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido');
        } finally {
            setIsLoading(false);
        }
    }, [lifegroupId]);

    useEffect(() => {
        fetchPeople();
    }, [fetchPeople]);

    const handleCreatePerson = async () => {
        if (!newPersonName.trim() || !lifegroupId) {
            Alert.alert('Erro', 'O nome da pessoa não pode ser vazio.');
            return;
        }
        try {
            // CORREÇÃO: O objeto agora corresponde exatamente ao PessoaCreateDTO no Java
            const personData = { 
                name: newPersonName, 
                lifegroupId: lifegroupId 
            };
            await createPerson(personData);
            setNewPersonName('');
            fetchPeople(); // Recarrega a lista de pessoas
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível criar a pessoa.');
        }
    };
    
    const startDeleteProcess = (id: string, name: string) => {
        setPersonToDelete({ id, name });
        setIsModalVisible(true);
    };

    const confirmDelete = async () => {
        if (!personToDelete) return;
        try {
            await deletePerson(personToDelete.id);
            fetchPeople();
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível deletar a pessoa.');
        } finally {
            setIsModalVisible(false);
            setPersonToDelete(null);
        }
    };
    
    const cancelDelete = () => {
        setIsModalVisible(false);
        setPersonToDelete(null);
    };

    if (!lifegroupId) {
        return <Text>ID do LifeGroup não fornecido.</Text>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: `Membros de ${lifegroupName || 'LifeGroup'}` }} />
            
            <Text style={styles.title}>Gerir Pessoas</Text>
            <Text style={styles.subtitle}>LifeGroup: {lifegroupName}</Text>
            
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nome da nova pessoa"
                    value={newPersonName}
                    onChangeText={setNewPersonName}
                />
                <Button title="Adicionar" onPress={handleCreatePerson} />
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : error ? (
                <View style={{alignItems: 'center'}}>
                    <Text style={styles.errorText}>Erro: {error}</Text>
                    <Button title="Tentar Novamente" onPress={fetchPeople} />
                </View>
            ) : (
                <FlatList
                    data={people}
                    keyExtractor={(item: any) => item.id.toString()}
                    renderItem={({ item }: { item: any }) => (
                         <View style={styles.item}>
                            <View style={styles.linkArea}>
                                <Text style={styles.itemText}>{item.name}</Text>
                            </View>
                            <TouchableOpacity 
                                onPress={() => startDeleteProcess(item.id, item.name)}
                                style={styles.deleteButtonContainer}
                            >
                                <Text style={styles.deleteButton}>Deletar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Nenhuma pessoa cadastrada neste LifeGroup.</Text>}
                />
            )}

            {personToDelete && (
                 <ConfirmModal
                    visible={isModalVisible}
                    title="Confirmar Exclusão"
                    message={`Deseja deletar "${personToDelete.name}"?`}
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

export default PeopleScreen;