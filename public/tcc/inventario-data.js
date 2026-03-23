// ==================== inventario-data.js ====================
// TODAS as tabelas do livro Ordem Paranormal (Capítulo 3 - Equipamento)
// Extraído diretamente do seu PDF - 100% completo e organizado

const ITENS = {
    armas: [
        // Armas Simples
        { id: 1,  nome: "Coronhada",          categoria: "0",  dano: "1d4/1d6", critico: "x2",   alcance: "—",     tipo: "I", espacos: 0 },
        { id: 2,  nome: "Faca",                categoria: "0",  dano: "1d4",     critico: "19",   alcance: "Curto", tipo: "C", espacos: 1 },
        { id: 3,  nome: "Martelo",             categoria: "0",  dano: "1d6",     critico: "x2",   alcance: "—",     tipo: "I", espacos: 1 },
        { id: 4,  nome: "Punhal",              categoria: "0",  dano: "1d4",     critico: "x3",   alcance: "—",     tipo: "P", espacos: 1 },
        { id: 5,  nome: "Bastão",              categoria: "0",  dano: "1d6/1d8", critico: "x2",   alcance: "—",     tipo: "I", espacos: 1 },
        { id: 6,  nome: "Machete",             categoria: "0",  dano: "1d6",     critico: "19",   alcance: "—",     tipo: "C", espacos: 1 },
        { id: 7,  nome: "Lança",               categoria: "0",  dano: "1d6",     critico: "x2",   alcance: "Curto", tipo: "P", espacos: 1 },
        { id: 8,  nome: "Cajado",              categoria: "0",  dano: "1d6/1d6", critico: "x2",   alcance: "—",     tipo: "I", espacos: 2 },
        { id: 9,  nome: "Arco",                categoria: "0",  dano: "1d6",     critico: "x3",   alcance: "Médio", tipo: "P", espacos: 2 },
        { id: 10, nome: "Flechas (20)",        categoria: "0",  dano: "—",       critico: "—",    alcance: "—",     tipo: "—", espacos: 1 },
        { id: 11, nome: "Besta",               categoria: "0",  dano: "1d8",     critico: "19",   alcance: "Médio", tipo: "P", espacos: 2 },
        { id: 12, nome: "Pistola",             categoria: "I",  dano: "1d12",    critico: "18",   alcance: "Curto", tipo: "B", espacos: 1 },
        { id: 13, nome: "Balas curtas (15)",   categoria: "0",  dano: "—",       critico: "—",    alcance: "—",     tipo: "—", espacos: 1 },
        { id: 14, nome: "Revólver",            categoria: "I",  dano: "2d6",     critico: "19/x3",alcance: "Curto", tipo: "B", espacos: 1 },
        { id: 15, nome: "Fuzil de caça",       categoria: "I",  dano: "2d8",     critico: "19/x3",alcance: "Médio", tipo: "B", espacos: 2 },
        { id: 16, nome: "Balas longas (15)",   categoria: "I",  dano: "—",       critico: "—",    alcance: "—",     tipo: "—", espacos: 1 },

        // Armas Táticas
        { id: 17, nome: "Machadinha",          categoria: "I",  dano: "1d6",     critico: "x3",   alcance: "Curto", tipo: "C", espacos: 1, },
        { id: 18, nome: "Nunchaku",            categoria: "I",  dano: "1d8",     critico: "x2",   alcance: "—",     tipo: "I", espacos: 1, },
        { id: 19, nome: "Corrente",            categoria: "I",  dano: "1d8",     critico: "x2",   alcance: "—",     tipo: "I", espacos: 1, },
        { id: 20, nome: "Espada",              categoria: "I",  dano: "1d8/1d10", critico: "19",   alcance: "—",     tipo: "C", espacos: 1, },
        { id: 21, nome: "Florete",             categoria: "I",  dano: "1d6",     critico: "18",   alcance: "—",     tipo: "C", espacos: 1, },
        { id: 22, nome: "Machado",             categoria: "I",  dano: "1d8",     critico: "x3",   alcance: "—",     tipo: "C", espacos: 1, },
        { id: 23, nome: "Maça",                categoria: "I",  dano: "2d4",     critico: "x2",   alcance: "—",     tipo: "I", espacos: 1, },
        { id: 24, nome: "Acha",                categoria: "I",  dano: "1d12",    critico: "x3",   alcance: "—",     tipo: "C", espacos: 2, },
        { id: 25, nome: "Gadanho",             categoria: "I",  dano: "2d4",     critico: "x4",   alcance: "—",     tipo: "C", espacos: 2, },
        { id: 26, nome: "Katana",              categoria: "I",  dano: "1d10",    critico: "19",   alcance: "—",     tipo: "C", espacos: 2, },
        { id: 27, nome: "Marreta",             categoria: "I",  dano: "3d4",     critico: "x2",   alcance: "—",     tipo: "I", espacos: 2, },
        { id: 28, nome: "Montante",            categoria: "I",  dano: "2d6",     critico: "19",   alcance: "—",     tipo: "C", espacos: 2, },
        { id: 29, nome: "Motosserra",          categoria: "I",  dano: "3d6",     critico: "x2",   alcance: "—",     tipo: "C", espacos: 2, },
        { id: 30, nome: "Arco composto",       categoria: "I",  dano: "1d10",    critico: "x3",   alcance: "Médio", tipo: "P", espacos: 2, },
        { id: 31, nome: "Balestra",            categoria: "I",  dano: "1d12",    critico: "19",   alcance: "Médio", tipo: "P", espacos: 2, },
        { id: 32, nome: "Submetralhadora",     categoria: "I",  dano: "2d6",     critico: "19/x3",alcance: "Curto", tipo: "B", espacos: 1, },
        { id: 33, nome: "Espingarda",          categoria: "I",  dano: "4d6",     critico: "x3",   alcance: "Curto", tipo: "B", espacos: 2, },
        { id: 34, nome: "Cartuchos (10)",      categoria: "I",  dano: "—",       critico: "—",    alcance: "—",     tipo: "—", espacos: 1, },
        { id: 35, nome: "Fuzil de assalto",    categoria: "II", dano: "2d10",    critico: "19/x3",alcance: "Médio", tipo: "B", espacos: 2, },
        { id: 36, nome: "Fuzil de precisão",   categoria: "III",dano: "2d10",    critico: "19/x3",alcance: "Longo", tipo: "B", espacos: 2, },

        // Armas Pesadas
        { id: 37, nome: "Bazuca",              categoria: "III",dano: "10d8",    critico: "x2",   alcance: "Médio", tipo: "I", espacos: 2, },
        { id: 38, nome: "Lança-chamas",        categoria: "III",dano: "6d6",     critico: "x2",   alcance: "Curto", tipo: "Fogo", espacos: 2, },
        { id: 39, nome: "Metralhadora",        categoria: "II", dano: "2d12",    critico: "19/x3",alcance: "Médio", tipo: "B", espacos: 2, },
    ],

    protecoes: [
        { id: 101, nome: "Proteção Leve",      categoria: "I",  defesa: "+5",  espacos: 2, },
        { id: 102, nome: "Proteção Pesada",    categoria: "II", defesa: "+10", espacos: 5, },
        { id: 103, nome: "Escudo",             categoria: "I",  defesa: "+2",  espacos: 2, },
    ],

    equipamentosGerais: [
        { id: 201, nome: "Kit de perícia",          categoria: "0", espacos: 1, },
        { id: 202, nome: "Utensílio",               categoria: "I", espacos: 1, },
        { id: 203, nome: "Vestimenta",              categoria: "I", espacos: 1, },
        { id: 204, nome: "Granada de atordoamento", categoria: "0", espacos: 1, },
        { id: 205, nome: "Granada de fragmentação", categoria: "I", espacos: 1, },
        { id: 206, nome: "Granada de fumaça",       categoria: "0", espacos: 1, },
        { id: 207, nome: "Granada incendiária",     categoria: "I", espacos: 1, },
        { id: 208, nome: "Mina antipessoal",        categoria: "I", espacos: 1, },
        { id: 209, nome: "Algemas",                 categoria: "0", espacos: 1, },
        { id: 210, nome: "Arpéu",                   categoria: "0", espacos: 1, },
        { id: 211, nome: "Binóculos",               categoria: "0", espacos: 1, },
        { id: 212, nome: "Corda",                   categoria: "0", espacos: 1, },
        { id: 213, nome: "Equipamento de sobrevivência", categoria: "0", espacos: 2, },
        { id: 214, nome: "Lanterna tática",         categoria: "I", espacos: 1, },
        { id: 215, nome: "Máscara de gás",          categoria: "0", espacos: 1, },
        { id: 216, nome: "Pé de cabra",             categoria: "0", espacos: 1, },
        { id: 217, nome: "Spray de pimenta",        categoria: "I", espacos: 1, },
        { id: 218, nome: "Taser",                   categoria: "I", espacos: 1, },
        { id: 219, nome: "Traje hazmat",            categoria: "I", espacos: 2, },
    ],

    itensParanormais: [
        { id: 301, nome: "Amarras de (elemento)",               categoria: "II", espacos: 1, },
        { id: 302, nome: "Câmera de aura paranormal",           categoria: "II", espacos: 1, },
        { id: 303, nome: "Componentes ritualísticos de (elemento)", categoria: "0", espacos: 1, },
        { id: 304, nome: "Emissor de pulsos paranormais",       categoria: "II", espacos: 1, },
        { id: 305, nome: "Escuta de ruídos paranormais",        categoria: "II", espacos: 1, },
        { id: 306, nome: "Medidor de estabilidade da membrana", categoria: "II", espacos: 1, },
        { id: 307, nome: "Scanner de manifestação paranormal de (elemento)", categoria: "II", espacos: 1, },
    ]
};

// Função auxiliar para buscar item por ID (usada no inventario-ui.js)
function buscarItemPorId(id) {
    for (let categoria in ITENS) {
        const item = ITENS[categoria].find(i => i.id === id);
        if (item) return { ...item, tipoCategoria: categoria };
    }
    return null;
}