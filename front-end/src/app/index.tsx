import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView,
    TextInput, Button, TouchableOpacity
} from 'react-native';
import { getAreas, createArea, deleteArea } from '../../src/services/api';
import ConfirmModal from '../components/ConfirmModal';
import { Link } from 'expo-router';

const AreaScreen = () => {
    const [areas, setAreas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newAreaName, setNewAreaName] = useState('');

    // 2. Estados para controlar o modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [areaToDelete, setAreaToDelete] = useState<{ id: string, name: string } | null>(null);

    const fetchAreas = useCallback(async () => {
        // ... (esta função continua a mesma)
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
        // ... (esta função continua a mesma)
        if (!newAreaName.trim()) {
            alert('O nome da área não pode ser vazio.'); // Alert simples para web funciona bem
            return;
        }
        try {
            await createArea({ name: newAreaName });
            setNewAreaName('');
            fetchAreas();
        } catch (err) {
            alert('Não foi possível criar a área.');
        }
    };

    // 3. Função para INICIAR a exclusão (apenas abre o modal)
    const startDeleteProcess = (id: string, name: string) => {
        setAreaToDelete({ id, name });
        setIsModalVisible(true);
    };

    // 4. Função para CONFIRMAR a exclusão (chamada pelo modal)
    const confirmDelete = async () => {
        if (!areaToDelete) return;
        try {
            await deleteArea(areaToDelete.id);
            fetchAreas();
        } catch (err) {
            alert('Não foi possível deletar a área.');
        } finally {
            setIsModalVisible(false);
            setAreaToDelete(null);
        }
    };

    // 5. Função para CANCELAR a exclusão
    const cancelDelete = () => {
        setIsModalVisible(false);
        setAreaToDelete(null);
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
                        <Link 
                            href={{ 
                                pathname: `/setores/${item.id}`, 
                                params: { areaName: item.name } 
                            } as any}
                            asChild
                        >
                            <TouchableOpacity style={styles.linkArea}>
                                <Text style={styles.itemText}>{item.name}</Text>
                            </TouchableOpacity>
                        </Link>

                        <TouchableOpacity 
                            onPress={() => startDeleteProcess(item.id, item.name)}
                            style={styles.deleteButtonContainer}
                        >
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
                    placeholder="Nome da nova área"
                    value={newAreaName}
                    onChangeText={setNewAreaName}
                />
                <Button title="Adicionar" onPress={handleCreateArea} />
            </View>
            
            {renderContent()}

            {/* 7. Renderize o modal aqui */}
            {areaToDelete && (
                 <ConfirmModal
                    visible={isModalVisible}
                    title="Confirmar Exclusão"
                    message={`Você tem certeza que deseja deletar a área "${areaToDelete.name}"?`}
                    onCancel={cancelDelete}
                    onConfirm={confirmDelete}
                />
            )}
        </SafeAreaView>
    );
};

export default function HomeScreen() {
    return <AreaScreen />;
}

// Os estilos (styles) continuam os mesmos
// Os estilos (styles) continuam os mesmos, apenas adicione estes novos
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', marginTop: 20, marginBottom: 16, textAlign: 'center' },
    inputContainer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16, gap: 8 },
    input: { flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, fontSize: 16 },
    // Estilo do item principal modificado
    item: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#f9f9f9', 
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 8, 
        marginHorizontal: 16, 
        borderRadius: 8, 
        borderWidth: 1, 
        borderColor: '#eee' 
    },
    // Novo estilo para a área clicável do link
    linkArea: {
        flex: 1,
        paddingVertical: 10, // Garante que a área de toque seja grande
    },
    itemText: { fontSize: 18 },
    // Novo estilo para o container do botão de apagar
    deleteButtonContainer: {
        paddingVertical: 10,
        paddingLeft: 20, // Aumenta a área de toque
    },
    deleteButton: { color: 'red', fontSize: 14 },
    errorText: { color: 'red', margin: 16, textAlign: 'center' }
});