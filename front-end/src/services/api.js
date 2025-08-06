// A URL base da sua API rodando no Codespaces
const API_URL = 'https://fluffy-sniffle-4j7g65q45pw5c7x5q-8080.app.github.dev';

// Função para buscar todas as áreas
export const getAreas = async () => {
    const response = await fetch(`${API_URL}/api/areas`);
    if (!response.ok) {
        throw new Error('Falha ao buscar áreas');
    }
    return response.json();
};

// Função para criar uma nova área
export const createArea = async (areaData) => {
    const response = await fetch(`${API_URL}/api/areas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(areaData),
    });
    if (!response.ok) {
        throw new Error('Falha ao criar área');
    }
    return response.json();
};

// Função para deletar uma área
export const deleteArea = async (areaId) => {
    const response = await fetch(`${API_URL}/api/areas/${areaId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Falha ao deletar área');
    }
};