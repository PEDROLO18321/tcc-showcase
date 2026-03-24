// ==================== inventario-ui.js ====================

let inventarioAtual = [];
let abaAtual = "armas";
let abaCriarAtual = "armas";
let modalAberto = false;
let modoModalItem = 'criar';
let itemEditandoIndex = -1;

// Filtros do inventário
let filtroTipoInventario = 'todos';
let filtroCategoriaInventario = 'todos';

// ====================== FILTROS DO INVENTÁRIO ======================
window.filtrarInventarioPorTipo = function(tipo) {
    filtroTipoInventario = tipo;
    document.querySelectorAll('#secao-inventario .filtro-tipo-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`#secao-inventario .filtro-tipo-btn[data-tipo="${tipo}"]`);
    if (btn) btn.classList.add('active');
    renderizarListaInventarioAtual();
};

window.filtrarInventarioPorCategoria = function(cat) {
    filtroCategoriaInventario = cat;
    document.querySelectorAll('#secao-inventario .filtro-cat-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`#secao-inventario .filtro-cat-btn[data-cat="${cat}"]`);
    if (btn) btn.classList.add('active');
    renderizarListaInventarioAtual();
};

function getTipoCategoria(item) {
    if (item.tipoCategoria) return item.tipoCategoria;
    if (item.dano && !item.defesa) return 'armas';
    if (item.defesa && !item.dano) return 'protecoes';
    if (item.categoria === 'armas' || item.categoria === 'protecoes' || item.categoria === 'equipamentosGerais' || item.categoria === 'itensParanormais') return item.categoria;
    return 'equipamentosGerais';
}

function getTipoLabel(tipo) {
    const labels = { armas: '🔪 Arma', protecoes: '🛡️ Proteção', equipamentosGerais: '🛠️ Equipamento', itensParanormais: '🌌 Paranormal' };
    return labels[tipo] || tipo;
}

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
    document.querySelectorAll('#modal-adicionar-itens .modal-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
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
                <p style="font-size:0.82rem; color:var(--text-secondary); margin:6px 0;">
                    ${item.dano ? `Dano: ${item.dano}<br>` : ''}
                    ${item.defesa ? `Defesa: ${item.defesa}<br>` : ''}
                    Espaços: ${item.espacos} | Cat: ${item.categoria}
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
    const titulo = modal.querySelector('h3');
    if (titulo) titulo.textContent = 'Criar Item Personalizado';
    const btnSalvar = modal.querySelector('.btn-confirmar');
    if (btnSalvar) btnSalvar.textContent = '✅ Criar e Adicionar ao Inventário';
    mudarAbaCriar("armas");
}

function fecharModalCriarItem() {
    document.getElementById("modal-criar-item").style.display = "none";
    modoModalItem = 'criar';
    itemEditandoIndex = -1;
}

function mudarAbaCriar(aba) {
    abaCriarAtual = aba;
    document.querySelectorAll('#modal-criar-item .modal-tabs .tab-btn')
        .forEach(btn => btn.classList.remove('active'));

    const tabEl = document.getElementById(`criar-tab-${aba}`);
    if (tabEl) {
        tabEl.classList.add('active');
    } else {
        const fallback = document.getElementById('criar-tab-armas');
        if (fallback) fallback.classList.add('active');
        abaCriarAtual = 'armas';
    }

    renderizarFormCriar();
}

function renderizarFormCriar() {
    const conteudo = document.getElementById("form-criar-conteudo");
    let html = `<div style="display:grid; gap:12px;">`;

    // Campo de maldição (para edição)
    const maldicaoHtml = (abaCriarAtual !== 'itensParanormais') ? `
        <div style="border-top:1px solid var(--border); padding-top:12px; margin-top:8px;">
            <label style="color:var(--red);">🔮 Amaldiçoar Item (opcional)</label>
            <select id="criar-maldicao">
                <option value="">— Sem maldição —</option>
                ${getMaldicoesPorTipo(abaCriarAtual).map(m => {
                    const el = ELEMENTO_CORES_MALDICAO[m.elemento] || {icone:'✦'};
                    return `<option value="${m.id}">${el.icone} ${m.nome} (${m.elemento})</option>`;
                }).join('')}
            </select>
            <p id="criar-maldicao-desc" style="font-size:0.78rem; color:var(--text-secondary); margin-top:4px; min-height:20px;"></p>
        </div>
    ` : '';

    if (abaCriarAtual === "armas") {
        html += `
            <label>Nome do Item</label><input id="criar-nome" type="text" placeholder="Ex: Faca Serrilhada">
            <label>Dano</label><input id="criar-dano" type="text" placeholder="1d6 + FOR">
            <label>Alcance</label><input id="criar-alcance" type="text" placeholder="Curto">
            <label>Tipo</label><input id="criar-tipo" type="text" placeholder="C">
            <label>Categoria</label>
            <select id="criar-categoria-item"><option value="0">0</option><option value="I" selected>I</option><option value="II">II</option><option value="III">III</option><option value="IV">IV</option></select>
            <label>Espaços</label><input id="criar-espacos" type="number" value="1">
            ${maldicaoHtml}
        `;
    } else if (abaCriarAtual === "protecoes") {
        html += `
            <label>Nome do Item</label><input id="criar-nome" type="text" placeholder="Colete Tático Custom">
            <label>Defesa</label><input id="criar-defesa" type="text" placeholder="+6">
            <label>Categoria</label>
            <select id="criar-categoria-item"><option value="0">0</option><option value="I" selected>I</option><option value="II">II</option><option value="III">III</option><option value="IV">IV</option></select>
            <label>Espaços</label><input id="criar-espacos" type="number" value="4">
            ${maldicaoHtml}
        `;
    } else if (abaCriarAtual === "equipamentosGerais") {
        html += `
            <label>Nome do Item</label><input id="criar-nome" type="text" placeholder="Kit de Sobrevivência">
            <label>Descrição (opcional)</label><textarea id="criar-descricao" rows="2" placeholder="Cura 1d6 PV..."></textarea>
            <label>Categoria</label>
            <select id="criar-categoria-item"><option value="0" selected>0</option><option value="I">I</option><option value="II">II</option><option value="III">III</option><option value="IV">IV</option></select>
            <label>Espaços</label><input id="criar-espacos" type="number" value="1">
            ${maldicaoHtml}
        `;
    } else if (abaCriarAtual === "itensParanormais") {
        html += `
            <label>Nome do Item</label><input id="criar-nome" type="text" placeholder="Anel do Fogo">
            <label>Descrição (opcional)</label><textarea id="criar-descricao" rows="2" placeholder="Causa 2d6 de dano de fogo..."></textarea>
            <label>Categoria</label>
            <select id="criar-categoria-item"><option value="0">0</option><option value="II" selected>II</option><option value="III">III</option><option value="IV">IV</option></select>
            <label>Espaços</label><input id="criar-espacos" type="number" value="1">
        `;
    }

    html += `</div>`;
    conteudo.innerHTML = html;

    // Listener para mostrar descrição da maldição
    const selectMaldicao = document.getElementById('criar-maldicao');
    if (selectMaldicao) {
        selectMaldicao.addEventListener('change', function() {
            const descEl = document.getElementById('criar-maldicao-desc');
            if (!this.value) { descEl.textContent = ''; return; }
            const todas = [...MALDICOES_ARMAS, ...MALDICOES_PROTECOES, ...MALDICOES_ACESSORIOS];
            const m = todas.find(x => x.id === this.value);
            descEl.textContent = m ? m.descricao : '';
        });
    }
}

window.criarItemPersonalizado = function() {
    const aba = abaCriarAtual;
    let novoItem = {
        id: Date.now(),
        categoria: (document.getElementById('criar-categoria-item') && document.getElementById('criar-categoria-item').value) || '0',
        tipoCategoria: aba,
        nome: (document.getElementById('criar-nome') && document.getElementById('criar-nome').value.trim()) || 'Item Sem Nome'
    };

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

    // Maldição
    const selectMaldicao = document.getElementById('criar-maldicao');
    if (selectMaldicao && selectMaldicao.value) {
        const todas = [...MALDICOES_ARMAS, ...MALDICOES_PROTECOES, ...MALDICOES_ACESSORIOS];
        const m = todas.find(x => x.id === selectMaldicao.value);
        if (m) {
            novoItem.maldicao = { id: m.id, nome: m.nome, elemento: m.elemento, descricao: m.descricao };
        }
    }

    if (modoModalItem === 'editar' && itemEditandoIndex >= 0) {
        novoItem.id = inventarioAtual[itemEditandoIndex].id;
        inventarioAtual[itemEditandoIndex] = novoItem;
    } else {
        inventarioAtual.push(novoItem);
    }

    fecharModalCriarItem();
    atualizarInventario();
};

// ====================== LISTA + ATUALIZAÇÃO ======================
function renderizarListaInventarioAtual() {
    const container = document.getElementById("inventario-atual-lista");
    if (!container) return;

    container.innerHTML = "";

    if (inventarioAtual.length === 0) {
        container.innerHTML = `<p style="color:var(--text-secondary); text-align:center; padding:20px;">Nenhum item ainda</p>`;
        return;
    }

    // Filtrar
    const filtrados = inventarioAtual.filter((item, index) => {
        if (filtroTipoInventario !== 'todos') {
            const tipo = getTipoCategoria(item);
            if (tipo !== filtroTipoInventario) return false;
        }
        if (filtroCategoriaInventario !== 'todos') {
            if (item.categoria !== filtroCategoriaInventario) return false;
        }
        return true;
    });

    if (filtrados.length === 0) {
        container.innerHTML = `<p style="color:var(--text-secondary); text-align:center; padding:20px;">Nenhum item encontrado com esses filtros</p>`;
        return;
    }

    filtrados.forEach((item) => {
        const realIndex = inventarioAtual.indexOf(item);
        const div = document.createElement("div");
        div.className = "inventario-lista-item";

        const tipoLabel = getTipoLabel(getTipoCategoria(item));
        const maldicaoInfo = item.maldicao
            ? `<span style="font-size:0.72rem; padding:2px 6px; border-radius:8px; background:var(--red-subtle); color:var(--red); margin-left:6px;">🔮 ${item.maldicao.nome}</span>`
            : '';

        const htmlItem = `
            <div class="item-inventario-card" style="padding:16px; margin-bottom:12px; background:var(--bg-elevated); border:1px solid var(--border); border-radius:8px; ${item.maldicao ? 'border-left:4px solid var(--red);' : ''}">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-size:0.72rem; padding:2px 8px; border-radius:8px; background:var(--accent-subtle); color:var(--accent);">${tipoLabel}</span>
                    <span style="font-size:0.72rem; color:var(--text-secondary);">Cat. ${item.categoria || '—'} | ${item.espacos || 0} espaço(s)</span>
                </div>
                <h4 style="margin:0 0 8px 0; color:var(--text);">${item.nome}${maldicaoInfo}</h4>
                ${item.dano ? `<p style="margin:4px 0; font-size:0.88rem; color:var(--text-secondary);">Dano: ${item.dano}</p>` : ''}
                ${item.defesa ? `<p style="margin:4px 0; font-size:0.88rem; color:var(--text-secondary);">Defesa: ${item.defesa}</p>` : ''}
                ${item.descricao ? `<p style="margin:4px 0; font-size:0.82rem; color:var(--text-secondary);">${item.descricao}</p>` : ''}
                ${item.maldicao ? `<p style="margin:8px 0 4px; font-size:0.82rem; color:var(--red); background:var(--red-subtle); padding:6px 8px; border-radius:6px;">🔮 <strong>${item.maldicao.nome}</strong>: ${item.maldicao.descricao.substring(0,100)}...</p>` : ''}
                
                <div style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap;">
                    <button onclick="visualizarItem(${realIndex})" class="btn-ritual-acao" style="background:var(--blue);">👁 Visualizar</button>
                    <button onclick="editarItem(${realIndex})" class="btn-ritual-acao" style="background:var(--yellow); color:#1a1a2e;">✏ Editar</button>
                    <button onclick="removerItem(${realIndex})" class="btn-ritual-acao" style="background:var(--red);">✕ Excluir</button>
                </div>
            </div>
        `;

        div.innerHTML = htmlItem;
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

// ====================== VISUALIZAR ====================
window.visualizarItem = function(index) {
    const item = inventarioAtual[index];
    if (!item) return;
    
    document.getElementById('visualizar-titulo').textContent = item.nome || 'Item';
    
    let html = '<ul style="list-style:none; padding:0; margin:0;">';
    const skipKeys = ['id', 'tipoCategoria', 'maldicao'];
    Object.keys(item).forEach(key => {
        if (!skipKeys.includes(key)) {
            html += `<li style="margin:8px 0;"><strong>${key}:</strong> ${item[key]}</li>`;
        }
    });
    html += '</ul>';

    if (item.maldicao) {
        const el = ELEMENTO_CORES_MALDICAO[item.maldicao.elemento] || { cor: '#888', icone: '✦' };
        html += `
            <div style="margin-top:16px; padding:12px; background:var(--red-subtle); border-radius:8px; border-left:4px solid var(--red);">
                <h4 style="margin:0 0 6px; color:var(--red);">🔮 Maldição: ${item.maldicao.nome}</h4>
                <span style="font-size:0.72rem; padding:2px 8px; border-radius:10px; background:${el.cor}20; color:${el.cor};">${el.icone} ${item.maldicao.elemento}</span>
                <p style="margin:8px 0 0; font-size:0.88rem; color:var(--text-secondary);">${item.maldicao.descricao}</p>
            </div>`;
    }
    
    document.getElementById('visualizar-conteudo').innerHTML = html;
    document.getElementById('modal-visualizar-item').style.display = 'flex';
};

window.fecharModalVisualizar = function() {
    document.getElementById('modal-visualizar-item').style.display = 'none';
};

// ====================== EDITAR (corrigido - abre modal de edição como rituais) ====================
window.editarItem = function(index) {
    itemEditandoIndex = index;
    modoModalItem = 'editar';
    const item = inventarioAtual[index];
    if (!item) return;

    // Determinar aba correta
    let abaCorreta = item.tipoCategoria || 'armas';
    
    // Se não tem tipoCategoria, inferir
    if (!item.tipoCategoria) {
        if (item.defesa && !item.dano) abaCorreta = 'protecoes';
        else if (item.dano) abaCorreta = 'armas';
        else if (item.categoria === '0' || item.categoria === 'I' || item.categoria === 'II' || item.categoria === 'III') {
            if (item.defesa) abaCorreta = 'protecoes';
            else if (item.dano) abaCorreta = 'armas';
            else abaCorreta = 'equipamentosGerais';
        }
    }

    const modal = document.getElementById("modal-criar-item");
    modal.style.display = "flex";
    
    const titulo = modal.querySelector('h3');
    if (titulo) titulo.textContent = 'Editar Item';

    const btnSalvar = modal.querySelector('.btn-confirmar');
    if (btnSalvar) btnSalvar.textContent = '✅ Salvar Alterações';

    mudarAbaCriar(abaCorreta);
    
    // Preencher campos
    setTimeout(() => {
        const campos = ['nome', 'dano', 'alcance', 'tipo', 'espacos', 'defesa', 'descricao'];
        campos.forEach(field => {
            const input = document.getElementById('criar-' + field);
            if (input && item[field] !== undefined) {
                input.value = item[field];
            }
        });
        // Categoria
        const catSelect = document.getElementById('criar-categoria-item');
        if (catSelect && item.categoria) catSelect.value = item.categoria;

        // Maldição
        const maldicaoSelect = document.getElementById('criar-maldicao');
        if (maldicaoSelect && item.maldicao) {
            maldicaoSelect.value = item.maldicao.id;
            const descEl = document.getElementById('criar-maldicao-desc');
            if (descEl) descEl.textContent = item.maldicao.descricao;
        }
    }, 10);
};

// ====================== INICIALIZAÇÃO ======================
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("secao-inventario").style.display = "block";
    renderizarListaInventarioAtual();

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            if (document.getElementById("modal-adicionar-itens").style.display === "flex") fecharModalAdicionarItens();
            if (document.getElementById("modal-criar-item").style.display === "flex") fecharModalCriarItem();
        }
    });
});
