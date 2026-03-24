// ==================== itens-amaldicoados-ui.js ====================

let itensAmaldicoados = [];
let filtroElementoAmaldicoado = 'todos';
let modoModalAmaldicoado = 'criar';
let amaldicoadoEditandoIndex = -1;

// ====================== RENDERIZAR SEÇÃO ======================
function renderizarSecaoAmaldicoados() {
    const container = document.getElementById("amaldicoados-lista");
    if (!container) return;
    container.innerHTML = "";

    if (itensAmaldicoados.length === 0) {
        container.innerHTML = `<p style="color:var(--text-secondary); text-align:center; padding:30px;">Nenhum item amaldiçoado adicionado.</p>`;
        return;
    }

    const filtrados = itensAmaldicoados.filter(item => {
        if (filtroElementoAmaldicoado !== 'todos' && item.elemento !== filtroElementoAmaldicoado) return false;
        return true;
    });

    if (filtrados.length === 0) {
        container.innerHTML = `<p style="color:var(--text-secondary); text-align:center; padding:20px;">Nenhum item encontrado com esse filtro.</p>`;
        return;
    }

    filtrados.forEach(item => {
        const realIndex = itensAmaldicoados.indexOf(item);
        const el = ELEMENTO_CORES_MALDICAO[item.elemento] || { cor: '#888', icone: '✦' };

        const html = `
            <div class="ritual-card" style="border-left-color: ${el.cor};">
                <div class="ritual-card-header">
                    <div>
                        <span class="ritual-elemento-badge" style="background:${el.cor}20; color:${el.cor};">
                            ${el.icone} ${item.elemento}
                        </span>
                        <span class="ritual-circulo-badge">Cat. ${item.categoria || '—'}</span>
                    </div>
                    <span style="font-size:0.82rem; color:var(--text-secondary);">${item.espacos || 1} espaço(s)</span>
                </div>
                <h4 class="ritual-nome">${item.nome}</h4>
                <p class="ritual-descricao">${item.descricao}</p>
                <div class="ritual-acoes">
                    <button onclick="visualizarAmaldicoado(${realIndex})" class="btn-ritual-acao" style="background:var(--blue);">👁 Ver</button>
                    <button onclick="editarAmaldicoado(${realIndex})" class="btn-ritual-acao" style="background:var(--yellow); color:#1a1a2e;">✏ Editar</button>
                    <button onclick="removerAmaldicoado(${realIndex})" class="btn-ritual-acao" style="background:var(--red);">✕ Remover</button>
                </div>
            </div>`;
        container.innerHTML += html;
    });
}

// ====================== FILTROS ======================
window.filtrarAmaldicoadosPorElemento = function(elemento) {
    filtroElementoAmaldicoado = elemento;
    document.querySelectorAll('#secao-amaldicoados .filtro-elemento-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`#secao-amaldicoados [data-elemento="${elemento}"]`);
    if (btn) btn.classList.add('active');
    renderizarSecaoAmaldicoados();
};

// ====================== MODAL ADICIONAR DO LIVRO ======================
let abaElementoModalAmaldicoado = 'todos';

function abrirModalAdicionarAmaldicoados() {
    document.getElementById("modal-adicionar-amaldicoados").style.display = "flex";
    abaElementoModalAmaldicoado = 'todos';
    document.getElementById("busca-amaldicoado-modal").value = "";
    renderizarAmaldicooadosModal();
}

window.fecharModalAdicionarAmaldicoados = function() {
    document.getElementById("modal-adicionar-amaldicoados").style.display = "none";
};

window.mudarElementoModalAmaldicoado = function(e) {
    abaElementoModalAmaldicoado = e;
    document.querySelectorAll('#modal-adicionar-amaldicoados .filtro-elemento-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`#modal-adicionar-amaldicoados [data-elemento="${e}"]`);
    if (btn) btn.classList.add('active');
    renderizarAmaldicooadosModal();
};

window.filtrarAmaldicoadosModal = function() {
    renderizarAmaldicooadosModal();
};

function renderizarAmaldicooadosModal() {
    const conteudo = document.getElementById("modal-amaldicoados-conteudo");
    const termo = (document.getElementById("busca-amaldicoado-modal").value || "").toLowerCase().trim();

    let filtrados = ITENS_AMALDICOADOS_ESPECIAIS.filter(item => {
        if (abaElementoModalAmaldicoado !== 'todos' && item.elemento !== abaElementoModalAmaldicoado) return false;
        if (termo && !item.nome.toLowerCase().includes(termo)) return false;
        return true;
    });

    if (filtrados.length === 0) {
        conteudo.innerHTML = `<p style="text-align:center; padding:30px; color:var(--text-secondary);">Nenhum item encontrado</p>`;
        return;
    }

    let html = '';
    filtrados.forEach(item => {
        const el = ELEMENTO_CORES_MALDICAO[item.elemento] || { cor: '#888', icone: '✦' };
        const jaAdicionado = itensAmaldicoados.some(i => i.id === item.id);
        html += `
            <div class="item-card" style="border-left: 3px solid ${el.cor};">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span style="font-size:0.72rem; padding:2px 8px; border-radius:10px; background:${el.cor}20; color:${el.cor};">${el.icone} ${item.elemento}</span>
                    <span style="font-size:0.72rem; color:var(--accent); font-weight:700;">Cat. ${item.categoria}</span>
                </div>
                <h4>${item.nome}</h4>
                <p style="font-size:0.82rem; color:var(--text-secondary); margin:6px 0; line-height:1.4;">
                    ${item.descricao.substring(0, 120)}${item.descricao.length > 120 ? '...' : ''}
                </p>
                <button onclick="adicionarAmaldicoado('${item.id}'); event.stopPropagation();"
                        class="btn-adicionar-modal" ${jaAdicionado ? 'disabled style="opacity:0.5;"' : ''}>
                    ${jaAdicionado ? '✓ Adicionado' : '+ Adicionar'}
                </button>
            </div>`;
    });
    conteudo.innerHTML = html;
}

window.adicionarAmaldicoado = function(id) {
    const item = buscarItemEspecialPorId(id);
    if (!item) return;
    if (itensAmaldicoados.some(i => i.id === id)) {
        alert("⚠️ Este item já foi adicionado!");
        return;
    }
    itensAmaldicoados.push({ ...item });
    renderizarSecaoAmaldicoados();
    renderizarAmaldicooadosModal();
    alert(`✅ ${item.nome} adicionado!`);
};

// ====================== CRIAR PERSONALIZADO ======================
function abrirModalCriarAmaldicoado() {
    modoModalAmaldicoado = 'criar';
    amaldicoadoEditandoIndex = -1;
    const modal = document.getElementById("modal-criar-amaldicoado");
    modal.style.display = "flex";
    const titulo = modal.querySelector('h3');
    if (titulo) titulo.textContent = 'Criar Item Amaldiçoado';
    renderizarFormCriarAmaldicoado();
}

window.fecharModalCriarAmaldicoado = function() {
    document.getElementById("modal-criar-amaldicoado").style.display = "none";
    modoModalAmaldicoado = 'criar';
    amaldicoadoEditandoIndex = -1;
};

function renderizarFormCriarAmaldicoado() {
    const conteudo = document.getElementById("form-criar-amaldicoado-conteudo");
    conteudo.innerHTML = `
        <div style="display:grid; gap:12px;">
            <label>Nome do Item</label>
            <input id="criar-amal-nome" type="text" placeholder="Ex: Lâmina Sombria">

            <label>Elemento</label>
            <select id="criar-amal-elemento">
                <option value="Conhecimento">🧠 Conhecimento</option>
                <option value="Energia">⚡ Energia</option>
                <option value="Morte">💀 Morte</option>
                <option value="Sangue">🩸 Sangue</option>
                <option value="Medo">👁 Medo</option>
                <option value="Varia">✦ Variável</option>
            </select>

            <label>Categoria</label>
            <select id="criar-amal-categoria">
                <option value="I">I</option>
                <option value="II" selected>II</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
            </select>

            <label>Espaços</label>
            <input id="criar-amal-espacos" type="number" value="1" min="1">

            <label>Descrição</label>
            <textarea id="criar-amal-descricao" rows="4" placeholder="Descreva o efeito do item amaldiçoado..."></textarea>
        </div>`;
}

window.criarAmaldicoadoPersonalizado = function() {
    const nome = (document.getElementById('criar-amal-nome').value || '').trim();
    if (!nome) { alert("❌ Informe o nome do item!"); return; }

    const novoItem = {
        id: 'custom-' + Date.now(),
        nome,
        elemento: document.getElementById('criar-amal-elemento').value,
        categoria: document.getElementById('criar-amal-categoria').value,
        espacos: parseInt(document.getElementById('criar-amal-espacos').value) || 1,
        descricao: document.getElementById('criar-amal-descricao').value || '',
        personalizado: true
    };

    if (modoModalAmaldicoado === 'editar' && amaldicoadoEditandoIndex >= 0) {
        novoItem.id = itensAmaldicoados[amaldicoadoEditandoIndex].id;
        itensAmaldicoados[amaldicoadoEditandoIndex] = novoItem;
    } else {
        itensAmaldicoados.push(novoItem);
    }

    fecharModalCriarAmaldicoado();
    renderizarSecaoAmaldicoados();
};

// ====================== AÇÕES ======================
window.visualizarAmaldicoado = function(index) {
    const item = itensAmaldicoados[index];
    if (!item) return;

    document.getElementById('visualizar-titulo').textContent = item.nome;
    const el = ELEMENTO_CORES_MALDICAO[item.elemento] || { cor: '#888', icone: '✦' };

    let html = `
        <div style="margin-bottom:12px;">
            <span style="padding:3px 10px; border-radius:12px; background:${el.cor}20; color:${el.cor}; font-size:0.82rem; font-weight:600;">
                ${el.icone} ${item.elemento}
            </span>
            <span style="margin-left:8px; color:var(--accent); font-weight:700;">Categoria ${item.categoria}</span>
            <span style="margin-left:8px; color:var(--text-secondary);">${item.espacos || 1} espaço(s)</span>
        </div>
        <p style="line-height:1.6; margin-bottom:12px;">${item.descricao}</p>`;

    document.getElementById('visualizar-conteudo').innerHTML = html;
    document.getElementById('modal-visualizar-item').style.display = 'flex';
};

window.editarAmaldicoado = function(index) {
    amaldicoadoEditandoIndex = index;
    modoModalAmaldicoado = 'editar';
    const item = itensAmaldicoados[index];
    if (!item) return;

    const modal = document.getElementById("modal-criar-amaldicoado");
    modal.style.display = "flex";
    const titulo = modal.querySelector('h3');
    if (titulo) titulo.textContent = 'Editar Item Amaldiçoado';

    renderizarFormCriarAmaldicoado();

    setTimeout(() => {
        document.getElementById('criar-amal-nome').value = item.nome || '';
        document.getElementById('criar-amal-elemento').value = item.elemento || 'Conhecimento';
        document.getElementById('criar-amal-categoria').value = item.categoria || 'II';
        document.getElementById('criar-amal-espacos').value = item.espacos || 1;
        document.getElementById('criar-amal-descricao').value = item.descricao || '';
    }, 10);
};

window.removerAmaldicoado = function(index) {
    if (confirm("Remover este item amaldiçoado?")) {
        itensAmaldicoados.splice(index, 1);
        renderizarSecaoAmaldicoados();
    }
};

// ====================== INIT ======================
document.addEventListener("DOMContentLoaded", () => {
    renderizarSecaoAmaldicoados();

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            if (document.getElementById("modal-adicionar-amaldicoados").style.display === "flex") fecharModalAdicionarAmaldicoados();
            if (document.getElementById("modal-criar-amaldicoado").style.display === "flex") fecharModalCriarAmaldicoado();
        }
    });
});
