// ==================== rituais-ui.js ====================

let rituaisAprendidos = [];
let filtroCirculo = "todos";
let filtroElemento = "todos";
let modalRitualAberto = false;
let modoModalRitual = 'criar';
let ritualEditandoIndex = -1;

// ====================== RENDERIZAR SEÇÃO ======================
function renderizarSecaoRituais() {
    const container = document.getElementById("rituais-lista");
    if (!container) return;

    container.innerHTML = "";

    if (rituaisAprendidos.length === 0) {
        container.innerHTML = `<p style="color:var(--text-secondary); text-align:center; padding:30px;">Nenhum ritual aprendido. Adicione do livro ou crie um personalizado.</p>`;
        return;
    }

    const filtrados = rituaisAprendidos.filter(r => {
        if (filtroCirculo !== "todos" && r.circulo !== parseInt(filtroCirculo)) return false;
        if (filtroElemento !== "todos" && r.elemento !== filtroElemento) return false;
        return true;
    });

    if (filtrados.length === 0) {
        container.innerHTML = `<p style="color:var(--text-secondary); text-align:center; padding:20px;">Nenhum ritual encontrado com esses filtros.</p>`;
        return;
    }

    filtrados.forEach((ritual, idx) => {
        const realIndex = rituaisAprendidos.indexOf(ritual);
        const elInfo = ELEMENTO_CORES[ritual.elemento] || { cor: "#888", icone: "✦" };
        const temModos = ritual.modos && ritual.modos.length > 0;
        const temFormas = ritual.formas && (ritual.formas.discente || ritual.formas.verdadeiro);

        let formasHtml = '';
        if (temFormas) {
            formasHtml = `<div class="ritual-formas">`;
            if (ritual.formas.discente) {
                formasHtml += `
                    <div class="ritual-forma" data-forma="discente" data-ritual-idx="${realIndex}">
                        <div class="forma-header">
                            <span class="forma-badge discente">Discente</span>
                            <span class="forma-custo">${ritual.formas.discente.custo}</span>
                        </div>
                        <p class="forma-desc">${ritual.formas.discente.descricao}</p>
                    </div>`;
            }
            if (ritual.formas.verdadeiro) {
                formasHtml += `
                    <div class="ritual-forma" data-forma="verdadeiro" data-ritual-idx="${realIndex}">
                        <div class="forma-header">
                            <span class="forma-badge verdadeiro">Verdadeiro</span>
                            <span class="forma-custo">${ritual.formas.verdadeiro.custo}</span>
                        </div>
                        <p class="forma-desc">${ritual.formas.verdadeiro.descricao}</p>
                    </div>`;
            }
            formasHtml += `</div>`;
        }

        let modosHtml = '';
        if (temModos) {
            modosHtml = `<div class="ritual-modos">
                <strong style="font-size:0.82rem; color:var(--text-secondary); display:block; margin-bottom:6px;">Modos de uso:</strong>`;
            ritual.modos.forEach((modo, mi) => {
                modosHtml += `
                    <div class="ritual-modo" data-ritual-idx="${realIndex}" data-modo="${mi}">
                        <strong>${modo.nome}</strong>
                        <p>${modo.descricao}</p>
                    </div>`;
            });
            modosHtml += `</div>`;
        }

        const html = `
            <div class="ritual-card" style="border-left-color: ${elInfo.cor};">
                <div class="ritual-card-header">
                    <div>
                        <span class="ritual-elemento-badge" style="background:${elInfo.cor}20; color:${elInfo.cor};">
                            ${elInfo.icone} ${ritual.elemento}
                        </span>
                        <span class="ritual-circulo-badge">${ritual.circulo}º Círculo</span>
                    </div>
                    <span class="ritual-custo-badge">${ritual.custo} PE</span>
                </div>
                <h4 class="ritual-nome">${ritual.nome}</h4>
                <div class="ritual-stats">
                    <span>⏱ ${ritual.execucao}</span>
                    <span>📏 ${ritual.alcance}</span>
                    <span>🎯 ${ritual.alvo}</span>
                    <span>⏳ ${ritual.duracao}</span>
                    ${ritual.resistencia ? `<span>🛡 ${ritual.resistencia}</span>` : ''}
                </div>
                <p class="ritual-descricao">${ritual.descricao}</p>
                ${modosHtml}
                ${formasHtml}
                <div class="ritual-acoes">
                    <button onclick="visualizarRitual(${realIndex})" class="btn-ritual-acao" style="background:var(--blue);">👁 Ver</button>
                    <button onclick="editarRitual(${realIndex})" class="btn-ritual-acao" style="background:var(--yellow); color:#1a1a2e;">✏ Editar</button>
                    <button onclick="removerRitual(${realIndex})" class="btn-ritual-acao" style="background:var(--red);">✕ Remover</button>
                </div>
            </div>`;

        container.innerHTML += html;
    });
}

// ====================== FILTROS ======================
window.filtrarRituaisPorCirculo = function(circulo) {
    filtroCirculo = circulo;
    document.querySelectorAll('.filtro-circulo-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-circulo="${circulo}"]`).classList.add('active');
    renderizarSecaoRituais();
};

window.filtrarRituaisPorElemento = function(elemento) {
    filtroElemento = elemento;
    document.querySelectorAll('.filtro-elemento-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-elemento="${elemento}"]`).classList.add('active');
    renderizarSecaoRituais();
};

// ====================== MODAL ADICIONAR DO LIVRO ======================
let abaCirculoModal = 1;
let abaElementoModal = "todos";

function abrirModalAdicionarRituais() {
    document.getElementById("modal-adicionar-rituais").style.display = "flex";
    abaCirculoModal = 1;
    abaElementoModal = "todos";
    document.getElementById("busca-ritual-modal").value = "";
    renderizarRituaisModal();
}

window.fecharModalAdicionarRituais = function() {
    document.getElementById("modal-adicionar-rituais").style.display = "none";
};

window.mudarCirculoModal = function(c) {
    abaCirculoModal = c;
    document.querySelectorAll('#modal-adicionar-rituais .filtro-circulo-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`#modal-adicionar-rituais [data-circulo="${c}"]`).classList.add('active');
    renderizarRituaisModal();
};

window.mudarElementoModalRitual = function(e) {
    abaElementoModal = e;
    document.querySelectorAll('#modal-adicionar-rituais .filtro-elemento-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`#modal-adicionar-rituais [data-elemento="${e}"]`).classList.add('active');
    renderizarRituaisModal();
};

window.filtrarRituaisModal = function() {
    renderizarRituaisModal();
};

function renderizarRituaisModal() {
    const conteudo = document.getElementById("modal-rituais-conteudo");
    const termo = (document.getElementById("busca-ritual-modal").value || "").toLowerCase().trim();

    let filtrados = RITUAIS.filter(r => {
        if (r.circulo !== abaCirculoModal) return false;
        if (abaElementoModal !== "todos" && r.elemento !== abaElementoModal) return false;
        if (termo && !r.nome.toLowerCase().includes(termo)) return false;
        return true;
    });

    if (filtrados.length === 0) {
        conteudo.innerHTML = `<p style="text-align:center; padding:30px; color:var(--text-secondary);">Nenhum ritual encontrado</p>`;
        return;
    }

    let html = '';
    filtrados.forEach(r => {
        const el = ELEMENTO_CORES[r.elemento] || { cor: "#888", icone: "✦" };
        const jaAdicionado = rituaisAprendidos.some(ra => ra.id === r.id);
        html += `
            <div class="item-card" style="border-left: 3px solid ${el.cor};">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span style="font-size:0.72rem; padding:2px 8px; border-radius:10px; background:${el.cor}20; color:${el.cor};">${el.icone} ${r.elemento}</span>
                    <span style="font-size:0.72rem; color:var(--accent); font-weight:700;">${r.custo} PE</span>
                </div>
                <h4>${r.nome}</h4>
                <p style="font-size:0.82rem; color:var(--text-secondary); margin:6px 0; line-height:1.4;">
                    ${r.descricao.substring(0, 100)}${r.descricao.length > 100 ? '...' : ''}
                </p>
                <button onclick="adicionarRitual(${r.id}); event.stopPropagation();" 
                        class="btn-adicionar-modal" ${jaAdicionado ? 'disabled style="opacity:0.5;"' : ''}>
                    ${jaAdicionado ? '✓ Adicionado' : '+ Adicionar'}
                </button>
            </div>`;
    });

    conteudo.innerHTML = html;
}

window.adicionarRitual = function(id) {
    const ritual = buscarRitualPorId(id);
    if (!ritual) return;
    if (rituaisAprendidos.some(r => r.id === id)) {
        alert("⚠️ Este ritual já foi adicionado!");
        return;
    }
    rituaisAprendidos.push({ ...ritual });
    renderizarSecaoRituais();
    renderizarRituaisModal();
    alert(`✅ ${ritual.nome} adicionado aos rituais!`);
};

// ====================== CRIAR RITUAL PERSONALIZADO ======================
function abrirModalCriarRitual() {
    modoModalRitual = 'criar';
    ritualEditandoIndex = -1;
    const modal = document.getElementById("modal-criar-ritual");
    modal.style.display = "flex";
    const titulo = modal.querySelector('h3');
    if (titulo) titulo.textContent = 'Criar Ritual Personalizado';
    renderizarFormCriarRitual();
}

window.fecharModalCriarRitual = function() {
    document.getElementById("modal-criar-ritual").style.display = "none";
    modoModalRitual = 'criar';
    ritualEditandoIndex = -1;
};

function renderizarFormCriarRitual() {
    const conteudo = document.getElementById("form-criar-ritual-conteudo");
    conteudo.innerHTML = `
        <div style="display:grid; gap:12px;">
            <label>Nome do Ritual</label>
            <input id="criar-ritual-nome" type="text" placeholder="Ex: Mão Fantasma">
            
            <label>Elemento</label>
            <select id="criar-ritual-elemento">
                <option value="Conhecimento">🧠 Conhecimento</option>
                <option value="Energia">⚡ Energia</option>
                <option value="Morte">💀 Morte</option>
                <option value="Sangue">🩸 Sangue</option>
                <option value="Medo">👁 Medo</option>
            </select>
            
            <label>Círculo</label>
            <select id="criar-ritual-circulo">
                <option value="1">1º Círculo (1 PE)</option>
                <option value="2">2º Círculo (3 PE)</option>
                <option value="3">3º Círculo (6 PE)</option>
                <option value="4">4º Círculo (10 PE)</option>
            </select>
            
            <label>Execução</label>
            <input id="criar-ritual-execucao" type="text" placeholder="padrão / livre / completa">
            
            <label>Alcance</label>
            <input id="criar-ritual-alcance" type="text" placeholder="toque / curto / médio / longo">
            
            <label>Alvo</label>
            <input id="criar-ritual-alvo" type="text" placeholder="1 ser / você / área...">
            
            <label>Duração</label>
            <input id="criar-ritual-duracao" type="text" placeholder="cena / instantânea / sustentada">
            
            <label>Resistência (opcional)</label>
            <input id="criar-ritual-resistencia" type="text" placeholder="Fortitude parcial / Vontade anula...">
            
            <label>Descrição</label>
            <textarea id="criar-ritual-descricao" rows="4" placeholder="Descreva o efeito do ritual..."></textarea>
            
            <label>Forma Discente — Custo Extra (opcional)</label>
            <input id="criar-ritual-discente-custo" type="text" placeholder="+2 PE">
            <label>Forma Discente — Descrição (opcional)</label>
            <textarea id="criar-ritual-discente-desc" rows="2" placeholder="Efeito da forma discente..."></textarea>
            
            <label>Forma Verdadeiro — Custo Extra (opcional)</label>
            <input id="criar-ritual-verdadeiro-custo" type="text" placeholder="+5 PE">
            <label>Forma Verdadeiro — Descrição (opcional)</label>
            <textarea id="criar-ritual-verdadeiro-desc" rows="2" placeholder="Efeito da forma verdadeira..."></textarea>
        </div>`;
}

window.criarRitualPersonalizado = function() {
    const nome = (document.getElementById('criar-ritual-nome').value || '').trim();
    if (!nome) { alert("❌ Informe o nome do ritual!"); return; }

    const circulo = parseInt(document.getElementById('criar-ritual-circulo').value);
    const custo = CUSTOS_POR_CIRCULO[circulo] || 1;

    let formas = null;
    const dCusto = document.getElementById('criar-ritual-discente-custo').value.trim();
    const dDesc = document.getElementById('criar-ritual-discente-desc').value.trim();
    const vCusto = document.getElementById('criar-ritual-verdadeiro-custo').value.trim();
    const vDesc = document.getElementById('criar-ritual-verdadeiro-desc').value.trim();

    if (dCusto || dDesc || vCusto || vDesc) {
        formas = {
            discente: (dCusto || dDesc) ? { custo: dCusto, descricao: dDesc } : null,
            verdadeiro: (vCusto || vDesc) ? { custo: vCusto, descricao: vDesc } : null
        };
    }

    const novoRitual = {
        id: Date.now(),
        nome,
        elemento: document.getElementById('criar-ritual-elemento').value,
        circulo,
        custo,
        execucao: document.getElementById('criar-ritual-execucao').value || 'padrão',
        alcance: document.getElementById('criar-ritual-alcance').value || 'pessoal',
        alvo: document.getElementById('criar-ritual-alvo').value || 'você',
        duracao: document.getElementById('criar-ritual-duracao').value || 'cena',
        resistencia: document.getElementById('criar-ritual-resistencia').value || null,
        descricao: document.getElementById('criar-ritual-descricao').value || '',
        formas,
        personalizado: true
    };

    if (modoModalRitual === 'editar' && ritualEditandoIndex >= 0) {
        novoRitual.id = rituaisAprendidos[ritualEditandoIndex].id;
        rituaisAprendidos[ritualEditandoIndex] = novoRitual;
    } else {
        rituaisAprendidos.push(novoRitual);
    }

    fecharModalCriarRitual();
    renderizarSecaoRituais();
};

// ====================== AÇÕES ======================
window.visualizarRitual = function(index) {
    const r = rituaisAprendidos[index];
    if (!r) return;

    document.getElementById('visualizar-titulo').textContent = r.nome;
    const el = ELEMENTO_CORES[r.elemento] || { cor: "#888", icone: "✦" };

    let html = `
        <div style="margin-bottom:12px;">
            <span style="padding:3px 10px; border-radius:12px; background:${el.cor}20; color:${el.cor}; font-size:0.82rem; font-weight:600;">
                ${el.icone} ${r.elemento} — ${r.circulo}º Círculo
            </span>
            <span style="margin-left:8px; color:var(--accent); font-weight:700;">${r.custo} PE</span>
        </div>
        <ul style="list-style:none; padding:0; margin:0 0 12px;">
            <li style="margin:6px 0;"><strong>Execução:</strong> ${r.execucao}</li>
            <li style="margin:6px 0;"><strong>Alcance:</strong> ${r.alcance}</li>
            <li style="margin:6px 0;"><strong>Alvo:</strong> ${r.alvo}</li>
            <li style="margin:6px 0;"><strong>Duração:</strong> ${r.duracao}</li>
            ${r.resistencia ? `<li style="margin:6px 0;"><strong>Resistência:</strong> ${r.resistencia}</li>` : ''}
        </ul>
        <p style="line-height:1.6; margin-bottom:12px;">${r.descricao}</p>`;

    if (r.modos && r.modos.length > 0) {
        html += `<h4 style="color:var(--accent); margin:12px 0 8px;">Modos de Uso:</h4>`;
        r.modos.forEach(m => {
            html += `<div style="padding:8px; background:var(--bg-input); border-radius:6px; margin-bottom:6px; border-left:3px solid ${el.cor};">
                <strong>${m.nome}</strong><br><span style="font-size:0.88rem; color:var(--text-secondary);">${m.descricao}</span>
            </div>`;
        });
    }

    if (r.formas) {
        if (r.formas.discente) {
            html += `<div style="padding:8px; background:var(--blue-subtle); border-radius:6px; margin-top:8px; border-left:3px solid var(--blue);">
                <strong style="color:var(--blue);">Discente (${r.formas.discente.custo})</strong><br>
                <span style="font-size:0.88rem;">${r.formas.discente.descricao}</span></div>`;
        }
        if (r.formas.verdadeiro) {
            html += `<div style="padding:8px; background:var(--purple-subtle); border-radius:6px; margin-top:8px; border-left:3px solid var(--purple);">
                <strong style="color:var(--purple);">Verdadeiro (${r.formas.verdadeiro.custo})</strong><br>
                <span style="font-size:0.88rem;">${r.formas.verdadeiro.descricao}</span></div>`;
        }
    }

    document.getElementById('visualizar-conteudo').innerHTML = html;
    document.getElementById('modal-visualizar-item').style.display = 'flex';
};

window.editarRitual = function(index) {
    ritualEditandoIndex = index;
    modoModalRitual = 'editar';
    const r = rituaisAprendidos[index];
    if (!r) return;

    const modal = document.getElementById("modal-criar-ritual");
    modal.style.display = "flex";
    const titulo = modal.querySelector('h3');
    if (titulo) titulo.textContent = 'Editar Ritual';

    renderizarFormCriarRitual();

    setTimeout(() => {
        document.getElementById('criar-ritual-nome').value = r.nome || '';
        document.getElementById('criar-ritual-elemento').value = r.elemento || 'Conhecimento';
        document.getElementById('criar-ritual-circulo').value = r.circulo || 1;
        document.getElementById('criar-ritual-execucao').value = r.execucao || '';
        document.getElementById('criar-ritual-alcance').value = r.alcance || '';
        document.getElementById('criar-ritual-alvo').value = r.alvo || '';
        document.getElementById('criar-ritual-duracao').value = r.duracao || '';
        document.getElementById('criar-ritual-resistencia').value = r.resistencia || '';
        document.getElementById('criar-ritual-descricao').value = r.descricao || '';
        if (r.formas && r.formas.discente) {
            document.getElementById('criar-ritual-discente-custo').value = r.formas.discente.custo || '';
            document.getElementById('criar-ritual-discente-desc').value = r.formas.discente.descricao || '';
        }
        if (r.formas && r.formas.verdadeiro) {
            document.getElementById('criar-ritual-verdadeiro-custo').value = r.formas.verdadeiro.custo || '';
            document.getElementById('criar-ritual-verdadeiro-desc').value = r.formas.verdadeiro.descricao || '';
        }
    }, 10);
};

window.removerRitual = function(index) {
    if (confirm("Remover este ritual?")) {
        rituaisAprendidos.splice(index, 1);
        renderizarSecaoRituais();
    }
};

// ====================== INIT ======================
document.addEventListener("DOMContentLoaded", () => {
    renderizarSecaoRituais();

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            if (document.getElementById("modal-adicionar-rituais").style.display === "flex") fecharModalAdicionarRituais();
            if (document.getElementById("modal-criar-ritual").style.display === "flex") fecharModalCriarRitual();
        }
    });
});
