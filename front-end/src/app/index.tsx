import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView,
    TextInput, Button, TouchableOpacity, Alert
} from 'react-native';
import { getAreas, createArea, deleteArea } from '../services/api'; // Importando nosso serviço de API

const AreaScreen = () => {
    const [areas, setAreas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newAreaName, setNewAreaName] = useState('');

    const fetchAreas = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getAreas();
            setAreas(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocorreu um erro desconhecido');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAreas();
    }, [fetchAreas]);

    const handleCreateArea = async () => {
        if (!newAreaName.trim()) {
            Alert.alert('Erro', 'O nome da área não pode ser vazio.');
            return;
        }
        try {
            await createArea({ name: newAreaName });
            setNewAreaName('');
            fetchAreas();
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível criar a área.');
        }
    };

    const handleDeleteArea = (areaId: string, areaName: string) => {
        Alert.alert(
            'Confirmar Exclusão',
            `Você tem certeza que deseja deletar a área "${areaName}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Deletar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteArea(areaId);
                            fetchAreas();
                        } catch (err) {
                            Alert.alert('Erro', 'Não foi possível deletar a área.');
                        }
                    },
                },
            ]
        );
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text>Carregando Áreas...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.centered}>
                    <Text style={styles.errorText}>Erro: {error}</Text>
                    <Button title="Tentar Novamente" onPress={fetchAreas} />
                </View>
            );
        }

        return (
            <FlatList
                data={areas}
                keyExtractor={(item: any) => item.id.toString()}
                renderItem={({ item }: { item: any }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemText}>{item.name}</Text>
                        <TouchableOpacity onPress={() => handleDeleteArea(item.id, item.name)}>
                            <Text style={styles.deleteButton}>Deletar</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Nenhuma área cadastrada.</Text>}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Gerenciar Áreas</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nome da nova áreas"
                    value={newAreaName}
                    onChangeText={setNewAreaName}
                />
                <Button title="Adicionar" onPress={handleCreateArea} />
            </View>
            {renderContent()}
        </SafeAreaView>
    );
};

export default function Index() {
    return <AreaScreen />;
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', marginTop: 20, marginBottom: 16, textAlign: 'center' },
    inputContainer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16, gap: 8 },
    input: { flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, fontSize: 16 },
    item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 20, marginVertical: 8, marginHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
    itemText: { fontSize: 18 },
    deleteButton: { color: 'red', fontSize: 14 },
    errorText: { color: 'red', margin: 16, textAlign: 'center' }
});