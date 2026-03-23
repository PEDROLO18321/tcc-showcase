/* =========================
   SISTEMA DE PODERES DE ORIGEM
========================= */

let poderAtivo = null;
let poderesOrigem = [];
let escolhendoPericia = false;
let saberEPoderActivated = false;  // Para Acadêmico
let manualSobreviventeActivated = false;  // Para Explorador
let processoOtimizadoActivated = false;  // Para Executivo
let atravesDaLenteActivated = false;  // Para Fotógrafo
let faroParaPistasActivated = false;  // Para Investigador
let onclickFunction = '';
let lutoHabitualActivated = false;  // Para Legista
let maosNoVolanteActivated = false;  // Para Motorista
let encontrarAVerdadeActivated = false;  // Para Repórter Investigativo
let espiritoCivicoActivated = false;  // Para Servidor Público
let desbravadorActivated = false;   // Trabalhador Rural
let impostorActivated = false;      // Trambiqueiro

// Função auxiliar para obter nome da perícia (se a função existir)
function obterNomePericiaWrapper(idPericia) {
    if (typeof obterNomePericia === 'function') {
        return obterNomePericia(idPericia);
    }
    
    // Fallback: mapeamento básico se a função não existir
    const mapeamento = {
        'acrobacia': 'Acrobacia',
        'adestramento': 'Adestramento',
        'artes': 'Artes',
        'atletismo': 'Atletismo',
        'atualidades': 'Atualidades',
        'ciencias': 'Ciências',
        'crime': 'Crime',
        'diplomacia': 'Diplomacia',
        'enganacao': 'Enganação',
        'fortitude': 'Fortitude',
        'furtividade': 'Furtividade',
        'iniciativa': 'Iniciativa',
        'intimidacao': 'Intimidação',
        'intuicao': 'Intuição',
        'investigacao': 'Investigação',
        'luta': 'Luta',
        'medicina': 'Medicina',
        'ocultismo': 'Ocultismo',
        'percepcao': 'Percepção',
        'pilotagem': 'Pilotagem',
        'pontaria': 'Pontaria',
        'profissao': 'Profissão',
        'reflexos': 'Reflexos',
        'religiao': 'Religião',
        'sobrevivencia': 'Sobrevivência',
        'tatica': 'Tática',
        'tecnologia': 'Tecnologia',
        'vontade': 'Vontade'
    };
    
    return mapeamento[idPericia] || idPericia;
}

// Função para mostrar/ocultar a seção de poderes
function atualizarSecaoPoderes() {
    const secaoPoderes = document.getElementById('secao-poderes');
    const containerPoderes = document.getElementById('poderes-container');
    
    if (!window.origemConfirmadaId || !origemSelecionada) {
        secaoPoderes.style.display = 'none';
        containerPoderes.innerHTML = '';
        return;
    }
    
    // Mostrar seção de poderes
    secaoPoderes.style.display = 'block';
    
    // Criar interface do poder
    criarInterfacePoder(origemSelecionada);
}

function criarInterfacePoder(origem) {
    const container = document.getElementById('poderes-container');
    container.innerHTML = '';
    
    if (!origem || !origem.poder) return;
    
    const poder = origem.poder;
    
    // Determinar pontos disponíveis baseado no modo (apenas para poderes ativos)
    const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
    let pontosDisponiveis = 0;
    let tipoPonto = "";
    
    if (modo === "nex") {
        pontosDisponiveis = Number(document.getElementById("esforco_atual").value) || 0;
        tipoPonto = "PE";
    } else {
        pontosDisponiveis = Number(document.getElementById("determinacao_atual").value) || 0;
        tipoPonto = "PD";
    }
    
    // HTML base para todos os poderes
    let poderHTML = `
        <div class="poder-card" id="poder-${origem.nome.toLowerCase()}" data-origem="${origem.nome.toLowerCase()}" data-tipo="${poder.tipo}">
            <h3>
                ${poder.nome}
                <span class="poder-status ${poder.tipo === 'passivo' || poder.tipo === 'passivo_escolha' || poder.tipo === 'passivo_escolha_cosplay' ? 'disponivel' : 'disponivel'}">
                    ${poder.tipo === 'passivo' ? 'Passivo' : 
                      poder.tipo === 'passivo_escolha' ? 'Passivo (Escolha)' : 
                      poder.tipo === 'passivo_escolha_cosplay' ? 'Passivo (Cosplay)' :
                      poder.tipo === 'narrativo' ? 'Narrativo' : 
                      poder.tipo === 'ativo_escolha' ? 'Ativo (Escolha)' : 
                      poder.tipo === 'ativo_passivo' ? 'Ativo/Passivo' : 
                      'Ativo'}
                </span>
            </h3>
            
            <p class="poder-descricao">${poder.descricao}</p>
    `;
    
    // SE O PODER FOR ATIVO COM CUSTO ESCALONÁVEL (como Astronauta)
    if (poder.tipo === "ativo" && origem.nome === "Astronauta") {
        // Verificar se pode usar
        const podeUsar = poder.podeUsar ? poder.podeUsar() : false;
        
        // Obter informações do custo
        const infoCusto = poder.verCustoAtual ? poder.verCustoAtual() : { 
            custoAtual: poder.custo.pe, 
            usosNaCena: 0 
        };
        
        poderHTML += `
            <div class="poder-ativo-escalonavel">
                <div class="poder-info-escalonavel">
                    <div class="info-custo">
                        <span class="custo-atual">Custo atual: <strong>${infoCusto.custoAtual} ${tipoPonto}</strong></span>
                        <span class="usos-cena">Usos na cena: ${infoCusto.usosNaCena || 0}</span>
                    </div>
                    
                    <div class="info-efeito">
                        <span class="reducao-dano">Redução de dano: <strong>${poder.reducaoDano || 0}</strong></span>
                    </div>
                </div>
                
                <div class="poder-acoes">
                    <button class="btn-ativar-poder" onclick="ativarReducaoDanoAstronauta()" ${!podeUsar ? 'disabled' : ''}>
                        Ativar Redução (${infoCusto.custoAtual} ${tipoPonto})
                    </button>
                    <button class="btn-reset-cena" onclick="resetarCenaAstronauta()">Resetar Cena</button>
                </div>
            </div>
        `;
    } else if (poder.tipo === "ativo") {
        const podeUsar = poder.podeUsar ? poder.podeUsar() : pontosDisponiveis >= (poder.custo?.pe || 0);
        let onclickFunction = '';

        // Defina onclick baseado na origem
        if (origem.nome === "Acadêmico") {
            onclickFunction = 'ativarSaberEPoder()';
        } else if (origem.nome === "Explorador") {
            onclickFunction = 'ativarManualSobrevivente()';
        } else if (origem.nome === "Fotógrafo") {
            onclickFunction = 'ativarAtravesDaLente()';
        } else if (origem.nome === "Investigador") {
            onclickFunction = 'ativarFaroParaPistas()';
        } else if (origem.nome === "Jovem Místico") {
            onclickFunction = 'ativarCulpaDasEstrelas()';
        } else if (origem.nome === "Mercenário") {
            onclickFunction = 'ativarPosicaoDeCombate()';
        } else if (origem.nome === "Mateiro") {
            onclickFunction = 'ativarMapaCeleste()';
        } else if (origem.nome === "Motorista") {
            onclickFunction = 'ativarMaosNoVolante()';
        } else if (origem.nome === "Psicólogo") {
            onclickFunction = 'ativarTerapia()';
        } else if (origem.nome === "Repórter Investigativo") {
            onclickFunction = 'ativarEncontrarAVerdade()';
        } else if (origem.nome === "Servidor Público") {
            onclickFunction = 'ativarEspiritoCivico()';
        } else if (origem.nome === "T.I.") {
            onclickFunction = 'ativarMotorDeBusca()';
        } else if (origem.nome === "Trabalhador Rural") {
            onclickFunction = 'ativarDesbravador()';
        } else if (origem.nome === "Trambiqueiro") {
            onclickFunction = 'ativarImpostor()';
        } else {
            onclickFunction = `ativarPoder('${origem.nome.toLowerCase()}')`;
        }

        poderHTML += `
            <div class="poder-ativo-info">
                <span>Custo: ${poder.custo?.pe || 0} ${tipoPonto}</span>
                <span>Pontos disponíveis: ${pontosDisponiveis}</span>
            </div>
            
            <button class="btn-ativar-poder" onclick="${onclickFunction}" ${!podeUsar ? 'disabled' : ''}>
                Ativar Poder
            </button>
            
            <div id="poder-mensagem-${origem.nome.toLowerCase()}" class="poder-mensagem"></div>
        `;
    } else if (poder.tipo === "passivo") {
        poderHTML += `
            <div class="poder-passivo">
                <p class="poder-descricao">${poder.descricao}</p>
        `;
        
        // Suporte específico para Calejado (Desgarrado): Mostrar bônus atual
        if (poder.efeito === "bonus_pv_por_nex") {
            const nex = Number(document.getElementById("nex").value) || 0;
            const bonusPV = Math.floor(nex / 5);
            poderHTML += `
                <div class="poder-info-extra">
                    <strong>Bônus atual:</strong> +${bonusPV} PV (baseado em NEX ${nex}%)
                </div>
            `;
        }
        
        poderHTML += `</div>`;
    } else if (poder.tipo === "passivo_escolha" || poder.tipo === "passivo_escolha_cosplay") {
        const periciaEscolhida = poder.periciaEscolhida;
        const isCosplay = poder.tipo === "passivo_escolha_cosplay";
        
        // Filtro de perícias se for Experimento
        let periciasFiltradas = PERICIAS;
        if (origem.nome === "Experimento") {
            periciasFiltradas = PERICIAS.filter(p => ['forca', 'agilidade', 'vigor'].includes(p.atributo));
        }
        
        poderHTML += `
            <div class="poder-passivo-escolha">
                <div class="escolha-status">
                    <strong>Perícia escolhida:</strong> ${periciaEscolhida ? obterNomePericiaWrapper(periciaEscolhida) : 'Nenhuma selecionada'}
                </div>
                
                ${periciaEscolhida ? `
                    <div class="poder-bonus-atual">
                        Bônus aplicado: +${poder.bonus || 2} em ${obterNomePericiaWrapper(periciaEscolhida)}
                        ${isCosplay ? '<small class="poder-nota">(Requer cosplay apropriado para ativar)</small>' : ''}
                    </div>
                    
                    <button class="btn-alterar-escolha" onclick="alterarEscolhaPericia('${origem.nome.toLowerCase()}')">
                        Alterar Escolha
                    </button>
                ` : `
                    <button class="btn-escolher-pericia" onclick="abrirSelecaoPericia('${origem.nome.toLowerCase()}')">
                        Escolher Perícia
                    </button>
                `}
                
                <div id="selecao-pericia-${origem.nome.toLowerCase()}" class="selecao-pericia-container" style="display: none;">
                    <h4>Escolha uma perícia para o bônus:</h4>
                    <div class="pericias-grid">
                        ${periciasFiltradas.map(p => `
                            <label class="pericia-opcao">
                                <input type="radio" name="pericia-escolha-${origem.nome.toLowerCase()}" value="${p.nome.toLowerCase()}">
                                ${p.nome} (${p.atributo})
                            </label>
                        `).join('')}
                    </div>
                    <div class="acoes-escolha">
                        <button onclick="confirmarEscolhaPericia('${origem.nome.toLowerCase()}')">Confirmar</button>
                        <button onclick="cancelarEscolhaPericia('${origem.nome.toLowerCase()}')">Cancelar</button>
                    </div>
                </div>
            </div>
        `;
    } else if (poder.tipo === "narrativo") {
        poderHTML += `
            <div class="poder-narrativo">
                <ul class="poder-habilidades">
                    ${poder.habilidades ? poder.habilidades.map(h => `<li>${h}</li>`).join('') : ''}
                </ul>
            </div>
        `;
    } else if (poder.tipo === "ativo_passivo") {
        const podeUsar = poder.podeUsar ? poder.podeUsar() : pontosDisponiveis >= (poder.custo?.pe || 0);
        
        poderHTML += `
            <div class="poder-ativo-passivo">
                <div class="poder-bonus-passivo">
                    <strong>Bônus passivo:</strong> ${origem.nome === "Legista" ? "Metade do dano mental em cenas relacionadas (narrativo)" : "+2 em Diplomacia"}
                </div>
                
                <div class="poder-ativo-info">
                    <span>Custo: ${poder.custo?.pe || 0} ${tipoPonto}</span>
                    <span>Pontos disponíveis: ${pontosDisponiveis}</span>
                    <p class="poder-nota">${origem.nome === "Legista" ? "Para testes de Medicina em primeiros socorros/necropsia (combine com o Mestre)" : "Requer contato com NPC auxiliar (combinado com o Mestre)"}</p>
                </div>
                
                <button class="btn-ativar-poder" onclick="ativarLutoHabitual('${origem.nome.toLowerCase()}')" ${!podeUsar ? 'disabled' : ''}>
                    Ativar +${poder.bonus}
                </button>
                
                <div id="poder-mensagem-${origem.nome.toLowerCase()}" class="poder-mensagem"></div>
            </div>
        `;
    } else if (poder.tipo === "ativo_escolha") {
        const periciaEscolhida = poder.periciaEscolhida;
        const podeUsar = poder.podeUsar ? poder.podeUsar() : pontosDisponiveis >= (poder.custo?.pe || 0);
        
        poderHTML += `
            <div class="poder-ativo-escolha">
                <div class="escolha-status">
                    <strong>Perícia escolhida:</strong> ${periciaEscolhida ? obterNomePericiaWrapper(periciaEscolhida) : 'Nenhuma selecionada'}
                </div>
                
                ${periciaEscolhida ? `
                    <div class="poder-bonus-atual">
                        Bônus possível: +${poder.bonus || 0} em ${obterNomePericiaWrapper(periciaEscolhida)} (ao ativar, gasta ${poder.custo.pe} ${tipoPonto})
                        <small class="poder-nota">(Aplique em testes estendidos ou revisão de documentos; combine com o Mestre)</small>
                    </div>
                    
                    <button class="btn-ativar-poder" onclick="ativarProcessoOtimizado('${origem.nome.toLowerCase()}')" ${!podeUsar ? 'disabled' : ''}>
                        Ativar +${poder.bonus} (${poder.custo.pe} ${tipoPonto})
                    </button>
                    
                    <button class="btn-alterar-escolha" onclick="alterarEscolhaPericia('${origem.nome.toLowerCase()}')">
                        Alterar Perícia
                    </button>
                ` : `
                    <button class="btn-escolher-pericia" onclick="abrirSelecaoPericia('${origem.nome.toLowerCase()}')">
                        Escolher Perícia
                    </button>
                `}
                
                <div id="selecao-pericia-${origem.nome.toLowerCase()}" class="selecao-pericia-container" style="display: none;">
                    <h4>Escolha uma perícia para o bônus:</h4>
                    <div class="pericias-grid">
                        ${PERICIAS.map(p => `
                            <label class="pericia-opcao">
                                <input type="radio" name="pericia-escolha-${origem.nome.toLowerCase()}" value="${p.nome.toLowerCase()}">
                                ${p.nome} (${p.atributo})
                            </label>
                        `).join('')}
                    </div>
                    <div class="acoes-escolha">
                        <button onclick="confirmarEscolhaPericia('${origem.nome.toLowerCase()}')">Confirmar</button>
                        <button onclick="cancelarEscolhaPericia('${origem.nome.toLowerCase()}')">Cancelar</button>
                    </div>
                </div>
                
                <div id="poder-mensagem-${origem.nome.toLowerCase()}" class="poder-mensagem"></div>
            </div>
        `;
    }
    
    // Fechar a div do poder
    poderHTML += `</div>`;
    
    container.innerHTML = poderHTML;
}

// Função para ativar Saber é Poder (Acadêmico)
function ativarSaberEPoder() {
    if (origemSelecionada && origemSelecionada.nome === "Acadêmico") {
        const resultado = origemSelecionada.poder.usar('intelecto');
        if (resultado.sucesso) {
            saberEPoderActivated = true;
            mostrarMensagemPoder(resultado.mensagem, 'success');
        } else {
            mostrarMensagemPoder(resultado.mensagem, 'error');
        }
        atualizarSecaoPoderes();
    }
}

// Função para ativar Manual do Sobrevivente (Explorador)
function ativarManualSobrevivente() {
    if (origemSelecionada && origemSelecionada.nome === "Explorador") {
        const resultado = origemSelecionada.poder.usar();
        if (resultado.sucesso) {
            manualSobreviventeActivated = true;
            mostrarMensagemPoder(resultado.mensagem, 'success');
        } else {
            mostrarMensagemPoder(resultado.mensagem, 'error');
        }
        atualizarSecaoPoderes();
    }
}

// Função para ativar Conexões NPC (Diplomata)
function ativarConexoesNPC(origemId) {
    const poder = origemSelecionada.poder;
    const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
    let pontosElement;
    let tipoPonto;

    if (modo === "nex") {
        pontosElement = document.getElementById("esforco_atual");
        tipoPonto = "PE";
    } else {
        pontosElement = document.getElementById("determinacao_atual");
        tipoPonto = "PD";
    }

    const pontosAtual = Number(pontosElement.value) || 0;

    if (pontosAtual < poder.custo.pe) {
        mostrarMensagemPoder(`Pontos de ${tipoPonto} insuficientes!`, 'error');
        return;
    }

    // Gastar pontos
    pontosElement.value = pontosAtual - poder.custo.pe;

    // Mostrar mensagem (resultado do Mestre é narrativo)
    mostrarMensagemPoder(`Conexões ativadas! Gastos ${poder.custo.pe} ${tipoPonto}. Agora, combine com o Mestre para substituir o teste por Diplomacia.`, 'success');
    
    // Atualizar UI
    atualizarSecaoPoderes();
}

// Função para ativar Processo Otimizado (Executivo)
function ativarProcessoOtimizado(origemId) {
    if (origemSelecionada && origemSelecionada.nome.toLowerCase() === origemId) {
        const resultado = origemSelecionada.poder.usar();
        if (resultado.sucesso) {
            processoOtimizadoActivated = true;
            mostrarMensagemPoder(resultado.mensagem, 'success');
        } else {
            mostrarMensagemPoder(resultado.mensagem, 'error');
        }
        atualizarSecaoPoderes();
    }
}

// Função para ativar Através da Lente (Fotógrafo)
function ativarAtravesDaLente() {
    if (origemSelecionada && origemSelecionada.nome === "Fotógrafo") {
        const resultado = origemSelecionada.poder.usar();
        if (resultado.sucesso) {
            atravesDaLenteActivated = true;
            mostrarMensagemPoder(resultado.mensagem, 'success');
        } else {
            mostrarMensagemPoder(resultado.mensagem, 'error');
        }
        atualizarSecaoPoderes();
    }
}

function ativarFaroParaPistas() {
    if (origemSelecionada && origemSelecionada.nome === "Investigador") {
        const resultado = origemSelecionada.poder.usar();
        if (resultado.sucesso) {
            faroParaPistasActivated = true;
            mostrarMensagemPoder(resultado.mensagem, 'success');
        } else {
            mostrarMensagemPoder(resultado.mensagem, 'error');
        }
        atualizarSecaoPoderes();
    }
}

// Função para ativar redução de dano do Astronauta
function ativarReducaoDanoAstronauta() {
    // Implementação se necessária
}

// Função para resetar cena do Astronauta
function resetarCenaAstronauta() {
    // Implementação se necessária
}

// Função para ver custo do Astronauta
function verCustoAstronauta() {
    // Implementação se necessária
}

// Função para verificar bônus de poder
function verificarBonusPoder(periciaNome, atributo) {
    // Implementação se necessária
    return 0;
}

// Função para resetar bônus de poder (usada ao alterar origem)
function resetarBonusPoder() {
    saberEPoderActivated = false;
    manualSobreviventeActivated = false;
    processoOtimizadoActivated = false;
    atravesDaLenteActivated = false;
    faroParaPistasActivated = false;
    lutoHabitualActivated = false;
    maosNoVolanteActivated = false;
    encontrarAVerdadeActivated = false;
    espiritoCivicoActivated = false;
    desbravadorActivated = false;
    impostorActivated = false;
    console.log("Todos os bônus de poderes de origem foram resetados.");
}

// Função para cancelar bônus de poder
function cancelarBonusPoder() {
    // Implementação se necessária
}

// Função para abrir a seleção de perícia
function abrirSelecaoPericia(origemId) {
    const selecaoContainer = document.getElementById(`selecao-pericia-${origemId}`);
    if (selecaoContainer) {
        selecaoContainer.style.display = 'block';
    } else {
        console.error(`Container de seleção não encontrado para ${origemId}`);
    }
    escolhendoPericia = true;
}

// Função para confirmar a escolha de perícia
function confirmarEscolhaPericia(origemId) {
    const radioSelecionado = document.querySelector(`input[name="pericia-escolha-${origemId}"]:checked`);
    if (!radioSelecionado) {
        mostrarMensagemPoder('Selecione uma perícia primeiro!', 'error');
        return;
    }
    const periciaId = radioSelecionado.value;
    
    // Encontrar a origem (use origemSelecionada global)
    if (origemSelecionada && origemSelecionada.nome.toLowerCase() === origemId) {
        if (typeof origemSelecionada.poder.escolherPericia === 'function') {
            const resultado = origemSelecionada.poder.escolherPericia(periciaId);
            if (resultado.sucesso) {
                mostrarMensagemPoder(resultado.mensagem, 'success');
                cancelarEscolhaPericia(origemId);  // Fecha o container após confirmar
                atualizarSecaoPoderes();  // Atualiza a UI do poder
            } else {
                mostrarMensagemPoder('Erro ao escolher perícia.', 'error');
            }
        } else {
            console.error('Função escolherPericia não encontrada no poder');
            mostrarMensagemPoder('Erro interno: função de escolha não disponível.', 'error');
        }
    } else {
        console.error(`Origem não encontrada para ${origemId}`);
    }
}

// Função para cancelar a escolha de perícia
function cancelarEscolhaPericia(origemId) {
    const selecaoContainer = document.getElementById(`selecao-pericia-${origemId}`);
    if (selecaoContainer) {
        selecaoContainer.style.display = 'none';
        // Limpar seleção de rádio (opcional, para resetar)
        const radios = document.querySelectorAll(`input[name="pericia-escolha-${origemId}"]`);
        radios.forEach(r => r.checked = false);
    }
    escolhendoPericia = false;
}

// Função para alterar a escolha de perícia (reseta e reabre seleção)
function alterarEscolhaPericia(origemId) {
    if (origemSelecionada && origemSelecionada.nome.toLowerCase() === origemId) {
        origemSelecionada.poder.periciaEscolhida = null;
        mostrarAvisoFlutuante('Escolha resetada. Selecione uma nova perícia.');
        mostrarMensagemPoder('Perícia resetada. Você pode escolher uma nova.', 'success');
        atualizarSecaoPoderes();
        // Reabrir seleção após reset
        setTimeout(() => {
            abrirSelecaoPericia(origemId);
        }, 300);  // Pequeno delay para evitar flicker
    } else {
        console.error(`Origem não encontrada para alteração: ${origemId}`);
    }
}

// Função para resetar escolha de Cosplay (se aplicável)
function resetarEscolhaCosplay() {
    // Implementação se necessário
}

// Função para ativar poder genérico
function ativarPoderUso() {
    // Implementação genérica
}

// Função para ativar poder ação
function ativarPoderAcao() {
    // Implementação genérica
}

// Função para ativar poder
function ativarPoder(origemId) {
    // Implementação genérica para ativação
}

// Função para mostrar aviso flutuante (placeholder, implemente conforme necessário)
function mostrarAvisoFlutuante(mensagem) {
    console.log('Aviso: ' + mensagem);  // Substitua por implementação real (ex: toast)
}

// Função para mostrar mensagem no poder
function mostrarMensagemPoder(mensagem, tipo) {
    const origemId = origemSelecionada.nome.toLowerCase();
    const mensagemElement = document.getElementById(`poder-mensagem-${origemId}`);
    if (mensagemElement) {
        mensagemElement.innerHTML = `<span class="${tipo}">${mensagem}</span>`;
        // Adicione classes CSS para 'success' e 'error' em style.css se necessário
    } else {
        console.log(`${tipo.toUpperCase()}: ${mensagem}`);
    }
}

// Atualizar a seção de poderes quando houver mudanças
document.addEventListener('DOMContentLoaded', function() {
    // Observar mudanças nos campos de PE/PD
    document.getElementById('esforco_atual')?.addEventListener('input', atualizarSecaoPoderes);
    document.getElementById('determinacao_atual')?.addEventListener('input', atualizarSecaoPoderes);
    
    // Observar mudanças no modo (NEX/Nível)
    document.querySelectorAll('input[name="modo"]').forEach(el => {
        el.addEventListener('change', atualizarSecaoPoderes);
    });

    // Novo: Observar mudanças no NEX para atualizar bônus passivos como Calejado
    document.getElementById('nex')?.addEventListener('input', atualizarSecaoPoderes);
    document.getElementById('nivel')?.addEventListener('input', atualizarSecaoPoderes);
});

// Função para ativar A Culpa é das Estrelas (Jovem Místico)
function ativarCulpaDasEstrelas() {
    if (origemSelecionada && origemSelecionada.nome === "Jovem Místico") {
        const resultado = origemSelecionada.poder.usar();
        if (resultado.sucesso) {
            mostrarMensagemPoder(resultado.mensagem, 'success');
        } else {
            mostrarMensagemPoder(resultado.mensagem, 'error');
        }
        atualizarSecaoPoderes();
    }
}

// Função para ativar Luto Habitual (Legista)
function ativarLutoHabitual(origemId) {
    if (origemSelecionada && origemSelecionada.nome.toLowerCase() === origemId) {
        const resultado = origemSelecionada.poder.usar();
        if (resultado.sucesso) {
            lutoHabitualActivated = true;
            mostrarMensagemPoder(resultado.mensagem, 'success');
        } else {
            mostrarMensagemPoder(resultado.mensagem, 'error');
        }
        atualizarSecaoPoderes();
    }
}

// Função para ativar Posição de Combate (Mercenário)
function ativarPosicaoDeCombate() {
    if (origemSelecionada && origemSelecionada.nome === "Mercenário") {
        const resultado = origemSelecionada.poder.usar();
        if (resultado.sucesso) {
            mostrarMensagemPoder(resultado.mensagem, 'success');
        } else {
            mostrarMensagemPoder(resultado.mensagem, 'error');
        }
        atualizarSecaoPoderes();
    }
}

// Função para ativar Mapa Celeste (Mateiro)
function ativarMapaCeleste() {
    if (origemSelecionada && origemSelecionada.nome === "Mateiro") {
        const resultado = origemSelecionada.poder.usar();
        if (resultado.sucesso) {
            mostrarMensagemPoder(resultado.mensagem, 'success');
        } else {
            mostrarMensagemPoder(resultado.mensagem, 'error');
        }
        atualizarSecaoPoderes();
    }
}

function ativarMaosNoVolante() {
    if (origemSelecionada && origemSelecionada.nome === "Motorista") {
        const resultado = origemSelecionada.poder.usar();
        if (resultado.sucesso) {
            mostrarMensagemPoder(resultado.mensagem, 'success');
        } else {
            mostrarMensagemPoder(resultado.mensagem, 'error');
        }
        atualizarSecaoPoderes();
    }
}

// Função para ativar Terapia (Psicólogo)
function ativarTerapia() {
    if (origemSelecionada && origemSelecionada.nome === "Psicólogo") {
        const resultado = origemSelecionada.poder.usar();
        if (resultado.sucesso) {
            mostrarMensagemPoder(resultado.mensagem, 'success');
        } else {
            mostrarMensagemPoder(resultado.mensagem, 'error');
        }
        atualizarSecaoPoderes();
    }
}

// Função para ativar Encontrar a Verdade (Repórter Investigativo)
function ativarEncontrarAVerdade() {
    if (origemSelecionada && origemSelecionada.nome === "Repórter Investigativo") {
        const resultado = origemSelecionada.poder.usar();
        if (resultado.sucesso) {
            mostrarMensagemPoder(resultado.mensagem, 'success');
        } else {
            mostrarMensagemPoder(resultado.mensagem, 'error');
        }
        atualizarSecaoPoderes();
    }
}

// Função para ativar Espírito Cívico (Servidor Público)
function ativarEspiritoCivico() {
    if (origemSelecionada && origemSelecionada.nome === "Servidor Público") {
        const resultado = origemSelecionada.poder.usar();
        if (resultado.sucesso) {
            mostrarMensagemPoder(resultado.mensagem, 'success');
        } else {
            mostrarMensagemPoder(resultado.mensagem, 'error');
        }
        atualizarSecaoPoderes();
    }
}

// Função para ativar Motor de Busca (T.I.)
function ativarMotorDeBusca() {
    if (origemSelecionada && origemSelecionada.nome === "T.I.") {
        const resultado = origemSelecionada.poder.usar();
        if (resultado.sucesso) {
            mostrarMensagemPoder(resultado.mensagem, 'success');
        } else {
            mostrarMensagemPoder(resultado.mensagem, 'error');
        }
        atualizarSecaoPoderes();
    }
}

// Função para ativar Desbravador (Trabalhador Rural)
function ativarDesbravador() {
    if (origemSelecionada && origemSelecionada.nome === "Trabalhador Rural") {
        const resultado = origemSelecionada.poder.usar();
        if (resultado.sucesso) {
            mostrarMensagemPoder(resultado.mensagem, 'success');
        } else {
            mostrarMensagemPoder(resultado.mensagem, 'error');
        }
        atualizarSecaoPoderes();
    }
}

// Função para ativar Impostor (Trambiqueiro)
function ativarImpostor() {
    if (origemSelecionada && origemSelecionada.nome === "Trambiqueiro") {
        const resultado = origemSelecionada.poder.usar();
        if (resultado.sucesso) {
            mostrarMensagemPoder(resultado.mensagem, 'success');
        } else {
            mostrarMensagemPoder(resultado.mensagem, 'error');
        }
        atualizarSecaoPoderes();
    }
}

// Exportar funções para uso global
window.ativarSaberEPoder = ativarSaberEPoder;
window.ativarPoder = ativarPoder;
window.ativarPoderUso = ativarPoderUso;
window.ativarPoderAcao = ativarPoderAcao;
window.ativarReducaoDanoAstronauta = ativarReducaoDanoAstronauta;
window.resetarCenaAstronauta = resetarCenaAstronauta;
window.verCustoAstronauta = verCustoAstronauta;
window.verificarBonusPoder = verificarBonusPoder;
window.resetarBonusPoder = resetarBonusPoder;
window.cancelarBonusPoder = cancelarBonusPoder;
window.atualizarSecaoPoderes = atualizarSecaoPoderes;
window.mostrarAvisoFlutuante = mostrarAvisoFlutuante;
window.abrirSelecaoPericia = abrirSelecaoPericia;
window.confirmarEscolhaPericia = confirmarEscolhaPericia;
window.cancelarEscolhaPericia = cancelarEscolhaPericia;
window.alterarEscolhaPericia = alterarEscolhaPericia;
window.ativarConexoesNPC = ativarConexoesNPC;
window.ativarProcessoOtimizado = ativarProcessoOtimizado;
window.resetarEscolhaCosplay = resetarEscolhaCosplay;
window.mostrarMensagemPoder = mostrarMensagemPoder;
window.ativarManualSobrevivente = ativarManualSobrevivente;
window.ativarAtravesDaLente = ativarAtravesDaLente;
window.ativarFaroParaPistas = ativarFaroParaPistas;
window.ativarCulpaDasEstrelas = ativarCulpaDasEstrelas;
window.ativarLutoHabitual = ativarLutoHabitual;
window.ativarPosicaoDeCombate = ativarPosicaoDeCombate;
window.ativarMapaCeleste = ativarMapaCeleste;
window.ativarMaosNoVolante = ativarMaosNoVolante;
window.ativarTerapia = ativarTerapia;
window.ativarEncontrarAVerdade = ativarEncontrarAVerdade;
window.ativarEspiritoCivico = ativarEspiritoCivico;
window.ativarMotorDeBusca = ativarMotorDeBusca;
window.ativarDesbravador = ativarDesbravador;
window.ativarImpostor = ativarImpostor;