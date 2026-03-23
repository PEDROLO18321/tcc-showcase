// ==================== inventario-ui.js (VERSÃO FINAL 100% FUNCIONAL) ====================

let inventarioAtual = [];
let abaAtual = "armas";           // modal de adicionar itens do livro
let abaCriarAtual = "armas";      // modal de criar item personalizado
let modalAberto = false;
let modoModalItem = 'criar';
let itemEditandoIndex = -1;

// ====================== MODAL ADICIONAR ITENS DO LIVRO ======================
function abrirModalAdicionarItens() {
    document.getElementById("modal-adicionar-itens").style.display = "flex";
    modalAberto = true;
    mudarAbaModal("armas");
}

function fecharModalAdicionarItens() {
    document.getElementById("modal-adicionar-itens").style.display = "none";
    modalAberto = false;
}

function mudarAbaModal(aba) {
    abaAtual = aba;
    document.querySelectorAll('.modal-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`modal-tab-${aba}`).classList.add('active');
    document.getElementById("busca-modal").value = "";
    renderizarItensModal("");
}

function renderizarItensModal(filtro = "") {
    const conteudo = document.getElementById("modal-conteudo");
    conteudo.innerHTML = "";

    const itens = ITENS[abaAtual] || [];
    const termo = filtro.toLowerCase().trim();

    const filtrados = termo 
        ? itens.filter(item => item.nome.toLowerCase().includes(termo))
        : itens;

    if (filtrados.length === 0) {
        conteudo.innerHTML = `<p style="text-align:center; padding:40px 20px; color:#777;">Nenhum item encontrado</p>`;
        return;
    }

    let html = "";
    filtrados.forEach(item => {
        html += `
            <div class="item-card">
                <h4>${item.nome}</h4>
                <p style="font-size:0.9rem; color:#aaa; margin:6px 0;">
                    ${item.dano ? `Dano: ${item.dano}<br>` : ''}
                    ${item.defesa ? `Defesa: ${item.defesa}<br>` : ''}
                    Espaços: ${item.espacos}
                </p>
                <button onclick="adicionarItem(${item.id}); event.stopImmediatePropagation();" class="btn-adicionar-modal">
                    + Adicionar
                </button>
            </div>`;
    });

    conteudo.innerHTML = html;
}

function filtrarItensModal() {
    const termo = document.getElementById("busca-modal").value;
    renderizarItensModal(termo);
}

// ====================== ADICIONAR ITEM (do livro) ======================
window.adicionarItem = function(id) {
    const item = buscarItemPorId(id);
    if (!item) return;

    const patente = document.getElementById("patente-select").value;
    const limiteCategoria = item.categoria === "III" || item.categoria === "IV" ? "IV" : "I";
    const limite = limitesPorPatente[patente][limiteCategoria] || 99;

    const jaTem = inventarioAtual.filter(i => i.id === id).length;
    if (jaTem >= limite) {
        alert(`❌ Limite da patente atingido para este item!`);
        return;
    }

    inventarioAtual.push(item);
    atualizarInventario();
    alert(`✅ ${item.nome} adicionado ao inventário!`);
};

// ====================== CRIAR ITEM PERSONALIZADO ======================
function abrirModalCriarItem() {
    modoModalItem = 'criar';
    itemEditandoIndex = -1;
    const modal = document.getElementById("modal-criar-item");
    modal.style.display = "flex";
    const titulo = modal.querySelector('h2');
    if (titulo) titulo.textContent = 'Criar Item Personalizado';
    mudarAbaCriar("armas");
}

function fecharModalCriarItem() {
    document.getElementById("modal-criar-item").style.display = "none";
    modoModalItem = 'criar';
    itemEditandoIndex = -1;
}

function mudarAbaCriar(aba) {
    abaCriarAtual = aba;

    // Remove active de todas as abas com segurança
    document.querySelectorAll('#modal-criar-item .modal-tabs .tab-btn')
        .forEach(btn => btn.classList.remove('active'));

    // Ativa a aba desejada (com verificação para não dar erro)
    const tabEl = document.getElementById(`criar-tab-${aba}`);
    if (tabEl) {
        tabEl.classList.add('active');
    } else {
        // Fallback seguro: força a aba "armas" se a aba não existir
        console.warn(`⚠️ Aba "${aba}" não encontrada. Usando "armas" como fallback.`);
        const fallback = document.getElementById('criar-tab-armas');
        if (fallback) fallback.classList.add('active');
        abaCriarAtual = 'armas';
    }

    renderizarFormCriar();
}

function renderizarFormCriar() {
    const conteudo = document.getElementById("form-criar-conteudo");
    let html = `<div style="display:grid; gap:12px;">`;

    if (abaCriarAtual === "armas") {
        html += `
            <label>Nome do Item</label><input id="criar-nome" type="text" placeholder="Ex: Faca Serrilhada">
            <label>Dano</label><input id="criar-dano" type="text" placeholder="1d6 + FOR">
            <label>Alcance</label><input id="criar-alcance" type="text" placeholder="Curto">
            <label>Tipo</label><input id="criar-tipo" type="text" placeholder="C">
            <label>Espaços</label><input id="criar-espacos" type="number" value="1">
        `;
    } else if (abaCriarAtual === "protecoes") {
        html += `
            <label>Nome do Item</label><input id="criar-nome" type="text" placeholder="Colete Tático Custom">
            <label>Defesa</label><input id="criar-defesa" type="text" placeholder="+6">
            <label>Espaços</label><input id="criar-espacos" type="number" value="4">
        `;
    } else if (abaCriarAtual === "equipamentosGerais") {
        html += `
            <label>Nome do Item</label><input id="criar-nome" type="text" placeholder="Kit de Sobrevivência">
            <label>Descrição (opcional)</label><textarea id="criar-descricao" rows="2" placeholder="Cura 1d6 PV..."></textarea>
            <label>Espaços</label><input id="criar-espacos" type="number" value="1">
        `;
    } else if (abaCriarAtual === "itensParanormais") {
        html += `
            <label>Nome do Item</label><input id="criar-nome" type="text" placeholder="Anel do Fogo">
            <label>Descrição (opcional)</label><textarea id="criar-descricao" rows="2" placeholder="Causa 2d6 de dano de fogo..."></textarea>
            <label>Espaços</label><input id="criar-espacos" type="number" value="1">
        `;
    }

    html += `</div>`;
    conteudo.innerHTML = html;
}

window.criarItemPersonalizado = function() {
    const aba = abaCriarAtual;
    let novoItem = {
        id: Date.now(),
        categoria: aba,
        nome: (document.getElementById('criar-nome') && document.getElementById('criar-nome').value.trim()) || 'Item Sem Nome'
    };

    // Campos conforme aba (exatamente como estava antes)
    if (aba === 'armas') {
        novoItem.dano = document.getElementById('criar-dano') ? document.getElementById('criar-dano').value : '';
        novoItem.alcance = document.getElementById('criar-alcance') ? document.getElementById('criar-alcance').value : '';
        novoItem.tipo = document.getElementById('criar-tipo') ? document.getElementById('criar-tipo').value : '';
        novoItem.espacos = parseInt(document.getElementById('criar-espacos').value) || 1;
    } else if (aba === 'protecoes') {
        novoItem.defesa = document.getElementById('criar-defesa') ? document.getElementById('criar-defesa').value : '';
        novoItem.espacos = parseInt(document.getElementById('criar-espacos').value) || 1;
    } else if (aba === 'equipamentosGerais' || aba === 'itensParanormais') {
        novoItem.descricao = document.getElementById('criar-descricao') ? document.getElementById('criar-descricao').value.trim() : '';
        novoItem.espacos = parseInt(document.getElementById('criar-espacos').value) || 1;
    }

    if (modoModalItem === 'editar' && itemEditandoIndex >= 0) {
        // EDITAR
        novoItem.id = inventarioAtual[itemEditandoIndex].id; // mantém o ID original
        inventarioAtual[itemEditandoIndex] = novoItem;
    } else {
        // CRIAR
        inventarioAtual.push(novoItem);
    }

    fecharModalCriarItem();
    atualizarInventario();
};

// ====================== LISTA + ATUALIZAÇÃO ======================
// ====================== LISTA + ATUALIZAÇÃO ======================
function renderizarListaInventarioAtual() {
    const container = document.getElementById("inventario-atual-lista");
    if (!container) {
        console.error("ERRO: #inventario-atual-lista não encontrado no HTML!");
        return;
    }

    container.innerHTML = "";

    if (inventarioAtual.length === 0) {
        container.innerHTML = `<p style="color:#777; text-align:center; padding:20px;">Nenhum item ainda</p>`;
        return;
    }

    inventarioAtual.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "inventario-lista-item";

        const htmlItem = `
            <div class="item-inventario-card" style="padding:16px; margin-bottom:12px; background:rgba(22,26,34,0.9); border-radius:8px;">
                <h4 style="margin:0 0 8px 0;">${item.nome}</h4>
                <p style="margin:4px 0;">Carga: ${item.espacos || 0}</p>
                ${item.dano ? `<p style="margin:4px 0;">Dano: ${item.dano}</p>` : ''}
                ${item.defesa ? `<p style="margin:4px 0;">Defesa: ${item.defesa}</p>` : ''}
                ${item.descricao ? `<p style="margin:4px 0; font-size:0.9rem; color:#bbb;">${item.descricao}</p>` : ''}
                
                <div style="display:flex; gap:8px; margin-top:16px; flex-wrap:wrap;">
                    <button onclick="visualizarItem(${index})" 
                            style="background:#4aa3ff; color:white; padding:8px 14px; border:none; border-radius:6px; cursor:pointer; font-size:0.9rem;">
                        👁 Visualizar
                    </button>
                    <button onclick="editarItem(${index})" 
                            style="background:#ffaa00; color:white; padding:8px 14px; border:none; border-radius:6px; cursor:pointer; font-size:0.9rem;">
                        ✏ Editar
                    </button>
                    <button onclick="removerItem(${index})" class="btn-excluir"
                            style="background:#e74c3c; color:white; padding:8px 14px; border:none; border-radius:6px; cursor:pointer; font-size:0.9rem;">
                        Excluir
                    </button>
                </div>
            </div>
        `;

        div.innerHTML = htmlItem;           // ← LINHA QUE ESTAVA FALTANDO
        container.appendChild(div);
    });
}

window.removerItem = function(index) {
    if (confirm("Remover este item?")) {
        inventarioAtual.splice(index, 1);
        atualizarInventario();
    }
};

function atualizarInventario() {
    renderizarListaInventarioAtual();
    atualizarCarga();
}

// ====================== INICIALIZAÇÃO ======================
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("secao-inventario").style.display = "block";
    renderizarListaInventarioAtual();

    // Fechar com ESC
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            if (document.getElementById("modal-adicionar-itens").style.display === "flex") fecharModalAdicionarItens();
            if (document.getElementById("modal-criar-item").style.display === "flex") fecharModalCriarItem();
        }
    });
});

// ==================== NOVO: VISUALIZAR ====================
window.visualizarItem = function(index) {
    const item = inventarioAtual[index];
    if (!item) return;
    
    document.getElementById('visualizar-titulo').textContent = item.nome || 'Item';
    
    let html = '<ul style="list-style:none; padding:0; margin:0;">';
    Object.keys(item).forEach(key => {
        if (key !== 'id' && key !== 'categoria') {
            html += `<li style="margin:8px 0;"><strong>${key}:</strong> ${item[key]}</li>`;
        }
    });
    html += '</ul>';
    
    document.getElementById('visualizar-conteudo').innerHTML = html;
    document.getElementById('modal-visualizar-item').style.display = 'flex';
};

window.fecharModalVisualizar = function() {
    document.getElementById('modal-visualizar-item').style.display = 'none';
};

// ==================== NOVO: EDITAR (versão corrigida - sem aviso) ====================
window.editarItem = function(index) {
    itemEditandoIndex = index;
    modoModalItem = 'editar';
    const item = inventarioAtual[index];
    if (!item) return;

    // === MAPEAMENTO INTELIGENTE DA ABA ===
    let abaCorreta = item.tipoCategoria || item.categoria || 'armas';
    
    // Itens do livro de armas (categoria "0", "I", "II", "III") sempre vão para aba "armas"
    if (abaCorreta === '0' || abaCorreta === 'I' || abaCorreta === 'II' || abaCorreta === 'III') {
        abaCorreta = 'armas';
    }
    
    // Proteções do livro têm categoria "I" ou "II", mas vão para aba "protecoes"
    if (item.defesa && !item.dano) {
        abaCorreta = 'protecoes';
    }

    const modal = document.getElementById("modal-criar-item");
    modal.style.display = "flex";
    
    const titulo = modal.querySelector('h2');
    if (titulo) titulo.textContent = 'Editar Item';

    mudarAbaCriar(abaCorreta);
    
    // Preenche os campos após o formulário carregar
    setTimeout(() => {
        preencherFormularioEdicao(item);
    }, 10);
};

function preencherFormularioEdicao(item) {
    const prefix = 'criar-';
    const campos = ['nome', 'dano', 'alcance', 'tipo', 'espacos', 'defesa', 'descricao'];
    campos.forEach(field => {
        const input = document.getElementById(prefix + field);
        if (input && item[field] !== undefined) {
            input.value = item[field];
        }
    });
}