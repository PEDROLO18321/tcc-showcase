const PERICIAS = [
    { nome: "Acrobacia", atributo: "agilidade" },
    { nome: "Adestramento", atributo: "presenca" },
    { nome: "Artes", atributo: "presenca" },
    { nome: "Atletismo", atributo: "forca" },
    { nome: "Atualidades", atributo: "intelecto" },
    { nome: "Ciências", atributo: "intelecto" },
    { nome: "Crime", atributo: "agilidade" },
    { nome: "Diplomacia", atributo: "presenca" },
    { nome: "Enganação", atributo: "presenca" },
    { nome: "Fortitude", atributo: "vigor" },
    { nome: "Furtividade", atributo: "agilidade" },
    { nome: "Iniciativa", atributo: "agilidade" },
    { nome: "Intimidação", atributo: "presenca" },
    { nome: "Intuição", atributo: "presenca" },
    { nome: "Investigação", atributo: "intelecto" },
    { nome: "Luta", atributo: "forca" },
    { nome: "Medicina", atributo: "intelecto" },
    { nome: "Ocultismo", atributo: "intelecto" },
    { nome: "Percepção", atributo: "presenca" },
    { nome: "Pilotagem", atributo: "agilidade" },
    { nome: "Pontaria", atributo: "agilidade" },
    { nome: "Profissão", atributo: "intelecto" },
    { nome: "Reflexos", atributo: "agilidade" },
    { nome: "Religião", atributo: "presenca" },
    { nome: "Sobrevivência", atributo: "intelecto" },
    { nome: "Tática", atributo: "intelecto" },
    { nome: "Tecnologia", atributo: "intelecto" },
    { nome: "Vontade", atributo: "presenca" }
];

const TREINAMENTOS = {
    destreinado: 0,
    treinado: 5,
    veterano: 10,
    expert: 15
};

// Mapeamento de nomes de perícia para índices (para uso no sistema de origem)
const PERICIAS_INDICES = {
    "acrobacia": 0,
    "adestramento": 1,
    "artes": 2,
    "atletismo": 3,
    "atualidades": 4,
    "ciencias": 5,
    "crime": 6,
    "diplomacia": 7,
    "enganacao": 8,
    "fortitude": 9,
    "furtividade": 10,
    "iniciativa": 11,
    "intimidacao": 12,
    "intuicao": 13,
    "investigacao": 14,
    "luta": 15,
    "medicina": 16,
    "ocultismo": 17,
    "percepcao": 18,
    "pilotagem": 19,
    "pontaria": 20,
    "profissao": 21,
    "reflexos": 22,
    "religiao": 23,
    "sobrevivencia": 24,
    "tatica": 25,
    "tecnologia": 26,
    "vontade": 27
};

function rolarD20() {
    return Math.floor(Math.random() * 20) + 1;
}

function rolarPericia(pericia, atributos, treinamento, bonus) {
    const atributo = pericia.atributo;
    const qtdDados = atributos[atributo] || 0;

    let dados = [];
    let resultadoFinal = 0;
    let mensagemRolagem = "";
    
    // Lógica de rolagem baseada no valor do atributo
    if (qtdDados === 0) {
        // Atributo 0: Desvantagem (rola 2d20, pega o menor)
        const d1 = rolarD20();
        const d2 = rolarD20();
        dados = [d1, d2];
        resultadoFinal = Math.min(d1, d2);
        mensagemRolagem = "Desvantagem (2d20, menor valor)";
        
    } else if (qtdDados === 1) {
        // Atributo 1: Normal (rola 1d20)
        const d1 = rolarD20();
        dados = [d1];
        resultadoFinal = d1;
        mensagemRolagem = "Normal (1d20)";
        
    } else {
        // Atributo 2+: Vantagem (rola Xd20, pega o maior)
        for (let i = 0; i < qtdDados; i++) {
            dados.push(rolarD20());
        }
        resultadoFinal = Math.max(...dados);
        mensagemRolagem = `Vantagem (${qtdDados}d20, maior valor)`;
    }

    const bonusTreinamento = TREINAMENTOS[treinamento] ?? 0;
    const bonusExtra = Number(bonus) || 0;
    
    // VERIFICAR BÔNUS DE PODER ATIVO
    let bonusPoder = 0;
    let mensagemPoder = "";
    
    if (typeof verificarBonusPoder === 'function') {
        bonusPoder = verificarBonusPoder(pericia.nome, atributo);
        
        // Se for um poder ativo que foi usado
        if (bonusPoder > 0) {
            mensagemPoder = `(Poder ativo: +${bonusPoder})`;
        }
    }
    
    // VERIFICAR BÔNUS DE PODERES PASSIVOS
    let bonusPassivo = 0;
    let mensagemPassivo = "";

    if (origemSelecionada && origemSelecionada.poder) {
        // Aplicar bônus do Companheiro Animal (Amigo dos Animais)
        if (origemSelecionada.nome === "Amigo dos Animais" && 
            origemSelecionada.poder.tipo === "passivo_escolha" &&
            origemSelecionada.poder.periciaEscolhida) {
            
            // Verificar se a perícia rolada é a escolhida
            const periciaId = pericia.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const periciaEscolhidaId = origemSelecionada.poder.periciaEscolhida.toLowerCase();
            
            if (periciaId === periciaEscolhidaId) {
                bonusPassivo = origemSelecionada.poder.bonus || 0;
                mensagemPassivo = `(Bônus: Companheiro Animal ajudando com +${bonusPassivo})`;
            }
        }
        // Aplicar bônus do Cosplayer
        else if (origemSelecionada.nome === "Cosplayer" && 
                (origemSelecionada.poder.tipo === "passivo_escolha_cosplay" || 
                origemSelecionada.poder.tipo === "passivo_escolha") &&
                origemSelecionada.poder.periciaEscolhida) {
            
            // Verificar se a perícia rolada é a escolhida
            const periciaId = pericia.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const periciaEscolhidaId = origemSelecionada.poder.periciaEscolhida.toLowerCase();
            
            if (periciaId === periciaEscolhidaId) {
                bonusPassivo = origemSelecionada.poder.bonus || 0;
                mensagemPassivo = `(Bônus: Cosplay apropriado dando +${bonusPassivo})`;
            }
        }
        // Bônus do Amnésico: +2 em testes de Vontade para resistir a efeitos mentais ou de memória
        else if (origemSelecionada.nome === "Amnésico" && pericia.nome === "Vontade") {
            bonusPassivo = origemSelecionada.poder.bonus || 0;
            mensagemPassivo = "(Bônus passivo: Amnésico - resistência mental)";
        }
        // Bônus do Colegial: +2 em todos os testes se o melhor amigo estiver vivo
        else if (origemSelecionada && origemSelecionada.nome === "Colegial") {
            const poder = origemSelecionada.poder;
            if (poder && poder.verificarBonus && poder.verificarBonus()) {
                bonusPassivo = poder.bonus || 2;
                mensagemPassivo = "(Bônus: Poder da Amizade - melhor amigo vivo)";
            }
        }
        // Aplicar bônus passivo de origem: Conexões (Diplomata) - +2 em Diplomacia
        else if (origemSelecionada.nome === "Diplomata" && pericia.nome === "Diplomacia") {
            bonusPassivo += origemSelecionada.poder.bonus || 0;
            mensagemPassivo = "(Bônus passivo: Conexões - +2 em Diplomacia)";
        }
        // Aplicar bônus ativo de origem: Processo Otimizado (Executivo) - +5 se ativado para a perícia escolhida
        else if (origemSelecionada.nome === "Executivo" && 
                 processoOtimizadoActivated && 
                 origemSelecionada.poder.periciaEscolhida &&
                 pericia.nome.toLowerCase() === origemSelecionada.poder.periciaEscolhida.toLowerCase()) {
            bonusPoder += origemSelecionada.poder.bonus || 0;
            mensagemPoder = `(Bônus ativo: Processo Otimizado - +${bonusPoder})`;
            // Resetar flag após aplicar
            processoOtimizadoActivated = false;
        }
        // Aplicar bônus/penalidade de origem: Mutação (Experimento)
        else if (origemSelecionada.nome === "Experimento") {
            if (origemSelecionada.poder.periciaEscolhida &&
                pericia.nome.toLowerCase() === origemSelecionada.poder.periciaEscolhida.toLowerCase()) {
                bonusPassivo += origemSelecionada.poder.bonus || 0;
                mensagemPassivo = `(Bônus passivo: Mutação - +${bonusPassivo} na perícia escolhida)`;
            }
            if (pericia.nome === "Diplomacia") {
                bonusPassivo += origemSelecionada.poder.penalidadeDiplomacia || 0;
                mensagemPassivo += ` (Penalidade: Mutação - ${origemSelecionada.poder.penalidadeDiplomacia} em Diplomacia)`;
            }
        }
        // Aplicar bônus ativo de origem: Manual do Sobrevivente (Explorador) - +5 se ativado para Fortitude ou Sobrevivência
        else if (origemSelecionada.nome === "Explorador" && 
                 manualSobreviventeActivated && 
                 (pericia.nome === "Fortitude" || pericia.nome === "Sobrevivencia")) {
            bonusPoder += origemSelecionada.poder.bonus || 0;
            mensagemPoder = `(Bônus ativo: Manual do Sobrevivente - +${bonusPoder})`;
            // Resetar flag após aplicar
            manualSobreviventeActivated = false;
        }
        // Aplicar bônus ativo de origem: Saber é Poder (Acadêmico) - +5 se ativado e atributo é Intelecto
        else if (origemSelecionada.nome === "Acadêmico" && 
                 saberEPoderActivated && 
                 atributo === "intelecto") {
            bonusPoder += origemSelecionada.poder.bonus || 0;
            mensagemPoder = `(Bônus ativo: Saber é Poder - +${bonusPoder})`;
            // Resetar flag após aplicar
            saberEPoderActivated = false;
        }
        // Aplicar bônus ativo de origem: Através da Lente (Fotógrafo) - +5 se ativado para Investigação ou Percepção
        else if (origemSelecionada.nome === "Fotógrafo" && 
                 atravesDaLenteActivated && 
                 (pericia.nome === "Investigação" || pericia.nome === "Percepção")) {
            bonusPoder += origemSelecionada.poder.bonus || 0;
            mensagemPoder = `(Bônus ativo: Através da Lente - +${bonusPoder})`;
            // Resetar flag após aplicar
            atravesDaLenteActivated = false;
        }

        // Aplicar bônus ativo de origem: Faro para Pistas (Investigador) - +5 se ativado para Investigação ou Percepção
        else if (origemSelecionada.nome === "Investigador" && 
                window.faroParaPistasActivated && 
                (pericia.nome === "Investigação" || pericia.nome === "Percepção")) {
            bonusPoder += origemSelecionada.poder.bonus || 0;
            mensagemPoder = `(Bônus ativo: Faro para Pistas - +${bonusPoder})`;
            // Resetar flag após aplicar
            window.faroParaPistasActivated = false;
        }

        // Aplicar bônus ativo de origem: Luto Habitual (Legista) - +5 se ativado para Medicina
        else if (origemSelecionada.nome === "Legista" && 
                window.lutoHabitualActivated && 
                pericia.nome === "Medicina") {
            bonusPoder += origemSelecionada.poder.bonus || 0;
            mensagemPoder = `(Bônus ativo: Luto Habitual - +${bonusPoder})`;
            // Resetar flag após aplicar
            window.lutoHabitualActivated = false;
        }

        // Aplicar bônus ativo de origem: Mãos no Volante (Motorista)
        else if (origemSelecionada.nome === "Motorista" && 
                 maosNoVolanteActivated && 
                 (pericia.nome === "Pilotagem" || 
                  pericia.nome === "Fortitude" || 
                  pericia.nome === "Reflexos" || 
                  pericia.nome === "Vontade")) {
            bonusPoder += origemSelecionada.poder.bonus || 0;
            mensagemPoder = `(Bônus ativo: Mãos no Volante - +${bonusPoder})`;
            // Resetar flag após aplicar
            maosNoVolanteActivated = false;
        }

        // Bônus do Profetizado: +2 em Vontade (permanente)
        else if (origemSelecionada.nome === "Profetizado" && pericia.nome === "Vontade") {
            bonusPassivo = origemSelecionada.poder.bonus || 2;
            mensagemPassivo = "(Bônus passivo: Luta ou Fuga - +2 em Vontade)";
        }

        // Bônus do Religioso: +5 em testes de Religião (Acalentar)
        else if (origemSelecionada.nome === "Religioso" && pericia.nome === "Religião") {
            bonusPassivo = origemSelecionada.poder.bonus || 5;
            mensagemPassivo = "(Bônus passivo: Acalentar - +5 em Religião para acalmar)";
        }

        // Aplicar bônus ativo de origem: Encontrar a Verdade (Repórter Investigativo)
        else if (origemSelecionada.nome === "Repórter Investigativo" && 
                 encontrarAVerdadeActivated && 
                 pericia.nome === "Investigação") {
            bonusPoder += origemSelecionada.poder.bonus || 5;
            mensagemPoder = `(Bônus ativo: Encontrar a Verdade - +${bonusPoder})`;
            // Resetar flag após aplicar
            encontrarAVerdadeActivated = false;
        }

        // Aplicar bônus ativo de origem: Espírito Cívico (Servidor Público) - +2 em QUALQUER perícia
        else if (origemSelecionada.nome === "Servidor Público" && 
                 espiritoCivicoActivated) {
            bonusPoder += origemSelecionada.poder.bonus || 2;
            mensagemPoder = `(Bônus ativo: Espírito Cívico - +${bonusPoder} no teste para ajudar)`;
            // Resetar flag após aplicar (funciona para qualquer perícia)
            espiritoCivicoActivated = false;
        }

        // Aplicar bônus ativo de origem: Desbravador (Trabalhador Rural)
        else if (origemSelecionada.nome === "Trabalhador Rural" && 
                 desbravadorActivated && 
                 (pericia.nome === "Adestramento" || pericia.nome === "Sobrevivência")) {
            bonusPoder += origemSelecionada.poder.bonus || 5;
            mensagemPoder = `(Bônus ativo: Desbravador - +${bonusPoder})`;
            desbravadorActivated = false;
        }
    }
    
    const total = resultadoFinal + bonusTreinamento + bonusExtra + bonusPoder + bonusPassivo;

    return {
        pericia: pericia.nome,
        atributo,
        dados,
        resultadoFinal,
        bonusTreinamento,
        bonusExtra,
        bonusPoder,
        bonusPassivo,
        total,
        mensagemRolagem,
        mensagemPoder,
        mensagemPassivo
    };
}