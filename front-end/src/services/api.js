// A URL base da sua API rodando no Codespaces. Verifique se ainda é a mesma.
const API_URL = 'https://fluffy-sniffle-4j7g65q45pw5c7x5q-8080.app.github.dev';

// --- Funções para Áreas ---

export const buscarAreas = async () => {
    const resposta = await fetch(`${API_URL}/api/areas`);
    if (!resposta.ok) throw new Error('Falha ao buscar áreas');
    return resposta.json();
};

export const criarArea = async (dadosArea) => {
    const resposta = await fetch(`${API_URL}/api/areas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Enviamos a chave 'name' em inglês, como esperado pelo @JsonProperty no DTO
        body: JSON.stringify({ name: dadosArea.name }),
    });
    if (!resposta.ok) throw new Error('Falha ao criar área');
    return resposta.json();
};

export const deletarArea = async (idArea) => {
    const resposta = await fetch(`${API_URL}/api/areas/${idArea}`, { method: 'DELETE' });
    if (!resposta.ok) throw new Error('Falha ao deletar área');
};

// --- Funções para Setores ---

export const buscarSetoresPorArea = async (idArea) => {
    const resposta = await fetch(`${API_URL}/api/setores/por-area/${idArea}`);
    if (!resposta.ok) throw new Error('Falha ao buscar setores');
    return resposta.json();
};

export const criarSetor = async (dadosSetor) => {
    const resposta = await fetch(`${API_URL}/api/setores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Enviamos 'name' e 'areaId', como esperado pelo DTO
        body: JSON.stringify({ name: dadosSetor.name, areaId: dadosSetor.areaId }),
    });
    if (!resposta.ok) throw new Error('Falha ao criar setor');
    return resposta.json();
};

export const deletarSetor = async (idSetor) => {
    const resposta = await fetch(`${API_URL}/api/setores/${idSetor}`, { method: 'DELETE' });
    if (!resposta.ok) throw new Error('Falha ao deletar setor');
};

// --- Funções para LifeGroups ---

export const buscarLifeGroupsPorSetor = async (idSetor) => {
    const resposta = await fetch(`${API_URL}/api/lifegroups/por-setor/${idSetor}`);
    if (!resposta.ok) throw new Error('Falha ao buscar lifegroups');
    return resposta.json();
};

export const criarLifeGroup = async (dadosLifeGroup) => {
    const resposta = await fetch(`${API_URL}/api/lifegroups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Enviamos 'name' e 'sectorId', como esperado pelo DTO
        body: JSON.stringify({ name: dadosLifeGroup.name, sectorId: dadosLifeGroup.sectorId }),
    });
    if (!resposta.ok) throw new Error('Falha ao criar lifegroup');
    return resposta.json();
};

export const deletarLifeGroup = async (idLifeGroup) => {
    const resposta = await fetch(`${API_URL}/api/lifegroups/${idLifeGroup}`, { method: 'DELETE' });
    if (!resposta.ok) throw new Error('Falha ao deletar lifegroup');
};

// --- Funções para Pessoas ---

export const buscarPessoasPorLifeGroup = async (idLifeGroup) => {
    const resposta = await fetch(`${API_URL}/api/pessoas/por-lifegroup/${idLifeGroup}`);
    if (!resposta.ok) throw new Error('Falha ao buscar pessoas');
    return resposta.json();
};

export const criarPessoa = async (dadosPessoa) => {
    const resposta = await fetch(`${API_URL}/api/pessoas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Enviamos 'name' e 'lifegroupId', como esperado pelo DTO
        body: JSON.stringify({ name: dadosPessoa.name, lifegroupId: dadosPessoa.lifegroupId }),
    });
    if (!resposta.ok) throw new Error('Falha ao criar pessoa');
    return resposta.json();
};

export const deletarPessoa = async (idPessoa) => {
    const resposta = await fetch(`${API_URL}/api/pessoas/${idPessoa}`, { method: 'DELETE' });
    if (!resposta.ok) throw new Error('Falha ao deletar pessoa');
};

export const atualizarPessoa = async (idPessoa, dadosPessoa) => {
    const resposta = await fetch(`${API_URL}/api/pessoas/${idPessoa}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // Enviamos os campos em inglês, como esperado pelo DTO de atualização
        body: JSON.stringify({
            name: dadosPessoa.name,
            contact: dadosPessoa.contact,
            address: dadosPessoa.address,
            birth_date: dadosPessoa.birth_date,
        }),
    });
    if (!resposta.ok) throw new Error('Falha ao atualizar pessoa');
    return resposta.json();
};