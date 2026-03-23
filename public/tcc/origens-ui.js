/* =========================
   SISTEMA DE SELEÇÃO DE ORIGEM
========================= */

// Variável global para armazenar a origem selecionada
let origemSelecionada = null;
let origemConfirmada = false;

// Função para mostrar detalhes da origem selecionada
function mostrarDetalhesOrigem() {
    const select = document.getElementById('select-origem');
    const origemId = select.value;
    const detalhesDiv = document.getElementById('origem-detalhes');
    
    if (!origemId) {
        detalhesDiv.style.display = 'none';
        origemSelecionada = null;
        return;
    }
    
    // Obter dados da origem
    const origem = obterOrigemPorId(origemId);
    if (!origem) return;
    
    origemSelecionada = origem;
    
    // Atualizar interface com os detalhes
    document.getElementById('origem-nome').textContent = origem.nome;
    
    // Atualizar perícias
    const periciasList = document.getElementById('origem-pericias');
    periciasList.innerHTML = '';
    
    origem.pericias.forEach(periciaId => {
        const li = document.createElement('li');
        let nomePericia = periciaId;
        
        // Converter IDs para nomes amigáveis
        if (periciaId === 'escolha_mestre') {
            nomePericia = 'Duas à escolha do Mestre';
        } else if (periciaId === 'escolha_luta_ou_pontaria') {
            nomePericia = 'Luta ou Pontaria (escolha)';
        } else {
            nomePericia = obterNomePericia(periciaId);
        }
        
        li.textContent = nomePericia;
        periciasList.appendChild(li);
    });
    
    // Atualizar poder
    document.getElementById('origem-poder-nome').textContent = origem.poder.nome;
    document.getElementById('origem-poder-descricao').textContent = origem.poder.descricao;
    
    // Atualizar equipamento
    document.getElementById('origem-equipamento').textContent = origem.equipamento;
    
    // Atualizar sugestão de atributos
    const sugestaoAtributos = document.getElementById('origem-sugestao-atributos');
    const atributosMap = {
        'agilidade': 'Agilidade',
        'forca': 'Força',
        'intelecto': 'Intelecto',
        'presenca': 'Presença',
        'vigor': 'Vigor'
    };
    
    const atributosNomes = origem.sugestaoAtributos.map(a => atributosMap[a]).join(' e ');
    sugestaoAtributos.textContent = atributosNomes;
    
    // Atualizar status (não confirmado)
    const statusBadge = document.getElementById('origem-status');
    statusBadge.textContent = 'Não confirmada';
    statusBadge.className = 'status-badge';
    
    // Mostrar/ocultar botões
    document.getElementById('btn-confirmar-origem').style.display = 'block';
    document.getElementById('btn-alterar-origem').style.display = 'none';
    
    // Limpar mensagem
    const mensagem = document.getElementById('origem-mensagem');
    mensagem.textContent = '';
    mensagem.classList.remove('visible');
    
    // Mostrar a div de detalhes
    detalhesDiv.style.display = 'block';
    
    // Se já estava confirmada, restaurar estado
    if (origemConfirmada && origemId === window.origemConfirmadaId) {
        confirmarOrigemVisual();
    }
}

// Função para confirmar a origem
function confirmarOrigem() {
    if (!origemSelecionada) {
        mostrarMensagem('Selecione uma origem primeiro!', 'error');
        return;
    }
    
    // Marcar como confirmada
    origemConfirmada = true;
    window.origemConfirmadaId = document.getElementById('select-origem').value;
    
    // Atualizar interface visual
    confirmarOrigemVisual();
    
    // Mostrar mensagem de sucesso
    mostrarMensagem(`Origem "${origemSelecionada.nome}" confirmada! Perícias aplicadas.`, 'success');
    
    // Aplicar perícias da origem
    aplicarPericiasOrigem(origemSelecionada);
    
    // MOSTRAR SEÇÃO DE PODERES
    if (typeof atualizarSecaoPoderes === 'function') {
        setTimeout(() => {
            atualizarSecaoPoderes();
        }, 300);
    }
}

// Atualiza a interface visual quando a origem é confirmada
function confirmarOrigemVisual() {
    const statusBadge = document.getElementById('origem-status');
    statusBadge.textContent = 'Confirmada ✓';
    statusBadge.className = 'status-badge confirmada';
    
    // Alterar botões
    document.getElementById('btn-confirmar-origem').style.display = 'none';
    document.getElementById('btn-alterar-origem').style.display = 'block';
    
    // Desabilitar seleção enquanto confirmada
    document.getElementById('select-origem').disabled = true;
}

// Função para alterar a origem (após confirmada)
function alterarOrigem() {
    origemConfirmada = false;
    window.origemConfirmadaId = null;
    
    // Re-habilitar seleção
    document.getElementById('select-origem').disabled = false;
    
    // Atualizar status
    const statusBadge = document.getElementById('origem-status');
    statusBadge.textContent = 'Não confirmada';
    statusBadge.className = 'status-badge';
    
    // Alterar botões
    document.getElementById('btn-confirmar-origem').style.display = 'block';
    document.getElementById('btn-alterar-origem').style.display = 'none';
    
    // Mostrar mensagem
    mostrarMensagem('Origem desconfirmada. Você pode escolher outra.', 'info');
    
    // Remover perícias da origem anterior
    removerPericiasOrigem();
    
    // OCULTAR SEÇÃO DE PODERES
    const secaoPoderes = document.getElementById('secao-poderes');
    if (secaoPoderes) {
        secaoPoderes.style.display = 'none';
    }
    
    // Resetar bônus do poder
    if (typeof resetarBonusPoder === 'function') {
        resetarBonusPoder();
    }
}

// Função para mostrar mensagens de status
function mostrarMensagem(texto, tipo) {
    const mensagem = document.getElementById('origem-mensagem');
    mensagem.textContent = texto;
    
    // Cor baseada no tipo
    if (tipo === 'success') {
        mensagem.style.color = '#2ecc71';
    } else if (tipo === 'error') {
        mensagem.style.color = '#ff6b6b';
    } else {
        mensagem.style.color = '#3498db';
    }
    
    mensagem.classList.add('visible');
    
    // Auto-esconder após 3 segundos (exceto para sucesso de confirmação)
    if (tipo !== 'success') {
        setTimeout(() => {
            mensagem.classList.remove('visible');
        }, 3000);
    }
}

// Função para aplicar perícias da origem
function aplicarPericiasOrigem(origem) {
    console.log(`Aplicando perícias da origem: ${origem.nome}`);
    
    // Mapeamento de IDs de perícia para índices no array PERICIAS
    const mapeamentoPericiasIndices = {
        'acrobacia': 0, 'adestramento': 1, 'artes': 2, 'atletismo': 3,
        'atualidades': 4, 'ciencias': 5, 'crime': 6, 'diplomacia': 7,
        'enganacao': 8, 'fortitude': 9, 'furtividade': 10, 'iniciativa': 11,
        'intimidacao': 12, 'intuicao': 13, 'investigacao': 14, 'luta': 15,
        'medicina': 16, 'ocultismo': 17, 'percepcao': 18, 'pilotagem': 19,
        'pontaria': 20, 'profissao': 21, 'reflexos': 22, 'religiao': 23,
        'sobrevivencia': 24, 'tatica': 25, 'tecnologia': 26, 'vontade': 27
    };
    
    // Lidar com perícias especiais
    if (origem.pericias.includes('escolha_mestre')) {
        mostrarMensagem('Origem Amnésico: O Mestre escolherá 2 perícias durante o jogo.', 'info');
        return;
    }
    
    if (origem.pericias.includes('escolha_luta_ou_pontaria')) {
        // Para Profetizado, precisamos pedir a escolha do jogador
        setTimeout(() => {
            const escolha = prompt('Escolha uma perícia para sua origem Profetizado:\n1. Luta\n2. Pontaria\n\nDigite 1 ou 2:');
            if (escolha === '1') {
                origem.pericias = ['vontade', 'luta'];
            } else if (escolha === '2') {
                origem.pericias = ['vontade', 'pontaria'];
            } else {
                origem.pericias = ['vontade', 'luta']; // Default
            }
            aplicarPericiasTreinadas(origem, mapeamentoPericiasIndices);
        }, 100);
        return;
    }
    
    aplicarPericiasTreinadas(origem, mapeamentoPericiasIndices);
}

// Função auxiliar para aplicar as perícias treinadas
function aplicarPericiasTreinadas(origem, mapeamento) {
    origem.pericias.forEach(periciaId => {
        // Para perícias de profissão, usamos o índice da perícia "Profissão"
        let indice = mapeamento[periciaId];
        
        if (periciaId.includes('profissao_')) {
            indice = mapeamento['profissao'];
        }
        
        if (indice !== undefined) {
            // Encontrar o elemento correto na interface de perícias
            const container = document.getElementById('pericias');
            if (container && container.children[indice]) {
                const linhaPericia = container.children[indice];
                const radioTreinado = linhaPericia.querySelector('input[value="treinado"]');
                
                if (radioTreinado) {
                    radioTreinado.checked = true;
                    
                    // Adicionar indicação visual
                    const nomePericia = linhaPericia.querySelector('strong');
                    if (nomePericia) {
                        nomePericia.innerHTML = `${nomePericia.textContent} <span style="color: #2ecc71; font-size: 0.8em;">(Origem)</span>`;
                    }
                    
                    console.log(`Perícia treinada: ${periciaId}`);
                }
            }
        }
    });
    
    // Armazenar quais perícias foram aplicadas
    window.periciasOrigemAplicadas = origem.pericias.slice();
}

// Função para remover perícias da origem
function removerPericiasOrigem() {
    console.log('Removendo perícias da origem anterior');
    
    if (!window.periciasOrigemAplicadas) return;
    
    // Mapeamento de IDs de perícia para índices
    const mapeamentoPericiasIndices = {
        'acrobacia': 0, 'adestramento': 1, 'artes': 2, 'atletismo': 3,
        'atualidades': 4, 'ciencias': 5, 'crime': 6, 'diplomacia': 7,
        'enganacao': 8, 'fortitude': 9, 'furtividade': 10, 'iniciativa': 11,
        'intimidacao': 12, 'intuicao': 13, 'investigacao': 14, 'luta': 15,
        'medicina': 16, 'ocultismo': 17, 'percepcao': 18, 'pilotagem': 19,
        'pontaria': 20, 'profissao': 21, 'reflexos': 22, 'religiao': 23,
        'sobrevivencia': 24, 'tatica': 25, 'tecnologia': 26, 'vontade': 27
    };
    
    window.periciasOrigemAplicadas.forEach(periciaId => {
        let indice = mapeamentoPericiasIndices[periciaId];
        
        if (periciaId.includes('profissao_')) {
            indice = mapeamentoPericiasIndices['profissao'];
        }
        
        if (indice !== undefined) {
            const container = document.getElementById('pericias');
            if (container && container.children[indice]) {
                const linhaPericia = container.children[indice];
                const radioDestreinado = linhaPericia.querySelector('input[value="destreinado"]');
                
                if (radioDestreinado) {
                    radioDestreinado.checked = true;
                    
                    // Remover indicação visual
                    const nomePericia = linhaPericia.querySelector('strong');
                    if (nomePericia && nomePericia.innerHTML.includes('(Origem)')) {
                        nomePericia.innerHTML = nomePericia.innerHTML.replace(' <span style="color: #2ecc71; font-size: 0.8em;">(Origem)</span>', '');
                    }
                }
            }
        }
    });
    
    window.periciasOrigemAplicadas = null;
}

// Inicializar sistema de origem quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de origem carregado');
    
    // Adicionar listener para tecla Enter no select
    document.getElementById('select-origem').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value && !origemConfirmada) {
            confirmarOrigem();
        }
    });
});