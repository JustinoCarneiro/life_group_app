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

export const getSectorsByArea = async (areaId) => {
    const response = await fetch(`${API_URL}/api/setores/por-area/${areaId}`);
    if (!response.ok) {
        throw new Error('Falha ao buscar setores');
    }
    return response.json();
};

export const createSector = async (sectorData) => {
    const response = await fetch(`${API_URL}/api/setores`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectorData),
    });
    if (!response.ok) {
        throw new Error('Falha ao criar setor');
    }
    return response.json();
};

export const deleteSector = async (sectorId) => {
    const response = await fetch(`${API_URL}/api/setores/${sectorId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Falha ao deletar setor');
    }
};

export const getLifegroupsBySector = async (sectorId) => {
    const response = await fetch(`${API_URL}/api/lifegroups/por-setor/${sectorId}`);
    if (!response.ok) {
        throw new Error('Falha ao buscar lifegroups');
    }
    return response.json();
};

export const createLifegroup = async (lifegroupData) => {
    const response = await fetch(`${API_URL}/api/lifegroups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lifegroupData),
    });
    if (!response.ok) {
        throw new Error('Falha ao criar lifegroup');
    }
    return response.json();
};

export const deleteLifegroup = async (lifegroupId) => {
    const response = await fetch(`${API_URL}/api/lifegroups/${lifegroupId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Falha ao deletar lifegroup');
    }
};

export const getPeopleByLifegroup = async (lifegroupId) => {
    const response = await fetch(`${API_URL}/api/pessoas/por-lifegroup/${lifegroupId}`);
    if (!response.ok) {
        throw new Error('Falha ao buscar pessoas');
    }
    return response.json();
};

export const createPerson = async (personData) => {
    const response = await fetch(`${API_URL}/api/pessoas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personData),
    });
    if (!response.ok) {
        throw new Error('Falha ao criar pessoa');
    }
    return response.json();
};

export const deletePerson = async (personId) => {
    const response = await fetch(`${API_URL}/api/pessoas/${personId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Falha ao deletar pessoa');
    }
};