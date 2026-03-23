const ATRIBUTOS = ["agilidade", "forca", "intelecto", "presenca", "vigor"];

// Sistema de pontos
let pontosDisponiveis = 4;
let atributoComDesconto = null;
let pontosPorNex = {
    nex20: { adicionado: false, usado: false },
    nex50: { adicionado: false, usado: false },
    nex80: { adicionado: false, usado: false },
    nex100: { adicionado: false, usado: false }
};

function obterAtributos() {
    const dados = {};
    ATRIBUTOS.forEach(a => {
        let v = Number(document.getElementById(a).value);
        if (isNaN(v) || v < 0) v = 0;
        dados[a] = v;
    });
    return dados;
}

function inicializarAtributos() {
    // Começa todos com 1
    ATRIBUTOS.forEach(a => {
        document.getElementById(a).value = 1;
    });
    
    pontosDisponiveis = 4;
    atributoComDesconto = null;
    pontosPorNex = {
        nex20: { adicionado: false, usado: false },
        nex50: { adicionado: false, usado: false },
        nex80: { adicionado: false, usado: false },
        nex100: { adicionado: false, usado: false }
    };
    
    atualizarDisplayPontos();
    atualizarBotoesAtributos();
}

function atualizarDisplayPontos() {
    const pontosElement = document.getElementById("pontos-disponiveis");
    if (pontosElement) {
        pontosElement.textContent = pontosDisponiveis;
        
        // Mostrar pontos extras por NEX
        const pontosExtrasElement = document.getElementById("pontos-extras-info");
        if (pontosExtrasElement) {
            let extras = 0;
            if (pontosPorNex.nex20.adicionado) extras++;
            if (pontosPorNex.nex50.adicionado) extras++;
            if (pontosPorNex.nex80.adicionado) extras++;
            if (pontosPorNex.nex100.adicionado) extras++;
            
            if (extras > 0) {
                pontosExtrasElement.textContent = `(+${extras} por NEX)`;
            } else {
                pontosExtrasElement.textContent = '';
            }
        }
    }
}

function atualizarBotoesAtributos() {
    ATRIBUTOS.forEach(atributo => {
        const valor = Number(document.getElementById(atributo).value);
        const btnMais = document.getElementById(`btn-mais-${atributo}`);
        const btnMenos = document.getElementById(`btn-menos-${atributo}`);
        
        if (btnMais) {
            // Pode aumentar se: tem pontos E (valor < 3 OU já tem pontos de NEX 20+)
            const limite = pontosPorNex.nex20.adicionado ? 999 : 3; // Sem limite após NEX 20%
            btnMais.disabled = pontosDisponiveis <= 0 || valor >= limite;
        }
        
        if (btnMenos) {
            // Pode diminuir se: valor > 1 (não pode diminuir abaixo de 1, exceto desconto especial)
            const podeDiminuirParaZero = atributo === atributoComDesconto && valor === 1;
            btnMenos.disabled = valor <= 1 && !podeDiminuirParaZero;
        }
    });
}

function alterarAtributo(atributo, operacao) {
    const input = document.getElementById(atributo);
    let valor = Number(input.value);
    
    if (operacao === '+') {
        // AUMENTAR atributo
        // Verifica limite máximo (3 antes do NEX 20%, ilimitado após)
        const limite = pontosPorNex.nex20.adicionado ? 999 : 3;
        
        if (valor < limite && pontosDisponiveis > 0) {
            valor++;
            pontosDisponiveis--;
            
            // Marca que usou algum ponto extra de NEX, se aplicável
            marcarPontoNexUsado();
            
            // Se este atributo era o que tinha desconto e agora voltou para 1+
            if (atributo === atributoComDesconto && valor === 1) {
                atributoComDesconto = null;
            }
        }
    } else if (operacao === '-') {
        // DIMINUIR atributo
        if (valor > 1 || (valor === 1 && atributo === atributoComDesconto)) {
            valor--;
            pontosDisponiveis++;
            
            // Desmarca ponto extra de NEX se estava usando
            desmarcarPontoNexUsado();
            
            // Se chegou a 0 e é o primeiro atributo a chegar em 0
            if (valor === 0 && atributoComDesconto === null) {
                atributoComDesconto = atributo;
            }
        }
    }
    
    input.value = valor;
    atualizarDisplayPontos();
    atualizarBotoesAtributos();
    
    // Dispara evento de input para atualizar cálculos
    input.dispatchEvent(new Event('input'));
}

function marcarPontoNexUsado() {
    // Marca o ponto de NEX mais alto disponível como usado
    if (pontosPorNex.nex100.adicionado && !pontosPorNex.nex100.usado) {
        pontosPorNex.nex100.usado = true;
    } else if (pontosPorNex.nex80.adicionado && !pontosPorNex.nex80.usado) {
        pontosPorNex.nex80.usado = true;
    } else if (pontosPorNex.nex50.adicionado && !pontosPorNex.nex50.usado) {
        pontosPorNex.nex50.usado = true;
    } else if (pontosPorNex.nex20.adicionado && !pontosPorNex.nex20.usado) {
        pontosPorNex.nex20.usado = true;
    }
}

function desmarcarPontoNexUsado() {
    // Desmarca o ponto de NEX mais alto que está sendo usado
    if (pontosPorNex.nex100.usado) {
        pontosPorNex.nex100.usado = false;
    } else if (pontosPorNex.nex80.usado) {
        pontosPorNex.nex80.usado = false;
    } else if (pontosPorNex.nex50.usado) {
        pontosPorNex.nex50.usado = false;
    } else if (pontosPorNex.nex20.usado) {
        pontosPorNex.nex20.usado = false;
    }
}

function calcularPontosPorNex(nex, classe) {
    const nexNum = Number(nex) || 0;
    const classeSelecionada = classe || obterClasse();
    
    // Não aplica a Sobrevivente
    if (classeSelecionada === "sobrevivente") {
        return;
    }
    
    // Calcula quais pontos de NEX estão disponíveis
    const novoEstado = {
        nex20: { adicionado: nexNum >= 20, usado: pontosPorNex.nex20.usado },
        nex50: { adicionado: nexNum >= 50, usado: pontosPorNex.nex50.usado },
        nex80: { adicionado: nexNum >= 80, usado: pontosPorNex.nex80.usado },
        nex100: { adicionado: nexNum >= 100, usado: pontosPorNex.nex100.usado }
    };
    
    // Remove pontos de NEX que não estão mais disponíveis
    if (!novoEstado.nex100.adicionado && pontosPorNex.nex100.usado) {
        removerPontoNexExcedente('nex100');
    }
    if (!novoEstado.nex80.adicionado && pontosPorNex.nex80.usado) {
        removerPontoNexExcedente('nex80');
    }
    if (!novoEstado.nex50.adicionado && pontosPorNex.nex50.usado) {
        removerPontoNexExcedente('nex50');
    }
    if (!novoEstado.nex20.adicionado && pontosPorNex.nex20.usado) {
        removerPontoNexExcedente('nex20');
    }
    
    // Atualiza estado
    pontosPorNex = novoEstado;
    
    // Recalcula pontos disponíveis
    recalcularPontosDisponiveis();
}

function removerPontoNexExcedente(nexTipo) {
    // Encontra um atributo para remover ponto (o maior possível)
    let atributoParaRemover = null;
    let maiorValor = 0;
    
    ATRIBUTOS.forEach(a => {
        const valor = Number(document.getElementById(a).value);
        if (valor > maiorValor && valor > 1) {
            maiorValor = valor;
            atributoParaRemover = a;
        }
    });
    
    // Se encontrou um atributo para reduzir
    if (atributoParaRemover) {
        const input = document.getElementById(atributoParaRemover);
        let valor = Number(input.value);
        valor--;
        input.value = valor;
        
        // Atualiza pontosPorNex
        pontosPorNex[nexTipo].usado = false;
        
        // Dispara evento
        input.dispatchEvent(new Event('input'));
    } else {
        // Se não encontrou, apenas marca como não usado
        pontosPorNex[nexTipo].usado = false;
    }
}

function recalcularPontosDisponiveis() {
    // Base: 4 pontos iniciais
    let totalPontos = 4;
    
    // Adiciona pontos por NEX
    if (pontosPorNex.nex20.adicionado) totalPontos++;
    if (pontosPorNex.nex50.adicionado) totalPontos++;
    if (pontosPorNex.nex80.adicionado) totalPontos++;
    if (pontosPorNex.nex100.adicionado) totalPontos++;
    
    // Subtrai pontos gastos nos atributos (acima de 1)
    let pontosGastos = 0;
    ATRIBUTOS.forEach(a => {
        const valor = Number(document.getElementById(a).value);
        pontosGastos += Math.max(0, valor - 1);
    });
    
    // Adiciona ponto se tem atributo com desconto
    if (atributoComDesconto) {
        const valorAtributoDesconto = Number(document.getElementById(atributoComDesconto).value);
        if (valorAtributoDesconto === 0) {
            pontosGastos--; // O atributo em 0 conta como -1 ponto gasto
        }
    }
    
    pontosDisponiveis = totalPontos - pontosGastos;
    atualizarDisplayPontos();
    atualizarBotoesAtributos();
}

function resetarAtributos() {
    pontosDisponiveis = 4;
    atributoComDesconto = null;
    pontosPorNex = {
        nex20: { adicionado: false, usado: false },
        nex50: { adicionado: false, usado: false },
        nex80: { adicionado: false, usado: false },
        nex100: { adicionado: false, usado: false }
    };
    inicializarAtributos();
}