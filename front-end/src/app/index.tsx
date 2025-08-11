import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { Link } from 'expo-router';
import { buscarAreas, criarArea, deletarArea } from '../../src/services/api';
import ConfirmModal from '../components/ConfirmModal';

const TelaAreas = () => {
    const [areas, setAreas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [novoNomeArea, setNovoNomeArea] = useState('');

    const [modalDeletarVisivel, setModalDeletarVisivel] = useState(false);
    const [areaParaDeletar, setAreaParaDeletar] = useState<{ id: string, name: string } | null>(null);

    const buscarDados = useCallback(async () => {
        try {
            setCarregando(true);
            setErro(null);
            const dados = await buscarAreas();
            setAreas(dados);
        } catch (err) {
            setErro(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido');
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        buscarDados();
    }, [buscarDados]);

    const handleCriarArea = async () => {
        if (!novoNomeArea.trim()) {
            Alert.alert('Erro', 'O nome da área não pode ser vazio.');
            return;
        }
        try {
            await criarArea({ name: novoNomeArea });
            setNovoNomeArea('');
            buscarDados();
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível criar a área.');
        }
    };

    const iniciarProcessoDeletar = (id: string, name: string) => {
        setAreaParaDeletar({ id, name });
        setModalDeletarVisivel(true);
    };

    const confirmarDeletar = async () => {
        if (!areaParaDeletar) return;
        try {
            await deletarArea(areaParaDeletar.id);
            buscarDados();
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível deletar a área.');
        } finally {
            setModalDeletarVisivel(false);
            setAreaParaDeletar(null);
        }
    };

    const cancelarDeletar = () => {
        setModalDeletarVisivel(false);
        setAreaParaDeletar(null);
    };

    const renderizarItem = ({ item }: { item: any }) => (
        <View style={styles.item}>
            <Link href={{ pathname: `/setores/${item.id}`, params: { areaName: item.nome } } as any} asChild>
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
            <Text style={styles.title}>Gerir Áreas</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nome da nova área"
                    value={novoNomeArea}
                    onChangeText={setNovoNomeArea}
                />
                <Button title="Adicionar" onPress={handleCriarArea} />
            </View>
            
            {carregando ? <ActivityIndicator size="large" /> : erro ? (
                <View style={{alignItems: 'center'}}>
                    <Text style={styles.errorText}>Erro: {erro}</Text>
                    <Button title="Tentar Novamente" onPress={buscarDados} />
                </View>
            ) : (
                <FlatList
                    data={areas}
                    keyExtractor={(item: any) => item.id.toString()}
                    renderItem={renderizarItem}
                    ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Nenhuma área cadastrada.</Text>}
                />
            )}
            
            {areaParaDeletar && (
                 <ConfirmModal
                    visivel={modalDeletarVisivel}
                    titulo="Confirmar Exclusão"
                    mensagem={`Tem a certeza que deseja deletar a área "${areaParaDeletar.name}"?`}
                    aoCancelar={cancelarDeletar}
                    aoConfirmar={confirmarDeletar}
                />
            )}
        </SafeAreaView>
    );
};

export default function TelaPrincipal() {
    return <TelaAreas />;
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    title: { fontSize: 28, fontWeight: 'bold', marginTop: 20, marginBottom: 16, textAlign: 'center' },
    inputContainer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16, gap: 8 },
    input: { flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, fontSize: 16 },
    item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9', paddingVertical: 10, paddingHorizontal: 20, marginVertical: 8, marginHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
    linkArea: { flex: 1, paddingVertical: 10 },
    itemText: { fontSize: 18 },
    deleteButtonContainer: { paddingVertical: 10, paddingLeft: 20 },
    deleteButton: { color: 'red', fontSize: 14 },
    errorText: { color: 'red', margin: 16, textAlign: 'center' }
});