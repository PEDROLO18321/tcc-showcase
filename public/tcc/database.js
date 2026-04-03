// ==================== database.js ====================
// Módulo de banco de dados SQLite no navegador usando sql.js + IndexedDB
// Persistência local de fichas, origens, perícias, itens, rituais e itens amaldiçoados

const DB_NAME = "LabFichasDB";
const DB_STORE = "sqlitedb";
const DB_VERSION = 1;

let db = null;
let dbReady = false;

// ====================== INICIALIZAÇÃO ======================

async function inicializarBancoDeDados() {
    try {
        // Carrega sql.js via CDN
        const SQL = await initSqlJs({
            locateFile: file => `https://sql.js.org/dist/${file}`
        });

        // Tenta carregar banco salvo do IndexedDB
        const dadosSalvos = await carregarDoIndexedDB();

        if (dadosSalvos) {
            db = new SQL.Database(new Uint8Array(dadosSalvos));
            console.log("✅ Banco de dados carregado do IndexedDB");
        } else {
            db = new SQL.Database();
            console.log("✅ Novo banco de dados criado");
        }

        // Cria/atualiza estrutura de tabelas
        criarTabelas();

        // Popula dados iniciais se tabelas estiverem vazias
        popularDadosIniciais();

        // Salva no IndexedDB
        await salvarNoIndexedDB();

        dbReady = true;
        console.log("✅ Banco de dados SQLite inicializado com sucesso!");

        // Dispara evento para avisar que o DB está pronto
        window.dispatchEvent(new Event('db-ready'));

        return db;
    } catch (erro) {
        console.error("❌ Erro ao inicializar banco de dados:", erro);
        dbReady = false;
        return null;
    }
}

// ====================== INDEXEDDB (PERSISTÊNCIA) ======================

function abrirIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
            const idb = e.target.result;
            if (!idb.objectStoreNames.contains(DB_STORE)) {
                idb.createObjectStore(DB_STORE);
            }
        };
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

async function salvarNoIndexedDB() {
    if (!db) return;
    const dados = db.export();
    const buffer = dados.buffer;
    const idb = await abrirIndexedDB();
    return new Promise((resolve, reject) => {
        const tx = idb.transaction(DB_STORE, "readwrite");
        tx.objectStore(DB_STORE).put(buffer, "banco");
        tx.oncomplete = () => resolve();
        tx.onerror = (e) => reject(e.target.error);
    });
}

async function carregarDoIndexedDB() {
    try {
        const idb = await abrirIndexedDB();
        return new Promise((resolve, reject) => {
            const tx = idb.transaction(DB_STORE, "readonly");
            const req = tx.objectStore(DB_STORE).get("banco");
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => resolve(null);
        });
    } catch {
        return null;
    }
}

// ====================== CRIAÇÃO DE TABELAS ======================

function criarTabelas() {
    db.run(`
        CREATE TABLE IF NOT EXISTS origens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chave TEXT UNIQUE NOT NULL,
            nome TEXT NOT NULL,
            pericias TEXT,
            poder_nome TEXT,
            poder_descricao TEXT,
            poder_tipo TEXT,
            poder_custo TEXT,
            dados_completos TEXT
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS pericias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT UNIQUE NOT NULL,
            atributo TEXT NOT NULL
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS itens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            tipo TEXT NOT NULL,
            categoria TEXT DEFAULT '0',
            dano TEXT,
            critico TEXT,
            alcance TEXT,
            tipo_dano TEXT,
            espacos INTEGER DEFAULT 1,
            defesa TEXT,
            descricao TEXT,
            dados_completos TEXT
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS rituais (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ritual_id INTEGER UNIQUE,
            nome TEXT NOT NULL,
            elemento TEXT,
            circulo INTEGER DEFAULT 1,
            custo INTEGER DEFAULT 1,
            execucao TEXT,
            alcance TEXT,
            alvo TEXT,
            duracao TEXT,
            resistencia TEXT,
            descricao TEXT,
            formas TEXT,
            personalizado INTEGER DEFAULT 0
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS itens_amaldicoados (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chave TEXT UNIQUE,
            nome TEXT NOT NULL,
            tipo TEXT NOT NULL,
            elemento TEXT,
            descricao TEXT,
            dados_completos TEXT
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS fichas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL DEFAULT 'Sem Nome',
            sistema TEXT DEFAULT 'ordem_paranormal',
            origem TEXT,
            classe TEXT,
            nex INTEGER DEFAULT 5,
            nivel INTEGER DEFAULT 1,
            modo TEXT DEFAULT 'nex',
            atributos TEXT,
            status_atuais TEXT,
            pericias_treino TEXT,
            inventario TEXT,
            rituais_equipados TEXT,
            itens_amaldicoados_equipados TEXT,
            patente TEXT DEFAULT 'recruta',
            anotacoes TEXT,
            data_criacao TEXT,
            data_modificacao TEXT
        );
    `);

    console.log("✅ Tabelas criadas/verificadas");
}

// ====================== POPULAR DADOS INICIAIS ======================

function popularDadosIniciais() {
    // Verifica se já tem dados
    const countOrigens = db.exec("SELECT COUNT(*) FROM origens")[0]?.values[0][0] || 0;
    if (countOrigens > 0) {
        console.log("📦 Dados já existem no banco");
        return;
    }

    console.log("📝 Populando dados iniciais...");

    // --- ORIGENS ---
    if (typeof ORIGENS !== 'undefined') {
        const stmt = db.prepare("INSERT OR IGNORE INTO origens (chave, nome, pericias, poder_nome, poder_descricao, poder_tipo, poder_custo, dados_completos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        for (const [chave, origem] of Object.entries(ORIGENS)) {
            stmt.run([
                chave,
                origem.nome,
                JSON.stringify(origem.pericias || []),
                origem.poder?.nome || '',
                origem.poder?.descricao || '',
                origem.poder?.tipo || '',
                JSON.stringify(origem.poder?.custo || {}),
                JSON.stringify(origem, (key, value) => typeof value === 'function' ? undefined : value)
            ]);
        }
        stmt.free();
    }

    // --- PERÍCIAS ---
    if (typeof PERICIAS !== 'undefined') {
        const stmt = db.prepare("INSERT OR IGNORE INTO pericias (nome, atributo) VALUES (?, ?)");
        PERICIAS.forEach(p => {
            stmt.run([p.nome, p.atributo]);
        });
        stmt.free();
    }

    // --- ITENS (ARMAS) ---
    if (typeof ITENS !== 'undefined') {
        const stmt = db.prepare("INSERT OR IGNORE INTO itens (nome, tipo, categoria, dano, critico, alcance, tipo_dano, espacos, defesa, dados_completos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        if (ITENS.armas) {
            ITENS.armas.forEach(item => {
                stmt.run([item.nome, 'arma', item.categoria || '0', item.dano || '', item.critico || '', item.alcance || '', item.tipo || '', item.espacos || 1, null, JSON.stringify(item)]);
            });
        }
        if (ITENS.protecoes) {
            ITENS.protecoes.forEach(item => {
                stmt.run([item.nome, 'protecao', item.categoria || '0', null, null, null, null, item.espacos || 1, item.defesa || '', JSON.stringify(item)]);
            });
        }
        if (ITENS.equipamentos) {
            ITENS.equipamentos.forEach(item => {
                stmt.run([item.nome, 'equipamento', item.categoria || '0', null, null, null, null, item.espacos || 1, null, JSON.stringify(item)]);
            });
        }
        if (ITENS.paranormais) {
            ITENS.paranormais.forEach(item => {
                stmt.run([item.nome, 'paranormal', item.categoria || '0', null, null, null, null, item.espacos || 1, null, JSON.stringify(item)]);
            });
        }
        stmt.free();
    }

    // --- RITUAIS ---
    if (typeof RITUAIS !== 'undefined') {
        const stmt = db.prepare("INSERT OR IGNORE INTO rituais (ritual_id, nome, elemento, circulo, custo, execucao, alcance, alvo, duracao, resistencia, descricao, formas, personalizado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        RITUAIS.forEach(r => {
            stmt.run([
                r.id, r.nome, r.elemento || '', r.circulo || 1, r.custo || 1,
                r.execucao || '', r.alcance || '', r.alvo || '', r.duracao || '',
                r.resistencia || '', r.descricao || '', JSON.stringify(r.formas || {}), 0
            ]);
        });
        stmt.free();
    }

    // --- ITENS AMALDIÇOADOS ---
    if (typeof MALDICOES_ARMAS !== 'undefined') {
        const stmt = db.prepare("INSERT OR IGNORE INTO itens_amaldicoados (chave, nome, tipo, elemento, descricao, dados_completos) VALUES (?, ?, ?, ?, ?, ?)");
        MALDICOES_ARMAS.forEach(m => {
            stmt.run([m.id, m.nome, 'arma', m.elemento || '', m.descricao || '', JSON.stringify(m)]);
        });
        stmt.free();
    }
    if (typeof MALDICOES_PROTECOES !== 'undefined') {
        const stmt = db.prepare("INSERT OR IGNORE INTO itens_amaldicoados (chave, nome, tipo, elemento, descricao, dados_completos) VALUES (?, ?, ?, ?, ?, ?)");
        MALDICOES_PROTECOES.forEach(m => {
            stmt.run([m.id, m.nome, 'protecao', m.elemento || '', m.descricao || '', JSON.stringify(m)]);
        });
        stmt.free();
    }
    if (typeof ITENS_ESPECIAIS !== 'undefined') {
        const stmt = db.prepare("INSERT OR IGNORE INTO itens_amaldicoados (chave, nome, tipo, elemento, descricao, dados_completos) VALUES (?, ?, ?, ?, ?, ?)");
        ITENS_ESPECIAIS.forEach(m => {
            stmt.run([m.id, m.nome, 'especial', m.elemento || '', m.descricao || '', JSON.stringify(m)]);
        });
        stmt.free();
    }

    salvarNoIndexedDB();
    console.log("✅ Dados iniciais populados no banco");
}

// ====================== FUNÇÕES DE CONSULTA ======================

// Consulta genérica
function consultarSQL(query, params = []) {
    if (!db) return [];
    try {
        const resultado = db.exec(query, params);
        if (!resultado.length) return [];
        const colunas = resultado[0].columns;
        return resultado[0].values.map(row => {
            const obj = {};
            colunas.forEach((col, i) => obj[col] = row[i]);
            return obj;
        });
    } catch (e) {
        console.error("Erro SQL:", e.message, query);
        return [];
    }
}

// Buscar todas as origens
function dbBuscarOrigens() {
    return consultarSQL("SELECT * FROM origens ORDER BY nome");
}

// Buscar todas as perícias
function dbBuscarPericias() {
    return consultarSQL("SELECT * FROM pericias ORDER BY nome");
}

// Buscar itens por tipo
function dbBuscarItens(tipo = null) {
    if (tipo) {
        return consultarSQL("SELECT * FROM itens WHERE tipo = ? ORDER BY nome", [tipo]);
    }
    return consultarSQL("SELECT * FROM itens ORDER BY tipo, nome");
}

// Buscar rituais com filtros
function dbBuscarRituais(filtros = {}) {
    let query = "SELECT * FROM rituais WHERE 1=1";
    const params = [];

    if (filtros.circulo) {
        query += " AND circulo = ?";
        params.push(filtros.circulo);
    }
    if (filtros.elemento) {
        query += " AND elemento = ?";
        params.push(filtros.elemento);
    }
    if (filtros.busca) {
        query += " AND (nome LIKE ? OR descricao LIKE ?)";
        params.push(`%${filtros.busca}%`, `%${filtros.busca}%`);
    }

    query += " ORDER BY circulo, nome";
    return consultarSQL(query, params);
}

// Buscar itens amaldiçoados
function dbBuscarItensAmaldicoados(tipo = null) {
    if (tipo) {
        return consultarSQL("SELECT * FROM itens_amaldicoados WHERE tipo = ? ORDER BY nome", [tipo]);
    }
    return consultarSQL("SELECT * FROM itens_amaldicoados ORDER BY tipo, nome");
}

// ====================== FICHAS - SALVAR / CARREGAR / EXPORTAR ======================

function dbSalvarFicha(dadosFicha) {
    if (!db) {
        console.warn("Banco não inicializado, usando localStorage como fallback");
        localStorage.setItem("fichaAtual", JSON.stringify(dadosFicha));
        return null;
    }

    const agora = new Date().toISOString();

    if (dadosFicha.id) {
        // Atualiza ficha existente
        db.run(`UPDATE fichas SET 
            nome = ?, origem = ?, classe = ?, nex = ?, nivel = ?, modo = ?,
            atributos = ?, status_atuais = ?, pericias_treino = ?,
            inventario = ?, rituais_equipados = ?, itens_amaldicoados_equipados = ?,
            patente = ?, anotacoes = ?, data_modificacao = ?
            WHERE id = ?`, [
            dadosFicha.nome || 'Sem Nome',
            dadosFicha.origem || '',
            dadosFicha.classe || '',
            dadosFicha.nex || 5,
            dadosFicha.nivel || 1,
            dadosFicha.modo || 'nex',
            JSON.stringify(dadosFicha.atributos || {}),
            JSON.stringify(dadosFicha.status_atuais || {}),
            JSON.stringify(dadosFicha.pericias_treino || []),
            JSON.stringify(dadosFicha.inventario || []),
            JSON.stringify(dadosFicha.rituais_equipados || []),
            JSON.stringify(dadosFicha.itens_amaldicoados_equipados || []),
            dadosFicha.patente || 'recruta',
            dadosFicha.anotacoes || '',
            agora,
            dadosFicha.id
        ]);
    } else {
        // Nova ficha
        db.run(`INSERT INTO fichas (nome, sistema, origem, classe, nex, nivel, modo,
            atributos, status_atuais, pericias_treino, inventario,
            rituais_equipados, itens_amaldicoados_equipados, patente, anotacoes,
            data_criacao, data_modificacao)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            dadosFicha.nome || 'Sem Nome',
            'ordem_paranormal',
            dadosFicha.origem || '',
            dadosFicha.classe || '',
            dadosFicha.nex || 5,
            dadosFicha.nivel || 1,
            dadosFicha.modo || 'nex',
            JSON.stringify(dadosFicha.atributos || {}),
            JSON.stringify(dadosFicha.status_atuais || {}),
            JSON.stringify(dadosFicha.pericias_treino || []),
            JSON.stringify(dadosFicha.inventario || []),
            JSON.stringify(dadosFicha.rituais_equipados || []),
            JSON.stringify(dadosFicha.itens_amaldicoados_equipados || []),
            dadosFicha.patente || 'recruta',
            dadosFicha.anotacoes || '',
            agora, agora
        ]);
    }

    salvarNoIndexedDB();
    const ultimoId = db.exec("SELECT last_insert_rowid()")[0]?.values[0][0];
    return dadosFicha.id || ultimoId;
}

function dbCarregarFicha(id) {
    const fichas = consultarSQL("SELECT * FROM fichas WHERE id = ?", [id]);
    if (!fichas.length) return null;

    const ficha = fichas[0];
    // Parse JSON fields
    try { ficha.atributos = JSON.parse(ficha.atributos || '{}'); } catch { ficha.atributos = {}; }
    try { ficha.status_atuais = JSON.parse(ficha.status_atuais || '{}'); } catch { ficha.status_atuais = {}; }
    try { ficha.pericias_treino = JSON.parse(ficha.pericias_treino || '[]'); } catch { ficha.pericias_treino = []; }
    try { ficha.inventario = JSON.parse(ficha.inventario || '[]'); } catch { ficha.inventario = []; }
    try { ficha.rituais_equipados = JSON.parse(ficha.rituais_equipados || '[]'); } catch { ficha.rituais_equipados = []; }
    try { ficha.itens_amaldicoados_equipados = JSON.parse(ficha.itens_amaldicoados_equipados || '[]'); } catch { ficha.itens_amaldicoados_equipados = []; }

    return ficha;
}

function dbListarFichas() {
    return consultarSQL("SELECT id, nome, classe, origem, nex, data_modificacao FROM fichas ORDER BY data_modificacao DESC");
}

function dbExcluirFicha(id) {
    if (!db) return false;
    db.run("DELETE FROM fichas WHERE id = ?", [id]);
    salvarNoIndexedDB();
    return true;
}

// ====================== EXPORTAR / IMPORTAR ======================

function dbExportarFichaJSON(id) {
    const ficha = dbCarregarFicha(id);
    if (!ficha) return null;

    const json = JSON.stringify(ficha, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `ficha_${ficha.nome.replace(/\s+/g, '_')}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    return true;
}

function dbImportarFichaJSON(arquivo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const dados = JSON.parse(e.target.result);
                // Remove ID para criar nova ficha
                delete dados.id;
                dados.nome = dados.nome ? dados.nome + " (importada)" : "Ficha Importada";

                const novoId = dbSalvarFicha(dados);
                resolve({ sucesso: true, id: novoId, nome: dados.nome });
            } catch (err) {
                reject({ sucesso: false, erro: "Arquivo JSON inválido: " + err.message });
            }
        };
        reader.onerror = () => reject({ sucesso: false, erro: "Erro ao ler arquivo" });
        reader.readAsText(arquivo);
    });
}

function dbExportarBancoCompleto() {
    if (!db) return;
    const dados = db.export();
    const blob = new Blob([dados], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `labfichas_backup_${Date.now()}.db`;
    a.click();
    URL.revokeObjectURL(url);
}

async function dbImportarBancoCompleto(arquivo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const SQL = await initSqlJs({
                    locateFile: file => `https://sql.js.org/dist/${file}`
                });
                const buffer = new Uint8Array(e.target.result);
                db = new SQL.Database(buffer);
                await salvarNoIndexedDB();
                dbReady = true;
                resolve({ sucesso: true });
            } catch (err) {
                reject({ sucesso: false, erro: err.message });
            }
        };
        reader.readAsArrayBuffer(arquivo);
    });
}

// ====================== ESTATÍSTICAS DO BANCO ======================

function dbEstatisticas() {
    if (!db) return null;
    return {
        origens: (db.exec("SELECT COUNT(*) FROM origens")[0]?.values[0][0]) || 0,
        pericias: (db.exec("SELECT COUNT(*) FROM pericias")[0]?.values[0][0]) || 0,
        itens: (db.exec("SELECT COUNT(*) FROM itens")[0]?.values[0][0]) || 0,
        rituais: (db.exec("SELECT COUNT(*) FROM rituais")[0]?.values[0][0]) || 0,
        itens_amaldicoados: (db.exec("SELECT COUNT(*) FROM itens_amaldicoados")[0]?.values[0][0]) || 0,
        fichas: (db.exec("SELECT COUNT(*) FROM fichas")[0]?.values[0][0]) || 0
    };
}

// ====================== HELPER: COLETAR DADOS DA FICHA ATUAL ======================

function coletarDadosFichaAtual() {
    const dados = {
        nome: document.getElementById("nome-personagem")?.value || "Sem Nome",
        origem: typeof origemSelecionada !== 'undefined' && origemSelecionada ? origemSelecionada.nome : "",
        classe: typeof obterClasse === 'function' ? obterClasse() : "",
        nex: Number(document.getElementById("nex")?.value) || 5,
        nivel: Number(document.getElementById("nivel")?.value) || 1,
        modo: document.querySelector('input[name="modo"]:checked')?.value || "nex",
        atributos: typeof obterAtributos === 'function' ? obterAtributos() : {},
        status_atuais: {
            vida_atual: Number(document.getElementById("vida_atual")?.value) || 0,
            esforco_atual: Number(document.getElementById("esforco_atual")?.value) || 0,
            sanidade_atual: Number(document.getElementById("sanidade_atual")?.value) || 0,
            determinacao_atual: Number(document.getElementById("determinacao_atual")?.value) || 0
        },
        pericias_treino: coletarPericiasTreino(),
        inventario: typeof inventarioAtual !== 'undefined' ? inventarioAtual : [],
        rituais_equipados: typeof rituaisEquipados !== 'undefined' ? rituaisEquipados : [],
        itens_amaldicoados_equipados: typeof amaldicoadosEquipados !== 'undefined' ? amaldicoadosEquipados : [],
        patente: document.getElementById("patente-select")?.value || "recruta",
        anotacoes: document.getElementById("anotacoes")?.value || ""
    };

    return dados;
}

function coletarPericiasTreino() {
    const pericias = [];
    const container = document.getElementById("pericias");
    if (!container) return pericias;

    const linhas = container.children;
    for (let i = 0; i < linhas.length; i++) {
        const treino = linhas[i].querySelector('input[type="radio"]:checked')?.value || "destreinado";
        const bonus = Number(linhas[i].querySelector('input[type="number"]')?.value) || 0;
        pericias.push({ indice: i, treino, bonus });
    }
    return pericias;
}

function restaurarFichaNaTela(ficha) {
    if (!ficha) return;

    // Modo
    const modoRadio = document.querySelector(`input[name="modo"][value="${ficha.modo || 'nex'}"]`);
    if (modoRadio) modoRadio.checked = true;

    // NEX / Nível
    if (document.getElementById("nex")) document.getElementById("nex").value = ficha.nex || 5;
    if (document.getElementById("nivel")) document.getElementById("nivel").value = ficha.nivel || 1;

    // Classe
    if (ficha.classe) {
        const classeRadio = document.querySelector(`input[name="classe"][value="${ficha.classe}"]`);
        if (classeRadio) classeRadio.checked = true;
    }

    // Atributos
    if (ficha.atributos) {
        for (const [attr, val] of Object.entries(ficha.atributos)) {
            const el = document.getElementById(attr);
            if (el) el.value = val;
        }
    }

    // Status atuais
    if (ficha.status_atuais) {
        for (const [key, val] of Object.entries(ficha.status_atuais)) {
            const el = document.getElementById(key);
            if (el) el.value = val;
        }
    }

    // Perícias
    if (ficha.pericias_treino && ficha.pericias_treino.length) {
        const container = document.getElementById("pericias");
        if (container) {
            ficha.pericias_treino.forEach(p => {
                const linha = container.children[p.indice];
                if (!linha) return;
                const radio = linha.querySelector(`input[value="${p.treino}"]`);
                if (radio) radio.checked = true;
                const bonusInput = linha.querySelector('input[type="number"]');
                if (bonusInput) bonusInput.value = p.bonus;
            });
        }
    }

    // Inventário
    if (ficha.inventario && typeof inventarioAtual !== 'undefined') {
        inventarioAtual = ficha.inventario;
        if (typeof atualizarInventario === 'function') atualizarInventario();
    }

    // Rituais
    if (ficha.rituais_equipados && typeof rituaisEquipados !== 'undefined') {
        rituaisEquipados = ficha.rituais_equipados;
        if (typeof renderizarRituaisEquipados === 'function') renderizarRituaisEquipados();
    }

    // Patente
    if (ficha.patente) {
        const patenteSelect = document.getElementById("patente-select");
        if (patenteSelect) patenteSelect.value = ficha.patente;
    }

    // Nome do personagem
    if (ficha.nome) {
        const nomeEl = document.getElementById("nome-personagem");
        if (nomeEl) nomeEl.value = ficha.nome;
    }

    // Atualiza tudo
    if (typeof atualizarTudo === 'function') atualizarTudo();
}

// ====================== EXPOSE GLOBAL ======================
window.dbSalvarFicha = dbSalvarFicha;
window.dbCarregarFicha = dbCarregarFicha;
window.dbListarFichas = dbListarFichas;
window.dbExcluirFicha = dbExcluirFicha;
window.dbExportarFichaJSON = dbExportarFichaJSON;
window.dbImportarFichaJSON = dbImportarFichaJSON;
window.dbExportarBancoCompleto = dbExportarBancoCompleto;
window.dbImportarBancoCompleto = dbImportarBancoCompleto;
window.dbEstatisticas = dbEstatisticas;
window.dbBuscarOrigens = dbBuscarOrigens;
window.dbBuscarPericias = dbBuscarPericias;
window.dbBuscarItens = dbBuscarItens;
window.dbBuscarRituais = dbBuscarRituais;
window.dbBuscarItensAmaldicoados = dbBuscarItensAmaldicoados;
window.consultarSQL = consultarSQL;
window.coletarDadosFichaAtual = coletarDadosFichaAtual;
window.restaurarFichaNaTela = restaurarFichaNaTela;
window.inicializarBancoDeDados = inicializarBancoDeDados;
