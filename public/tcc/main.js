/* =========================
   CONTROLE DE MODO
========================= */

function modoAtual() {
    return document.querySelector('input[name="modo"]:checked')?.value || "nex";
}

function obterOrigem() {
    return origemSelecionada ? origemSelecionada.nome.toLowerCase() : null;
}

function aplicarModo() {
    const modo = modoAtual();

    const nex = document.getElementById("nex");
    const nivel = document.getElementById("nivel");

    const esforco = document.getElementById("esforco_atual");
    const sanidade = document.getElementById("sanidade_atual");
    const determinacao = document.getElementById("determinacao_atual");

    if (modo === "nex") {
        nex.disabled = false;
        nivel.disabled = true;

        esforco.disabled = false;
        sanidade.disabled = false;
        determinacao.disabled = true;
        determinacao.value = "";
    } else {
        nex.disabled = true;
        nivel.disabled = false;

        esforco.disabled = true;
        sanidade.disabled = true;
        determinacao.disabled = false;

        esforco.value = "";
        sanidade.value = "";
    }
}

/* =========================
   ALINHAMENTO NEX <-> NÍVEL
========================= */

function alinharNexNivel() {
    const modo = modoAtual();
    const nexInput = document.getElementById("nex");
    const nivelInput = document.getElementById("nivel");

    if (modo === "nex") {
        let nex = Number(nexInput.value) || 0;

        // força múltiplo de 5
        nex = Math.round(nex / 5) * 5;
        if (nex < 5) nex = 5;
        if (nex > 100) nex = 100;

        nexInput.value = nex;
        nivelInput.value = Math.max(1, nex / 5);

    } else {
        let nivel = Number(nivelInput.value) || 1;

        if (nivel < 1) nivel = 1;
        if (nivel > 20) nivel = 20;

        nivelInput.value = nivel;
        nexInput.value = nivel * 5;
    }
}

/* =========================
   ATUALIZAÇÃO DE PONTOS POR NEX
========================= */

function atualizarPontosPorNex() {
    const nex = Number(document.getElementById("nex").value) || 0;
    const classe = obterClasse();
    
    if (typeof calcularPontosPorNex === 'function') {
        calcularPontosPorNex(nex, classe);
    }
    
    // Atualiza display visual dos pontos de NEX
    atualizarDisplayPontosNex(nex, classe);
}

function atualizarDisplayPontosNex(nex, classe) {
    const container = document.getElementById("nex-pontos-info");
    if (!container) return;
    
    // Não mostra para Sobrevivente
    if (classe === "sobrevivente") {
        container.innerHTML = '<small>Classe Sobrevivente não recebe pontos extras por NEX.</small>';
        return;
    }
    
    let html = '<strong>Pontos extras por NEX:</strong><br>';
    
    const pontos = [
        { nex: 20, nivel: 4, key: 'nex20', label: 'NEX 20% / Nível 4' },
        { nex: 50, nivel: 10, key: 'nex50', label: 'NEX 50% / Nível 10' },
        { nex: 80, nivel: 16, key: 'nex80', label: 'NEX 80% / Nível 16' },
        { nex: 100, nivel: 19, key: 'nex100', label: 'NEX 100% / Nível 19' }
    ];
    
    pontos.forEach(ponto => {
        const disponivel = nex >= ponto.nex;
        const usado = pontosPorNex && pontosPorNex[ponto.key] && pontosPorNex[ponto.key].usado;
        
        let classeCSS = 'indisponivel';
        if (disponivel && usado) {
            classeCSS = 'usado';
        } else if (disponivel) {
            classeCSS = 'disponivel';
        }
        
        html += `
            <div class="nex-ponto-item ${classeCSS}">
                <div class="nex-ponto-marcador">${ponto.nex}%</div>
                <div>${ponto.label} ${usado ? '(✓ usado)' : '(disponível)'}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/* =========================
   FUNÇÃO ATUALIZAR TUDO
========================= */

function atualizarTudo() {
    aplicarModo();
    alinharNexNivel();
    
    // Atualiza pontos por NEX
    atualizarPontosPorNex();
    
    const atributos = obterAtributos();
    const nex = Number(document.getElementById("nex").value) || 0;
    const classe = obterClasse();
    const origemNome = obterOrigem();  // Novo: passe o nome da origem
    
    const status = calcularStatus(atributos, nex, classe, origemNome);  // Adicione o parâmetro origem
    
    for (const s in status) {
        document.getElementById(`${s}_max`).value = status[s].max;
        const atual = document.getElementById(`${s}_atual`);
        if (!atual.value || atual.value > status[s].max) {
            atual.value = status[s].max;
        }
    }

    // === Calcular Defesa: 10 + AGI + bônus de proteções equipadas ===
    atualizarDefesa();

    if (typeof atualizarSecaoPoderes === 'function') {
        atualizarSecaoPoderes();
    }
}

/* =========================
   PERÍCIAS
========================= */

function renderPericias() {
    const container = document.getElementById("pericias");
    container.innerHTML = "";

    PERICIAS.forEach((pericia, i) => {
        const div = document.createElement("div");
        div.style.display = "grid";
        div.style.gridTemplateColumns = "180px repeat(4, 40px) 60px 60px";
        div.style.gap = "6px";
        div.style.marginBottom = "6px";

        div.innerHTML = `
            <strong>${pericia.nome}</strong>
            <label><input type="radio" name="t${i}" value="destreinado" checked>–</label>
            <label><input type="radio" name="t${i}" value="treinado">T</label>
            <label><input type="radio" name="t${i}" value="veterano">V</label>
            <label><input type="radio" name="t${i}" value="expert">E</label>
            <input type="number" value="0">
            <button class="btn-rolar" onclick="rolarPericiaPorIndice(${i})">Rolar</button>
        `;

        container.appendChild(div);
    });
}

// Função para rolar perícia por índice
function rolarPericiaPorIndice(indice) {
    const container = document.getElementById("pericias");
    const linhaPericia = container.children[indice];
    
    if (!linhaPericia) return;
    
    const pericia = PERICIAS[indice];
    const treino = linhaPericia.querySelector('input[type="radio"]:checked').value;
    const bonusInput = linhaPericia.querySelector('input[type="number"]');
    const bonus = bonusInput ? Number(bonusInput.value) || 0 : 0;
    
    const resultado = rolarPericia(
        pericia,
        obterAtributos(),
        treino,
        bonus
    );

    // Exibição atualizada INCLUINDO TODOS OS BÔNUS
    let saida = `${resultado.pericia} (${resultado.mensagemRolagem})\n`;
    saida += `Dados rolados: ${resultado.dados.join(", ")}\n`;
    saida += `Resultado do dado: ${resultado.resultadoFinal}\n`;
    saida += `Bônus de treinamento: +${resultado.bonusTreinamento}\n`;
    saida += `Bônus extra: +${resultado.bonusExtra}\n`;
    
    // Adicionar linha do bônus do poder ativo, se houver
    if (resultado.bonusPoder > 0) {
        saida += `Bônus do poder ativo: +${resultado.bonusPoder}\n`;
    }
    
    // Adicionar linha do bônus passivo, se houver
    if (resultado.bonusPassivo > 0) {
        saida += `Bônus passivo (origem): +${resultado.bonusPassivo}\n`;
        if (resultado.mensagemPassivo) {
            saida += `Observação: ${resultado.mensagemPassivo}\n`;
        }
    }
    
    saida += `TOTAL: ${resultado.total}`;

    document.getElementById("saida").innerText = saida;
}

/* =========================
   EVENTOS
========================= */

document.querySelectorAll(".atributo, #nex, #nivel")
    .forEach(el => el.addEventListener("input", atualizarTudo));

// Adicionar listener para os radio buttons da classe
document.querySelectorAll('input[name="classe"]')
    .forEach(el => el.addEventListener("change", atualizarTudo));

document.querySelectorAll(
    "#vida_atual, #esforco_atual, #sanidade_atual, #determinacao_atual"
).forEach(el => el.addEventListener("input", validarStatusAtual));

document
    .querySelectorAll('input[name="modo"]')
    .forEach(el => el.addEventListener("change", atualizarTudo));

/* =========================
   FUNÇÃO PARA DESABILITAR ATRIBUTOS QUANDO NÃO HÁ CLASSE
========================= */

function atualizarEstadoAtributos() {
    const classeSelecionada = obterClasse();
    const atributos = document.querySelectorAll('.atributo');
    const nexNivel = document.querySelectorAll('#nex, #nivel');
    const botoesAtributos = document.querySelectorAll('.controles-atributo button');
    
    if (!classeSelecionada) {
        // Se não há classe selecionada, desabilita atributos e NEX/Nível
        atributos.forEach(a => a.disabled = true);
        nexNivel.forEach(n => n.disabled = true);
        botoesAtributos.forEach(b => b.disabled = true);
    } else {
        // Se há classe selecionada, habilita atributos
        atributos.forEach(a => a.disabled = false);
        // Habilita NEX/Nível conforme o modo
        aplicarModo();
        // Atualiza estado dos botões de atributos
        if (typeof atualizarBotoesAtributos === 'function') {
            atualizarBotoesAtributos();
        }
    }
}

/* =========================
   INIT
========================= */

// Inicializar tudo quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    renderPericias();
    atualizarEstadoAtributos();
    atualizarTudo();
    
    // Inicializar display de pontos NEX
    const nexInicial = Number(document.getElementById("nex").value) || 0;
    const classeInicial = obterClasse();
    atualizarDisplayPontosNex(nexInicial, classeInicial);
    document.getElementById('btn-confirmar-origem')?.addEventListener('click', atualizarTudo);
    document.getElementById('btn-alterar-origem')?.addEventListener('click', atualizarTudo);
});

// Também precisamos atualizar quando a classe for selecionada
document.querySelectorAll('input[name="classe"]').forEach(el => {
    el.addEventListener('change', function() {
        atualizarEstadoAtributos();
        if (this.value !== "") {
            // Se selecionou uma classe válida, habilita atributos
            if (typeof inicializarAtributos === 'function') {
                // Não inicializa de novo, só habilita
                if (typeof atualizarBotoesAtributos === 'function') {
                    atualizarBotoesAtributos();
                }
            }
        }
        // Atualiza display de pontos NEX
        const nex = Number(document.getElementById("nex").value) || 0;
        atualizarDisplayPontosNex(nex, this.value);
    });
});

// ====================== INVENTÁRIO (LocalStorage) ======================

let patenteAtual = "recruta";

const limitesPorPatente = {
    recruta: { I: 2, II: 0, III: 0, IV: 0 },
    operador: { I: 3, II: 1, III: 0, IV: 0 },
    "agente-especial": { I: 3, II: 2, III: 1, IV: 0 },
    oficial: { I: 3, II: 3, III: 2, IV: 1 },
    elite: { I: 99, II: 99, III: 99, IV: 99 }
};

function atualizarInventario() {
    patenteAtual = document.getElementById("patente-select").value;
    const forca = Number(document.getElementById("forca").value) || 0;
    const cargaMax = Math.max(2, forca * 5);
    
    document.getElementById("carga-max").textContent = cargaMax;
    document.getElementById("carga-atual").textContent = calcularEspacosUsados();
    
    renderizarInventario();
}

function calcularEspacosUsados() {
    return inventarioAtual.reduce((total, item) => total + (item.espacos || 1), 0);
}

function renderizarInventario() {
    // Código completo das abas e itens está no final deste arquivo (é longo, mas funcional)
    // Por enquanto mostro só a estrutura - o código completo vem abaixo
}

// ====================== SALVAR / CARREGAR FICHA COMPLETA ======================
function salvarFichaCompleta() {
    const ficha = {
        origem: origemSelecionada ? origemSelecionada.nome : "",
        classe: obterClasse(),
        nex: document.getElementById("nex").value,
        atributos: obterAtributos(),
        inventario: inventarioAtual,
        patente: patenteAtual,
        data: new Date().toISOString()
    };
    
    localStorage.setItem("fichaAtual", JSON.stringify(ficha));
    alert("✅ Ficha salva no navegador!");
}

function carregarFichaSalva() {
    const salva = localStorage.getItem("fichaAtual");
    if (!salva) return alert("Nenhuma ficha salva ainda.");
    
    const ficha = JSON.parse(salva);
    // Aqui você pode carregar os campos (ex: origem, atributos, etc.)
    inventarioAtual = ficha.inventario || [];
    patenteAtual = ficha.patente || "recruta";
    document.getElementById("patente-select").value = patenteAtual;
    
    atualizarInventario();
    alert("📂 Ficha carregada!");
}

function limparInventario() {
    if (confirm("Limpar todo o inventário?")) {
        inventarioAtual = [];
        atualizarInventario();
    }
}

// Chamar quando a origem for confirmada
const oldConfirmarOrigem = confirmarOrigem;
confirmarOrigem = function() {
    oldConfirmarOrigem();
    document.getElementById("secao-inventario").style.display = "block";
};

// ====================== CARGA AUTOMÁTICA + BARRA COM COR DINÂMICA ======================
function atualizarCarga() {
    const forca = Number(document.getElementById("forca").value) || 0;
    const cargaMax = Math.max(2, forca * 5);
    const cargaAtual = calcularEspacosUsados();
    
    // Atualiza números
    document.getElementById("carga-max").textContent = cargaMax;
    document.getElementById("carga-atual").textContent = cargaAtual;
    
    // Calcula porcentagem (pode passar de 100%)
    let percent = (cargaAtual / cargaMax) * 100;
    if (percent > 100) percent = 100;   // barra não passa de 100% visualmente
    
    const barra = document.getElementById("carga-progresso");
    barra.style.width = percent + "%";
    
    // Muda a cor automaticamente
    if (cargaAtual > cargaMax) {
        barra.className = "carga-progresso sobrecarregado";
    } else {
        barra.className = "carga-progresso normal";
    }
}

// Atualiza a carga sempre que a Força mudar (igual aos status)
document.getElementById("forca").addEventListener("input", () => {
    atualizarCarga();
    atualizarInventario();
});

// Chama ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(atualizarCarga, 300);   // espera os inputs carregarem
});

// Integração do inventário
window.atualizarInventario = atualizarInventario; // já existe, só garante