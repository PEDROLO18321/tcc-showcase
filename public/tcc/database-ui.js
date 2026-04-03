// ==================== database-ui.js ====================
// Interface do gerenciador de fichas (salvar, carregar, exportar, importar)

let fichaAtualId = null;

// ====================== SALVAR FICHA ======================

function salvarFichaDB() {
    if (!dbReady) {
        alert("⏳ Banco de dados ainda está carregando. Tente novamente em alguns segundos.");
        return;
    }

    const dados = coletarDadosFichaAtual();
    if (fichaAtualId) dados.id = fichaAtualId;

    const id = dbSalvarFicha(dados);
    if (id) {
        fichaAtualId = id;
        mostrarNotificacaoDB("✅ Ficha salva com sucesso!", "sucesso");
    } else {
        mostrarNotificacaoDB("⚠️ Ficha salva no localStorage (banco indisponível)", "aviso");
    }
}

// ====================== CARREGAR FICHA ======================

function abrirModalCarregarFicha() {
    if (!dbReady) {
        alert("⏳ Banco de dados ainda está carregando.");
        return;
    }

    const fichas = dbListarFichas();
    const modal = document.getElementById("modal-fichas-db");
    const lista = document.getElementById("lista-fichas-db");

    if (!fichas.length) {
        lista.innerHTML = '<p style="text-align:center;padding:30px;opacity:0.6;">Nenhuma ficha salva ainda.</p>';
    } else {
        lista.innerHTML = fichas.map(f => `
            <div class="ficha-item-db" data-id="${f.id}">
                <div class="ficha-info-db">
                    <strong>${f.nome}</strong>
                    <span class="ficha-detalhes-db">
                        ${f.classe ? f.classe.charAt(0).toUpperCase() + f.classe.slice(1) : 'Sem classe'} 
                        · ${f.origem || 'Sem origem'} 
                        · NEX ${f.nex || 5}%
                    </span>
                    <small class="ficha-data-db">${formatarDataDB(f.data_modificacao)}</small>
                </div>
                <div class="ficha-acoes-db">
                    <button onclick="carregarFichaDB(${f.id})" class="btn-db carregar" title="Carregar">📂</button>
                    <button onclick="exportarFichaDB(${f.id})" class="btn-db exportar" title="Exportar JSON">📤</button>
                    <button onclick="confirmarExcluirFichaDB(${f.id}, '${f.nome.replace(/'/g, "\\'")}')" class="btn-db excluir" title="Excluir">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    modal.classList.add("ativo");
}

function fecharModalFichasDB() {
    document.getElementById("modal-fichas-db")?.classList.remove("ativo");
}

function carregarFichaDB(id) {
    const ficha = dbCarregarFicha(id);
    if (!ficha) {
        alert("Erro ao carregar ficha.");
        return;
    }

    fichaAtualId = id;
    restaurarFichaNaTela(ficha);
    fecharModalFichasDB();
    mostrarNotificacaoDB(`📂 Ficha "${ficha.nome}" carregada!`, "sucesso");
}

function exportarFichaDB(id) {
    dbExportarFichaJSON(id);
    mostrarNotificacaoDB("📤 Ficha exportada como JSON!", "sucesso");
}

function confirmarExcluirFichaDB(id, nome) {
    if (confirm(`Excluir a ficha "${nome}"? Esta ação não pode ser desfeita.`)) {
        dbExcluirFicha(id);
        if (fichaAtualId === id) fichaAtualId = null;
        abrirModalCarregarFicha(); // Atualiza lista
        mostrarNotificacaoDB("🗑️ Ficha excluída.", "aviso");
    }
}

// ====================== IMPORTAR FICHA ======================

function importarFichaArquivo() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
        const arquivo = e.target.files[0];
        if (!arquivo) return;

        try {
            const resultado = await dbImportarFichaJSON(arquivo);
            mostrarNotificacaoDB(`✅ Ficha "${resultado.nome}" importada!`, "sucesso");
            abrirModalCarregarFicha();
        } catch (err) {
            alert("❌ Erro ao importar: " + (err.erro || err.message));
        }
    };
    input.click();
}

// ====================== BACKUP COMPLETO ======================

function exportarBackupDB() {
    dbExportarBancoCompleto();
    mostrarNotificacaoDB("💾 Backup completo exportado!", "sucesso");
}

function importarBackupDB() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".db,.sqlite";
    input.onchange = async (e) => {
        const arquivo = e.target.files[0];
        if (!arquivo) return;

        if (!confirm("Isso substituirá TODOS os dados atuais. Continuar?")) return;

        try {
            await dbImportarBancoCompleto(arquivo);
            mostrarNotificacaoDB("✅ Backup restaurado! Recarregando...", "sucesso");
            setTimeout(() => location.reload(), 1500);
        } catch (err) {
            alert("❌ Erro: " + (err.erro || err.message));
        }
    };
    input.click();
}

// ====================== INFO DO BANCO ======================

function mostrarInfoBanco() {
    if (!dbReady) {
        alert("Banco não inicializado.");
        return;
    }

    const stats = dbEstatisticas();
    const modal = document.getElementById("modal-fichas-db");
    const lista = document.getElementById("lista-fichas-db");

    lista.innerHTML = `
        <div class="db-info-panel">
            <h3>Estatísticas do Banco de Dados</h3>
            <div class="db-stats-grid">
                <div class="db-stat-card">
                    <div class="db-stat-num">${stats.origens}</div>
                    <div class="db-stat-label">Origens</div>
                </div>
                <div class="db-stat-card">
                    <div class="db-stat-num">${stats.pericias}</div>
                    <div class="db-stat-label">Perícias</div>
                </div>
                <div class="db-stat-card">
                    <div class="db-stat-num">${stats.itens}</div>
                    <div class="db-stat-label">Itens</div>
                </div>
                <div class="db-stat-card">
                    <div class="db-stat-num">${stats.rituais}</div>
                    <div class="db-stat-label">Rituais</div>
                </div>
                <div class="db-stat-card">
                    <div class="db-stat-num">${stats.itens_amaldicoados}</div>
                    <div class="db-stat-label">Amaldiçoados</div>
                </div>
                <div class="db-stat-card destaque">
                    <div class="db-stat-num">${stats.fichas}</div>
                    <div class="db-stat-label">Fichas Salvas</div>
                </div>
            </div>
            <div class="db-info-footer">
                <small>SQLite via sql.js · Persistência via IndexedDB</small>
            </div>
        </div>
    `;

    modal.classList.add("ativo");
}

// ====================== NOTIFICAÇÃO ======================

function mostrarNotificacaoDB(mensagem, tipo = "sucesso") {
    // Remove notificação anterior
    const existente = document.querySelector(".db-notificacao");
    if (existente) existente.remove();

    const div = document.createElement("div");
    div.className = `db-notificacao ${tipo}`;
    div.textContent = mensagem;
    document.body.appendChild(div);

    setTimeout(() => div.classList.add("visivel"), 10);
    setTimeout(() => {
        div.classList.remove("visivel");
        setTimeout(() => div.remove(), 300);
    }, 3000);
}

// ====================== HELPERS ======================

function formatarDataDB(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

// ====================== INICIALIZAÇÃO ======================

document.addEventListener("DOMContentLoaded", function() {
    const btnSalvar = document.getElementById("btn-salvar-ficha");
    const btnCarregar = document.getElementById("btn-carregar-ficha");

    if (btnSalvar) btnSalvar.onclick = salvarFichaDB;
    if (btnCarregar) btnCarregar.onclick = abrirModalCarregarFicha;

    // Auto-abrir gerenciador se veio da index com ?gerenciar=1
    if (new URLSearchParams(window.location.search).get("gerenciar") === "1") {
        window.addEventListener('db-ready', () => {
            setTimeout(abrirModalCarregarFicha, 300);
        });
    }
});

// Expose
window.salvarFichaDB = salvarFichaDB;
window.abrirModalCarregarFicha = abrirModalCarregarFicha;
window.fecharModalFichasDB = fecharModalFichasDB;
window.importarFichaArquivo = importarFichaArquivo;
window.exportarBackupDB = exportarBackupDB;
window.importarBackupDB = importarBackupDB;
window.mostrarInfoBanco = mostrarInfoBanco;
