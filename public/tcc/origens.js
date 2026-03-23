const ORIGENS = {
    "academico": {
    nome: "Acadêmico",
    pericias: ["ciencias", "investigacao"],
    poder: {
        nome: "Saber é Poder",
        descricao: "Quando faz um teste usando Intelecto, você pode gastar 2 PE para receber +5 nesse teste.",
        tipo: "ativo",
        custo: { pe: 2 },
        efeito: "bonus_intelecto",
        bonus: 5,
        atributoAfetado: "intelecto",
        podeUsar: function() {
            const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
            if (modo === "nex") {
                const peAtual = Number(document.getElementById("esforco_atual").value) || 0;
                return peAtual >= this.custo.pe;
            } else {
                const pdAtual = Number(document.getElementById("determinacao_atual").value) || 0;
                return pdAtual >= this.custo.pe;
            }
        },
        usar: function(tipoTeste) {
            const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
            
            if (!this.podeUsar()) {
                return { 
                    sucesso: false, 
                    mensagem: "Pontos de Esforço/Determinação insuficientes!" 
                };
            }
            
            // Gastar pontos
            if (modo === "nex") {
                const peAtual = document.getElementById("esforco_atual");
                peAtual.value = Math.max(0, Number(peAtual.value) - this.custo.pe);
            } else {
                const pdAtual = document.getElementById("determinacao_atual");
                pdAtual.value = Math.max(0, Number(pdAtual.value) - this.custo.pe);
            }
            window.saberEPoderActivated = true;
            return { 
                sucesso: true, 
                bonus: this.bonus,
                mensagem: `Poder ativado! Gasto ${this.custo.pe} ${modo === "nex" ? "PE" : "PD"}.`,
                gastoPE: this.custo.pe
            };
        }
    },
    equipamento: "Kit acadêmico com livros especializados, laptop, cadernos de anotações, identificação estudantil",
    sugestaoAtributos: ["intelecto", "presenca"]
    },
    
"agente_saude": {
    nome: "Agente de Saúde",
    pericias: ["intuicao", "medicina"],
    poder: {
        nome: "Técnica Medicinal",
        descricao: "Sempre que cura um personagem, você adiciona seu Intelecto no total de PV curados.",
        tipo: "narrativo",
        habilidades: [
            "Ao curar um personagem, adicione seu valor de Intelecto ao total de PV curados",
            "Aplica-se a curas por Medicina, primeiros socorros ou tratamentos médicos"
        ]
    },
    equipamento: "Kit médico (bandagens, antissépticos, analgésicos), estetoscópio, luvas descartáveis, identificação profissional",
    sugestaoAtributos: ["intelecto", "presenca"]
    },
    
    "amigo_animais": {
    nome: "Amigo dos Animais",
    pericias: ["adestramento", "percepcao"],
    poder: {
        nome: "Companheiro Animal",
        descricao: "Você possui um animal de estimação que pode ajudá-lo. Escolha uma perícia para receber +2 de bônus quando seu animal estiver presente e puder ajudar.",
        tipo: "passivo_escolha", // NOVO TIPO: passivo com escolha
        bonus: 2,
        // Inicialmente sem perícia escolhida
        periciaEscolhida: null,
        habilidades: [
            "Escolha uma perícia para receber +2 de bônus",
            "O bônus só se aplica quando o animal puder ajudar"
        ],
        podeUsar: function() {
            return this.periciaEscolhida !== null; // Só pode usar se já escolheu uma perícia
        },
        // Função para escolher a perícia
        escolherPericia: function(periciaId) {
            this.periciaEscolhida = periciaId;
            return {
                sucesso: true,
                mensagem: `Perícia ${obterNomePericia(periciaId)} escolhida! Seu animal ajudará com +2 de bônus.`
            };
        },
        // Função para obter o bônus atual
        obterBonus: function(periciaNome) {
            if (this.periciaEscolhida && 
                periciaNome.toLowerCase() === this.periciaEscolhida.toLowerCase()) {
                return this.bonus;
            }
            return 0;
        }
    },
    equipamento: "Coleira e guia, brinquedos de animais, petiscos, apito de treinamento, kit de cuidados animais",
    sugestaoAtributos: ["presenca", "agilidade"]
    },
    
    "amnesico": {
    nome: "Amnésico",
    pericias: ["escolha_mestre"],
    poder: {
        nome: "Vislumbres do Passado",
        descricao: "O mestre pode, a seu critério, conceder a você flashes de memória relevantes para a situação. Além disso, você tem +2 em testes de Vontade para resistir a efeitos mentais ou de memória.",
        tipo: "passivo",
        bonus: 2,
        habilidades: [
            "Recebe +2 em testes de Vontade para resistir a efeitos mentais ou de memória",
            "O mestre pode conceder flashes de memória relevantes para a situação"
        ]
    },
    equipamento: "Roupas simples, objeto que gosta, caderno de anotações",
    sugestaoAtributos: ["vigor", "presenca"],
    especial: true
    },
    
    "artista": {
    nome: "Artista",
    pericias: ["artes", "enganacao"],
    poder: {
        nome: "Magnum Opus",
        descricao: "Sua obra-prima possui propriedades especiais. Uma vez por missão, você pode criar uma peça artística que inspira aliados próximos, concedendo +1 em um atributo específico por cena. A obra também pode conter pistas ocultas sobre o paranormal.",
        tipo: "narrativo",
        habilidades: [
            "Crie uma obra-prima que inspira aliados próximos",
            "Uma vez por missão, conceda +1 em um atributo específico por cena",
            "Suas obras podem conter pistas ocultas sobre o paranormal"
        ]
    },
    equipamento: "Tintas, pincéis, sketchbook, instrumento musical, portfólio, roupas características",
    sugestaoAtributos: ["presenca", "agilidade"]
    },
    
    "astronauta": {
    nome: "Astronauta",
    pericias: ["ciencias", "fortitude"],
    poder: {
        nome: "Acostumado ao Extremo",
        descricao: "Quando sofre dano de fogo, de frio ou mental, você pode gastar 1 PE para reduzir esse dano em 5. A cada vez que usa esta habilidade novamente na mesma cena, seu custo aumenta em +1 PE. O custo volta a 1 PE em uma nova cena.",
        tipo: "ativo",
        custo: { 
            pe: 1,
            base: 1, // Custo base que sempre volta
            usosNaCena: 0 // Contador de usos na cena atual
        },
        reducaoDano: 5,
        danosAplicaveis: ["fogo", "frio", "mental"],
        
        podeUsar: function() {
            const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
            if (modo === "nex") {
                const peAtual = Number(document.getElementById("esforco_atual").value) || 0;
                // Usar this.custo.pe (que agora será atualizado)
                return peAtual >= this.custo.pe;
            } else {
                const pdAtual = Number(document.getElementById("determinacao_atual").value) || 0;
                return pdAtual >= this.custo.pe;
            }
        },
        
        usar: function() {
            const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
            const custoAtual = this.custo.pe; // Pega o custo ATUAL (que pode ser 1, 2, 3, etc.)
            
            if (!this.podeUsar()) {
                return { 
                    sucesso: false, 
                    mensagem: `Pontos de ${modo === "nex" ? "Esforço" : "Determinação"} insuficientes! Custo atual: ${custoAtual} ${modo === "nex" ? "PE" : "PD"}`
                };
            }
            
            // Gastar pontos (usando o custo atual)
            if (modo === "nex") {
                const peAtual = document.getElementById("esforco_atual");
                const novoValor = Math.max(0, Number(peAtual.value) - custoAtual);
                peAtual.value = novoValor;
                console.log(`Gastou ${custoAtual} PE. Restante: ${novoValor}`);
            } else {
                const pdAtual = document.getElementById("determinacao_atual");
                const novoValor = Math.max(0, Number(pdAtual.value) - custoAtual);
                pdAtual.value = novoValor;
                console.log(`Gastou ${custoAtual} PD. Restante: ${novoValor}`);
            }
            
            // Incrementar contador de usos na cena
            this.custo.usosNaCena++;
            
            // ATUALIZAR O CUSTO PARA O PRÓXIMO USO (aumenta em +1 PE)
            // O próximo custo será: base (1) + usosNaCena
            const proximoCusto = this.custo.base + this.custo.usosNaCena;
            this.custo.pe = proximoCusto; // ATUALIZA O CUSTO ATUAL
            
            console.log(`Usos na cena: ${this.custo.usosNaCena}, Próximo custo: ${proximoCusto} PE`);
            
            return { 
                sucesso: true, 
                reducao: this.reducaoDano,
                custoGasto: custoAtual,
                proximoCusto: proximoCusto,
                usosNaCena: this.custo.usosNaCena,
                mensagem: `Redução de dano ativada! Reduz ${this.reducaoDano} de dano de fogo, frio ou mental. Gastou ${custoAtual} ${modo === "nex" ? "PE" : "PD"}. Próximo uso na cena custará ${proximoCusto}.`,
                gastoPE: custoAtual
            };
        },
        
        // Função para resetar custo (chamar no início de uma nova cena)
        resetarCena: function() {
            this.custo.usosNaCena = 0;
            this.custo.pe = this.custo.base; // Volta para 1 PE
            console.log("Cena resetada. Custo voltou para 1 PE");
            return {
                sucesso: true,
                mensagem: "Cena resetada. Próximo uso custará 1 PE."
            };
        },
        
        // Função para visualizar custo atual
        verCustoAtual: function() {
            const proximoCusto = this.custo.pe; // Já está atualizado para o próximo uso
            return {
                custoAtual: proximoCusto, // Mostra o custo para o PRÓXIMO uso
                usosNaCena: this.custo.usosNaCena,
                proximoCusto: proximoCusto,
                mensagem: `Custo atual: ${proximoCusto} PE (usos na cena: ${this.custo.usosNaCena}). Próximo uso custará ${proximoCusto} PE.`
            };
        }
    },
    equipamento: "Traje espacial ou partes dele, ferramentas de engenharia, kit de sobrevivência em ambientes hostis, medalhas",
    sugestaoAtributos: ["vigor", "intelecto"]
    },
    
    "atleta": {
    nome: "Atleta",
    pericias: ["acrobacia", "atletismo"],
    poder: {
        nome: "110%",
        descricao: "Quando faz um teste de perícia usando Força ou Agilidade (exceto Luta e Pontaria) você pode gastar 2 PE para receber +5 nesse teste.",
        tipo: "ativo",
        custo: { pe: 2 },
        efeito: "bonus_forca_agilidade",
        bonus: 5,
        atributosAfetados: ["forca", "agilidade"],
        periciasExcluidas: ["luta", "pontaria"],
        
        podeUsar: function() {
            const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
            if (modo === "nex") {
                const peAtual = Number(document.getElementById("esforco_atual").value) || 0;
                return peAtual >= this.custo.pe;
            } else {
                const pdAtual = Number(document.getElementById("determinacao_atual").value) || 0;
                return pdAtual >= this.custo.pe;
            }
        },
        
        usar: function(atributoTestado, periciaNome) {
            const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
            
            if (!this.podeUsar()) {
                return { 
                    sucesso: false, 
                    mensagem: "Pontos de Esforço/Determinação insuficientes!" 
                };
            }
            
            // Verificar se o atributo é afetado pelo poder
            const atributoValido = this.atributosAfetados.includes(atributoTestado);
            if (!atributoValido) {
                return {
                    sucesso: false,
                    mensagem: "Este poder só funciona em testes de Força ou Agilidade!"
                };
            }
            
            // Verificar se a perícia está excluída
            const periciaExcluida = this.periciasExcluidas.includes(periciaNome.toLowerCase());
            if (periciaExcluida) {
                return {
                    sucesso: false,
                    mensagem: "Este poder não funciona em testes de Luta ou Pontaria!"
                };
            }
            
            // Gastar pontos
            if (modo === "nex") {
                const peAtual = document.getElementById("esforco_atual");
                peAtual.value = Math.max(0, Number(peAtual.value) - this.custo.pe);
            } else {
                const pdAtual = document.getElementById("determinacao_atual");
                pdAtual.value = Math.max(0, Number(pdAtual.value) - this.custo.pe);
            }
            
            return { 
                sucesso: true, 
                bonus: this.bonus,
                atributo: atributoTestado,
                pericia: periciaNome,
                mensagem: `Poder 110% ativado! Gasto ${this.custo.pe} ${modo === "nex" ? "PE" : "PD"}. +${this.bonus} no teste de ${periciaNome}.`,
                gastoPE: this.custo.pe
            };
        }
    },
    equipamento: "Roupas esportivas de alta performance, tênis especializado, garrafa de água, equipamento de treino, suplementos",
    sugestaoAtributos: ["agilidade", "forca"]
    },
    
    "chef": {
    nome: "Chef",
    pericias: ["fortitude", "profissao_cozinheiro"],
    poder: {
        nome: "Ingrediente Secreto",
        descricao: "Em cenas de interlúdio, você pode preparar um prato especial. Você e o grupo recebem benefícios baseados no tipo de prato escolhido. Cada personagem só pode se beneficiar de uma refeição por interlúdio.",
        tipo: "narrativo",
        habilidades: [
            "Prato Favorito: Se relaxar no interlúdio, recupera +2 de Sanidade",
            "Prato Nutritivo: Se dormir no interlúdio, aumenta recuperação de PV em uma categoria",
            "Prato Energético: Se dormir no interlúdio, aumenta recuperação de PE em uma categoria",
            "Prato Rápido: Se revisar caso no interlúdio, recebe +5 no teste de perícia"
        ]
    },
    equipamento: "Facas profissionais, avental, temperos especiais, livro de receitas, ingredientes selecionados",
    sugestaoAtributos: ["intelecto", "vigor"]
    },
    
"chef_outro_lado": {
    nome: "Chef do Outro Lado",
    pericias: ["ocultismo", "profissao_cozinheiro"],
    poder: {
        nome: "Fome do Outro Lado",
        descricao: "Você utiliza partes de criaturas do Outro Lado como ingredientes culinários para preparar pratos paranormais com efeitos poderosos, mas perigosos.",
        tipo: "narrativo",
        habilidades: [
            "Obtenha ingredientes: Solicite como item Categoria I (0,5 espaço) ou obtenha de criaturas derrotadas (1 ingrediente por criatura Pequena ou maior)",
            "Preparação: Durante interlúdio, gaste 1 ingrediente e faça teste de Profissão (cozinheiro) DT 15 + O (resultado oculto)",
            "Sucesso (DT): Prato concede RD 10 contra o tipo de dano relacionado ao elemento da criatura",
            "Fracasso: Prato causa vulnerabilidade/resistência ao mesmo tipo de dano, depende do sucesso",
            "Efeitos: Duram até o fim da próxima cena",
            "Custo: Cada refeição consumida causa perda de 1 ponto PERMANENTE de Sanidade"
        ],
        detalhesMecanicos: {
            ingredientes: "Categoria I (0,5 espaço) ou 1 por criatura Pequena+",
            teste: "Profissão (cozinheiro) DT 15 + O",
            duracao: "Até fim da próxima cena",
            sucesso: "RD 10 contra dano do elemento",
            fracasso: "Vulnerabilidade ao dano do elemento",
            custoSanidade: "1 ponto PERMANENTE por refeição"
        }
    },
    equipamento: "Utensílios de cozinha modificados, ingredientes estranhos e raros, livro de receitas proibidas, proteções contra contaminação",
    sugestaoAtributos: ["intelecto", "presenca"]
    },
    
    "colegial": {
    nome: "Colegial",
    pericias: ["atualidades", "tecnologia"],
    poder: {
        nome: "Poder da Amizade",
        descricao: "Escolha um personagem para ser seu melhor amigo. Enquanto estiver em alcance médio dele e vocês puderem trocar olhares, você recebe +2 em todos os testes de perícia. Se ele morrer, você fica em luto até o fim da missão.",
        tipo: "passivo_amigo",
        bonus: 2,
        melhorAmigo: "vivo", // Estado: "vivo" ou "morto"
        
        mudarEstadoAmigo: function(novoEstado) {
            if (novoEstado === "vivo" || novoEstado === "morto") {
                this.melhorAmigo = novoEstado;
                return {
                    sucesso: true,
                    mensagem: `Melhor amigo agora está ${novoEstado === "vivo" ? "vivo e bem!" : "em luto (morto)."}`,
                    estado: novoEstado
                };
            }
            return {
                sucesso: false,
                mensagem: "Estado inválido. Use 'vivo' ou 'morto'."
            };
        },
        
        verificarBonus: function() {
            return this.melhorAmigo === "vivo";
        },
        
        habilidades: [
            "Enquanto seu melhor amigo estiver VIVO e próximo: +2 em todos os testes de perícia",
            "Se o melhor amigo morrer: perde o bônus até o fim da missão",
            "Pode escolher novo melhor amigo no início da próxima missão"
        ]
    },
    equipamento: "Mochila escolar, uniforme ou roupas casuais, smartphone, fones de ouvido, livros didáticos, lanche",
    sugestaoAtributos: ["presenca", "intelecto"]
    },
    
    "cosplayer": {
    nome: "Cosplayer",
    pericias: ["artes", "vontade"],
    poder: {
        nome: "Não é fantasia, é cosplay!",
        descricao: "Ao fazer um teste de perícia, se estiver utilizando um cosplay relacionado a essa perícia, você recebe +2 no teste. Escolha uma perícia para receber +2 quando estiver com o cosplay apropriado.",
        tipo: "passivo_escolha_cosplay",
        bonus: 2,
        periciaEscolhida: null,
        habilidades: [
            "Escolha uma perícia para receber +2 quando usar cosplay relacionado",
            "O bônus se aplica quando o cosplay for apropriado para a situação",
            "Pode escolher nova perícia no início de cada missão"
        ],
        podeUsar: function() {
            return this.periciaEscolhida !== null;
        },
        escolherPericia: function(periciaId) {
            this.periciaEscolhida = periciaId;
            return {
                sucesso: true,
                mensagem: `Perícia ${obterNomePericia(periciaId)} escolhida! Seu cosplay dará +2 de bônus quando apropriado.`
            };
        },
        obterBonus: function(periciaNome) {
            if (this.periciaEscolhida && 
                periciaNome.toLowerCase() === this.periciaEscolhida.toLowerCase()) {
                return this.bonus;
            }
            return 0;
        },
        resetarEscolha: function() {
            this.periciaEscolhida = null;
            return {
                sucesso: true,
                mensagem: "Escolha de cosplay resetada. Pode escolher nova perícia para próxima missão."
            };
        }
    },
    equipamento: "Kit de cosplay (materiais para fantasias, maquiagem, perucas), portfólio de fotos, ferramentas de costura, figurinos",
    sugestaoAtributos: ["presenca", "agilidade"]
    },
    
    "criminoso": {
    nome: "Criminoso",
    pericias: ["crime", "furtividade"],
    poder: {
        nome: "O Crime Compensa",
        descricao: "No final de uma missão, escolha um item encontrado na missão. Em sua próxima missão, você pode incluir esse item em seu inventário sem que ele conte em seu limite de itens por patente.",
        tipo: "narrativo",
        habilidades: [
            "No final de cada missão, escolha 1 item encontrado durante ela",
            "Na próxima missão, pode incluir esse item no inventário sem custo de espaço",
            "O item não conta no limite de itens por patente da próxima missão",
            "Só pode manter UM item fantasma por vez desta forma"
        ],
        detalhesMecanicos: {
            quandoUsar: "No final de cada missão",
            beneficio: "Item não conta no limite de espaço",
            limite: "1 item por vez",
            restricao: "Item precisa ter sido encontrado na missão anterior"
        }
    },
    equipamento: "Ferramentas de arrombamento, luvas de látex, capuz, roupas discretas, celular descartável",
    sugestaoAtributos: ["agilidade", "presenca"]
    },
    
    "cultista_arrependido": {
    nome: "Cultista Arrependido",
    pericias: ["ocultismo", "religiao"],
    poder: {
        nome: "Poder Paranormal Residual",
        descricao: "Você possui um poder paranormal à sua escolha. Porém, começa o jogo com metade da Sanidade normal para sua classe.",
        tipo: "narrativo",
        habilidades: [
            "Escolha um poder paranormal de qualquer classe (a critério do mestre)",
            "Este poder é residual de sua vida anterior como cultista",
            "Você começa com metade da Sanidade normal para sua classe (mecânica tratada separadamente)"
        ],
        detalhesMecanicos: {
            tipo: "Poder paranormal escolhido pelo jogador e aprovado pelo mestre",
            origem: "Residual da vida anterior no culto",
            efeito: "Funciona como um poder paranormal normal da classe escolhida",
            restricao: "A sanidade reduzida é tratada separadamente"
        }
    },
    equipamento: "Símbolos religiosos ou ocultistas (modificados ou destruídos), diário de confissões, amuletos de proteção, roupas simples",
    sugestaoAtributos: ["presenca", "vigor"]
    }, 

    "desgarrado": {
        nome: "Desgarrado",
        pericias: ["fortitude", "sobrevivencia"],
        poder: {
            nome: "Calejado",
            descricao: "Você recebe +1 PV para cada 5% de NEX.",
            tipo: "passivo",
            efeito: "bonus_pv_por_nex"
        },
        equipamento: "Roupas resistentes ao clima, kit de sobrevivência básico (faca, cantil, corda), saco de dormir, itens improvisados para abrigo",
        sugestaoAtributos: ["vigor", "forca"]
    },
    
    "diplomata": {
    nome: "Diplomata",
    pericias: ["atualidades", "diplomacia"],
    poder: {
        nome: "Conexões",
        descricao: "Você recebe +2 em Diplomacia. Além disso, se puder contatar um NPC capaz de lhe auxiliar, você pode gastar 10 minutos e 2 PE para substituir um teste de uma perícia relacionada ao conhecimento desse NPC, feito até o fim da cena, por um teste de Diplomacia.",
        tipo: "ativo_passivo",
        bonus: 2,
        custo: { pe: 2 },
        efeito: "bonus_diplomacia_substituir_teste"
    },
    equipamento: "Cartão de visitas profissional, smartphone com agenda de contatos, roupas formais, pasta com documentos diplomáticos, acesso a redes sociais profissionais",
    sugestaoAtributos: ["presenca", "intelecto"]
    },
    
    "engenheiro": {
        nome: "Engenheiro",
        pericias: ["profissao", "tecnologia"],
        poder: {
            nome: "Ferramenta Favorita",
            descricao: "Um item a sua escolha (exceto armas) conta como uma categoria abaixo (por exemplo, um item de categoria II conta como categoria I para você).",
            tipo: "narrativo",
            habilidades: [
                "Escolha um item não-arma para tratar como categoria inferior",
                "Aplique narrativamente em cenas de invenção ou uso de ferramentas (combine com o Mestre)"
            ]
        },
        equipamento: "Kit de ferramentas (chaves, multímetro, soldador), laptop com software de design (CAD), protótipos experimentais, óculos de proteção, caderno de esboços",
        sugestaoAtributos: ["intelecto", "agilidade"]
    },
    
    "executivo": {
        nome: "Executivo",
        pericias: ["diplomacia", "profissao"],
        poder: {
            nome: "Processo Otimizado",
            descricao: "Sempre que faz um teste de perícia durante um teste estendido, ou uma ação para revisar documentos (físicos ou digitais), pode pagar 2 PE para receber +5 nesse teste.",
            tipo: "ativo_escolha",  // Novo tipo: escolha de perícia + ativação com custo
            bonus: 5,
            custo: { pe: 2 },
            periciaEscolhida: null,
            // Funções similares a Amigo dos Animais
            escolherPericia: function(periciaId) {
                this.periciaEscolhida = periciaId;
                return {
                    sucesso: true,
                    mensagem: `Perícia ${obterNomePericia(periciaId)} escolhida! Pode ativar +${this.bonus} gastando ${this.custo.pe} PE.`
                };
            },
            podeUsar: function() {
                const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
                if (modo === "nex") {
                    const peAtual = Number(document.getElementById("esforco_atual").value) || 0;
                    return peAtual >= this.custo.pe;
                } else {
                    const pdAtual = Number(document.getElementById("determinacao_atual").value) || 0;
                    return pdAtual >= this.custo.pe;
                }
            },
            usar: function() {
                const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
                
                if (!this.podeUsar()) {
                    return { sucesso: false, mensagem: "Pontos insuficientes!" };
                }
                
                // Gastar pontos
                if (modo === "nex") {
                    const peAtual = document.getElementById("esforco_atual");
                    peAtual.value = Math.max(0, Number(peAtual.value) - this.custo.pe);
                } else {
                    const pdAtual = document.getElementById("determinacao_atual");
                    pdAtual.value = Math.max(0, Number(pdAtual.value) - this.custo.pe);
                }
                
                // Ativar flag global
                window.processoOtimizadoActivated = true;
                
                return { 
                    sucesso: true, 
                    bonus: this.bonus,
                    mensagem: `Processo Otimizado ativado! +${this.bonus} no próximo teste da perícia escolhida.`
                };
            }
        },
        equipamento: "Terno executivo, laptop corporativo, pasta de documentos, smartphone empresarial, cartões de visita, caneta-tinteiro",
        sugestaoAtributos: ["presenca", "intelecto"]
    },
    
    "experimento": {
    nome: "Experimento",
    pericias: ["atletismo", "fortitude"],
    poder: {
        nome: "Mutação",
        descricao: "Você recebe resistência a dano 2 e +2 em uma perícia à sua escolha que seja originalmente baseada em Força, Agilidade ou Vigor. Entretanto, sofre −1 em Diplomacia.",
        tipo: "passivo_escolha",
        bonus: 2,
        penalidadeDiplomacia: -1,  // Para aplicar -1 em Diplomacia
        periciaEscolhida: null,
        escolherPericia: function(periciaId) {
            // Validação simples (filtro é na UI, mas pode adicionar aqui se quiser)
            this.periciaEscolhida = periciaId;
            return {
                sucesso: true,
                mensagem: `Perícia ${obterNomePericia(periciaId)} escolhida! +2 aplicado.`
            };
        }
    },
    equipamento: "Cicatrizes ou marcas estranhas, kit médico experimental, roupas adaptadas para mutações, diário de experimentos, substâncias químicas residuais",
    sugestaoAtributos: ["forca", "agilidade", "vigor"]
    },
    
    "explorador": {
        nome: "Explorador",
        pericias: ["fortitude", "sobrevivencia"],
        poder: {
            nome: "Manual do Sobrevivente",
            descricao: "Ao fazer um teste para resistir a armadilhas, clima, doenças, fome, sede, fumaça, sono, sufocamento ou veneno, incluindo de fontes paranormais, você pode gastar 2 PE para receber +5 nesse teste. Além disso, em cenas de interlúdio, você considera condições de sono precárias como normais.",
            tipo: "ativo",
            bonus: 5,
            custo: { pe: 2 },
            podeUsar: function() {
                const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
                if (modo === "nex") {
                    const peAtual = Number(document.getElementById("esforco_atual").value) || 0;
                    return peAtual >= this.custo.pe;
                } else {
                    const pdAtual = Number(document.getElementById("determinacao_atual").value) || 0;
                    return pdAtual >= this.custo.pe;
                }
            },
            usar: function() {
                const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
                
                if (!this.podeUsar()) {
                    return { sucesso: false, mensagem: "Pontos insuficientes!" };
                }
                
                // Gastar pontos
                if (modo === "nex") {
                    const peAtual = document.getElementById("esforco_atual");
                    peAtual.value = Math.max(0, Number(peAtual.value) - this.custo.pe);
                } else {
                    const pdAtual = document.getElementById("determinacao_atual");
                    pdAtual.value = Math.max(0, Number(pdAtual.value) - this.custo.pe);
                }
                
                // Ativar flag global
                window.manualSobreviventeActivated = true;
                return { 
                    sucesso: true, 
                    bonus: this.bonus,
                    mensagem: `Manual do Sobrevivente ativado! +${this.bonus} no próximo teste de resistência.`
                };
            }
        },
        equipamento: "Mochila de exploração, bússola, mapa, cantil, lanterna, kit de primeiros socorros",
        sugestaoAtributos: ["vigor", "intelecto"]
    },
    
    "fanatico_criaturas": {
        nome: "Fanático por Criaturas",
        pericias: ["investigacao", "ocultismo"],
        poder: {
            nome: "Conhecimento Oculto",
            descricao: "Você pode fazer testes de Ocultismo para identificar criatura a partir de informações como uma imagem, rastros, indícios de sua presença ou outras pistas que o mestre considere suficientes. Se passar, você descobre as características da criatura (conforme descrito na perícia), mas não sua identidade ou tipo específico. Além disso, quando passa em um teste de Ocultismo para identificar criatura, você recebe também +2 em todos os testes contra a criatura até o fim da missão.",
            tipo: "narrativo",
            habilidades: [  // Para exibição em lista na UI
                "Testes de Ocultismo para identificar criaturas a partir de pistas",
                "+2 em testes contra a criatura identificada até o fim da missão (narrativo, combine com o Mestre)"
            ]
        },
        equipamento: "Equipamento de caça (câmera, gravador, binóculos, livros de folclore, kit de rastreamento)",
        sugestaoAtributos: ["intelecto", "presenca"]
    },
    
    "fotografo": {
        nome: "Fotógrafo",
        pericias: ["artes", "percepcao"],
        poder: {
            nome: "Através da Lente",
            descricao: "Quando faz um teste de Investigação ou de Percepção ou para adquirir pistas olhando através de uma câmera ou analisando fotos, você pode gastar 2 PE para receber +5 nesse teste (um personagem que se move olhando através de uma lente anda à metade de seu deslocamento).",
            tipo: "ativo",
            custo: { pe: 2 },
            bonus: 5,
            podeUsar: function() {
                const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
                if (modo === "nex") {
                    const peAtual = Number(document.getElementById("esforco_atual").value) || 0;
                    return peAtual >= this.custo.pe;
                } else {
                    const pdAtual = Number(document.getElementById("determinacao_atual").value) || 0;
                    return pdAtual >= this.custo.pe;
                }
            },
            usar: function() {
                const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
                
                if (!this.podeUsar()) {
                    return { sucesso: false, mensagem: "Pontos insuficientes!" };
                }
                
                // Gastar pontos
                if (modo === "nex") {
                    const peAtual = document.getElementById("esforco_atual");
                    peAtual.value = Math.max(0, Number(peAtual.value) - this.custo.pe);
                } else {
                    const pdAtual = document.getElementById("determinacao_atual");
                    pdAtual.value = Math.max(0, Number(pdAtual.value) - this.custo.pe);
                }
                
                // Ativar flag global
                window.atravesDaLenteActivated = true;
                
                return { 
                    sucesso: true, 
                    bonus: this.bonus,
                    mensagem: `Através da Lente ativado! +${this.bonus} na próxima Investigação ou Percepção.`
                };
            }
        },
        equipamento: "Câmera profissional, kit de lentes, cartão de memória, laptop para edição, álbum de fotos",
        sugestaoAtributos: ["presenca", "intelecto"]
    },
    
    "inventor_paranormal": {
    nome: "Inventor Paranormal",
    pericias: ["profissao_engenheiro", "vontade"],
    poder: {
        nome: "Invenção Paranormal",
        descricao: "Escolha um ritual de 1º círculo. Você possui um invento paranormal, um item de categoria 0 que ocupa 1 espaço e que permite que você execute o efeito do ritual escolhido. Para ativar o invento, você gasta uma ação padrão (ou a ação necessária para lançar o ritual, o que for maior) e faz um teste de Profissão (engenheiro) com DT 15 +5 para cada ativação na mesma missão. Se passar, o item faz o equivalente a conjurar o ritual em sua forma básica sem pagar seu custo em PE. Se falhar, ele enguiça. Você pode gastar uma ação de interlúdio para fazer a manutenção do seu invento; fazer isso o conserta e redefine sua DT de ativação para 15. Você pode trocar o ritual contido em seu invento no início de cada missão.",
        tipo: "narrativo",
        habilidades: [  // Para exibição em lista na UI
            "Escolha um ritual de 1º círculo para o invento",
            "Ative com teste de Profissão (engenheiro) DT 15 +5 por ativação (narrativo)",
            "Manutenção em interlúdio reseta DT (narrativo)",
            "Troque ritual no início de missão (narrativo)"
        ]
    },
    equipamento: "Laboratório portátil, ferramentas de engenharia, componentes paranormais, notebook com esquemas",
    sugestaoAtributos: ["intelecto", "vigor"]
    },
    
    "investigador": {
        nome: "Investigador",
        pericias: ["investigacao", "percepcao"],
        poder: {
            nome: "Faro para Pistas",
            descricao: "Uma vez por cena, quando fizer um teste para procurar pistas, você pode gastar 1 PE para receber +5 nesse teste.",
            tipo: "ativo",
            custo: { pe: 1 },
            bonus: 5,
            podeUsar: function() {
                const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
                if (modo === "nex") {
                    const peAtual = Number(document.getElementById("esforco_atual").value) || 0;
                    return peAtual >= this.custo.pe;
                } else {
                    const pdAtual = Number(document.getElementById("determinacao_atual").value) || 0;
                    return pdAtual >= this.custo.pe;
                }
            },
            usar: function() {
                const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
                
                if (!this.podeUsar()) {
                    return { sucesso: false, mensagem: "Pontos insuficientes!" };
                }
                
                // Gastar pontos
                if (modo === "nex") {
                    const peAtual = document.getElementById("esforco_atual");
                    peAtual.value = Math.max(0, Number(peAtual.value) - this.custo.pe);
                } else {
                    const pdAtual = document.getElementById("determinacao_atual");
                    pdAtual.value = Math.max(0, Number(pdAtual.value) - this.custo.pe);
                }
                
                // Ativar flag global
                window.faroParaPistasActivated = true;
                
                return { 
                    sucesso: true, 
                    bonus: this.bonus,
                    mensagem: `Faro para Pistas ativado! +${this.bonus} na próxima busca por pistas (uma vez por cena, narrativo).`
                };
            }
        },
        equipamento: "Lupa, kit de investigação, crachá falso, notebook para anotações, gravador",
        sugestaoAtributos: ["intelecto", "presenca"]
    },
    
    "jovem_mistico": {
        nome: "Jovem Místico",
        pericias: ["ocultismo", "religiao"],
        poder: {
            nome: "A Culpa é das Estrelas",
            descricao: "Escolha um número da sorte entre 1 e 6. No início de cada cena, você pode gastar 1 PE e rolar 1d6. Se o resultado for seu número da sorte, você recebe +2 em testes de perícia até o fim da cena. Caso contrário, na próxima vez que usar esta habilidade, escolha mais um número como número da sorte. Quando rolar um de seus números da sorte, a quantidade de números volta a 1.",
            tipo: "ativo",
            custo: { pe: 1 },
            podeUsar: function() {
                const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
                if (modo === "nex") {
                    const peAtual = Number(document.getElementById("esforco_atual").value) || 0;
                    return peAtual >= this.custo.pe;
                } else {
                    const pdAtual = Number(document.getElementById("determinacao_atual").value) || 0;
                    return pdAtual >= this.custo.pe;
                }
            },
            usar: function() {
                const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
                
                if (!this.podeUsar()) {
                    return { sucesso: false, mensagem: "Pontos insuficientes!" };
                }
                
                // Gastar pontos
                if (modo === "nex") {
                    const peAtual = document.getElementById("esforco_atual");
                    peAtual.value = Math.max(0, Number(peAtual.value) - this.custo.pe);
                } else {
                    const pdAtual = document.getElementById("determinacao_atual");
                    pdAtual.value = Math.max(0, Number(pdAtual.value) - this.custo.pe);
                }
                
                // Rolagem de 1d6 (simples sorteio)
                const resultadoD6 = Math.floor(Math.random() * 6) + 1;
                
                return { 
                    sucesso: true, 
                    resultado: resultadoD6,
                    mensagem: `A Culpa é das Estrelas ativado! Gasto ${this.custo.pe} ${modo === "nex" ? "PE" : "PD"}. Resultado do d6: ${resultadoD6}.`
                };
            }
        },
        equipamento: "Amuletos espirituais, tarot, incenso, livro de horóscopo, cristais",
        sugestaoAtributos: ["presenca", "intelecto"]
    },
    
    "legista": {
        nome: "Legista",
        pericias: ["ciencias", "medicina"],
        poder: {
            nome: "Luto Habitual",
            descricao: "Você sofre apenas a metade do dano mental por presenciar uma cena que, a critério do mestre, esteja relacionada à rotina de um legista (como presenciar uma morte, ver um cadáver ou encontrar órgãos humanos). Além disso, quando faz um teste de Medicina para primeiros socorros ou necropsia, você pode gastar 2 PE para receber +5 nesse teste.",
            tipo: "ativo_passivo",
            bonus: 5,  // Para o ativo
            custo: { pe: 2 },
            podeUsar: function() {
                const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
                if (modo === "nex") {
                    const peAtual = Number(document.getElementById("esforco_atual").value) || 0;
                    return peAtual >= this.custo.pe;
                } else {
                    const pdAtual = Number(document.getElementById("determinacao_atual").value) || 0;
                    return pdAtual >= this.custo.pe;
                }
            },
            usar: function() {
                const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
                
                if (!this.podeUsar()) {
                    return { sucesso: false, mensagem: "Pontos insuficientes!" };
                }
                
                // Gastar pontos
                if (modo === "nex") {
                    const peAtual = document.getElementById("esforco_atual");
                    peAtual.value = Math.max(0, Number(peAtual.value) - this.custo.pe);
                } else {
                    const pdAtual = document.getElementById("determinacao_atual");
                    pdAtual.value = Math.max(0, Number(pdAtual.value) - this.custo.pe);
                }
                
                // Ativar flag global
                window.lutoHabitualActivated = true;
                
                return { 
                    sucesso: true, 
                    bonus: this.bonus,
                    mensagem: `Luto Habitual ativado! +${this.bonus} no próximo teste de Medicina.`
                };
            }
        },
        equipamento: "Kit médico forense, luvas, bisturi, gravador de áudio, máscara",
        sugestaoAtributos: ["intelecto", "vigor"]
    },

    "legista_turno_noite": {
        nome: "Legista do Turno da Noite",
        pericias: ["ciencias", "medicina"],
        poder: {
            nome: "Luto Habitual",
            descricao: "Você é imune aos efeitos de horror de ver cadáveres ou cenas de morte violentas. Em autópsias ou exames forenses, você descobre informações extras com teste de Medicina ou Ciências.",
            tipo: "passivo",
            efeito: "imunidade_horror_cadaveres_info_extra_forense"
        },
        equipamento: "Kit de necropsia (luvas, máscara, instrumentos), jaleco, lanterna potente, gravador, álcool em gel",
        sugestaoAtributos: ["intelecto", "vigor"]
    },
    
    "lutador": {
        nome: "Lutador",
        pericias: ["luta", "reflexos"],
        poder: {
            nome: "Mão Pesada",
            descricao: "Você recebe +2 em rolagens de dano com ataques corpo a corpo.",
            tipo: "passivo"
        },
        equipamento: "Luvas de luta, protetor bucal, saco de pancadas, vídeo de treinamentos",
        sugestaoAtributos: ["forca", "agilidade"]
    },
    
    "magnata": {
        nome: "Magnata",
        pericias: ["diplomacia", "pilotagem"],
        poder: {
            nome: "Patrocinador da Ordem",
            descricao: "Seu limite de crédito é sempre considerado um acima do atual.",
            tipo: "passivo"
        },
        equipamento: "Cartão de crédito ilimitado, carro de luxo, contatos empresariais, relógio caro",
        sugestaoAtributos: ["presenca", "intelecto"]
    },
    
    "mateiro": {
        nome: "Mateiro",
        pericias: ["percepcao", "sobrevivencia"],
        poder: {
            nome: "Mapa Celeste",
            descricao: "Desde que possa ver o céu, você sempre sabe as direções dos pontos cardeais e consegue chegar sem se perder em qualquer lugar que já tenha visitado ao menos uma vez. Quando faz um teste de Sobrevivência, você pode gastar 2 PE para rolar o teste novamente e escolher o melhor entre os dois resultados. Além disso, em cenas de interlúdio, você considera condições de sono precárias como normais.",
            tipo: "ativo",
            custo: { pe: 2 },
            podeUsar: function() {
                const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
                if (modo === "nex") {
                    const peAtual = Number(document.getElementById("esforco_atual").value) || 0;
                    return peAtual >= this.custo.pe;
                } else {
                    const pdAtual = Number(document.getElementById("determinacao_atual").value) || 0;
                    return pdAtual >= this.custo.pe;
                }
            },
            usar: function() {
                const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
                
                if (!this.podeUsar()) {
                    return { sucesso: false, mensagem: "Pontos insuficientes!" };
                }
                
                // Gastar pontos
                if (modo === "nex") {
                    const peAtual = document.getElementById("esforco_atual");
                    peAtual.value = Math.max(0, Number(peAtual.value) - this.custo.pe);
                } else {
                    const pdAtual = document.getElementById("determinacao_atual");
                    pdAtual.value = Math.max(0, Number(pdAtual.value) - this.custo.pe);
                }
                
                return { 
                    sucesso: true, 
                    mensagem: `Mapa Celeste ativado! Gasto ${this.custo.pe} ${modo === "nex" ? "PE" : "PD"}. (Reroll em Sobrevivência narrativo)`
                };
            }
        },
        equipamento: "Bússola, mapa, botas de trilha, cantil, kit de sobrevivência",
        sugestaoAtributos: ["presenca", "intelecto"]
    },
    
    "mergulhador": {
        nome: "Mergulhador",
        pericias: ["atletismo", "fortitude"],
        poder: {
            nome: "Fôlego de Nadador",
            descricao: "Você recebe +5 PV e pode prender a respiração por um número de rodadas igual ao dobro do seu Vigor. Além disso, quando passa em um teste de Atletismo para natação, você avança seu deslocamento normal (em vez da metade).",
            tipo: "passivo"
            // Não precisa de 'efeito' ou 'bonus' porque o +5 PV será calculado diretamente no status.js
        },
        equipamento: "Roupas de mergulho ou neoprene, máscara e snorkel, faca de mergulho, lanterna subaquática, kit de primeiros socorros",
        sugestaoAtributos: ["vigor", "forca"]
    },
    
    "mercenario": {
        nome: "Mercenário",
        pericias: ["iniciativa", "intimidacao"],
        poder: {
            nome: "Posição de Combate",
            descricao: "No primeiro turno de cada cena de ação, você pode gastar 2 PE para receber uma ação de movimento adicional.",
            tipo: "ativo",
            custo: { pe: 2 },
            podeUsar: function() {
                const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
                if (modo === "nex") {
                    const peAtual = Number(document.getElementById("esforco_atual").value) || 0;
                    return peAtual >= this.custo.pe;
                } else {
                    const pdAtual = Number(document.getElementById("determinacao_atual").value) || 0;
                    return pdAtual >= this.custo.pe;
                }
            },
            usar: function() {
                const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
                
                if (!this.podeUsar()) {
                    return { sucesso: false, mensagem: "Pontos de Esforço/Determinação insuficientes!" };
                }
                
                // Gastar pontos
                if (modo === "nex") {
                    const peAtual = document.getElementById("esforco_atual");
                    peAtual.value = Math.max(0, Number(peAtual.value) - this.custo.pe);
                } else {
                    const pdAtual = document.getElementById("determinacao_atual");
                    pdAtual.value = Math.max(0, Number(pdAtual.value) - this.custo.pe);
                }
                
                return { 
                    sucesso: true, 
                    mensagem: `Posição de Combate ativada! Gasto ${this.custo.pe} ${modo === "nex" ? "PE" : "PD"}. Ação de movimento adicional (narrativo, no primeiro turno).`
                };
            }
        },
        equipamento: "Armas leves, colete à prova de balas, comunicador, contrato de serviços",
        sugestaoAtributos: ["agilidade", "presenca"]
    },
    
    "militar": {
        nome: "Militar",
        pericias: ["pontaria", "tatica"],
        poder: {
            nome: "Para Bellum",
            descricao: "Você recebe +2 em rolagens de dano com armas de fogo.",
            tipo: "passivo"
        },
        equipamento: "Uniforme militar ou partes dele, arma de serviço (se permitido), kit de campo, bússola militar, manual de procedimentos",
        sugestaoAtributos: ["forca", "presenca"]
    },
    
    "motorista": {
        nome: "Motorista",
        pericias: ["pilotagem", "reflexos"],
        poder: {
            nome: "Mãos no Volante",
            descricao: "Você não sofre penalidades em testes de ataque por estar em um veículo em movimento e, sempre que estiver pilotando e tiver que fazer um teste de Pilotagem ou resistência, pode gastar 2 PE para receber +5 nesse teste.",
            tipo: "ativo",
            custo: { pe: 2 },
            bonus: 5,
            podeUsar: function() {
                const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
                if (modo === "nex") {
                    const peAtual = Number(document.getElementById("esforco_atual").value) || 0;
                    return peAtual >= this.custo.pe;
                } else {
                    const pdAtual = Number(document.getElementById("determinacao_atual").value) || 0;
                    return pdAtual >= this.custo.pe;
                }
            },
            usar: function() {
                const modo = document.querySelector('input[name="modo"]:checked')?.value || "nex";
                
                if (!this.podeUsar()) {
                    return { sucesso: false, mensagem: "Pontos de Esforço/Determinação insuficientes!" };
                }
                
                // Gastar pontos
                if (modo === "nex") {
                    const peAtual = document.getElementById("esforco_atual");
                    peAtual.value = Math.max(0, Number(peAtual.value) - this.custo.pe);
                } else {
                    const pdAtual = document.getElementById("determinacao_atual");
                    pdAtual.value = Math.max(0, Number(pdAtual.value) - this.custo.pe);
                }
                
                maosNoVolanteActivated = true;
                
                return { 
                    sucesso: true, 
                    mensagem: `Mãos no Volante ativado! Gasto 2 ${modo === "nex" ? "PE" : "PD"}. +5 no próximo teste de Pilotagem ou resistência (narrativo enquanto pilotando).`
                };
            }
        },
        equipamento: "Chaves de veículo, kit de ferramentas para carro, GPS modificado, capa de chuva, garrafa térmica",
        sugestaoAtributos: ["agilidade", "intelecto"]
    },
    
    "nerd_entusiasta": {
        nome: "Nerd Entusiasta",
        pericias: ["ciencias", "tecnologia"],
        poder: {
            nome: "O Inteligentão",
            descricao: "Você tem conhecimento enciclopédico sobre ficção científica, fantasia e cultura pop. Pode fazer analogias úteis entre situações reais e ficção. Em testes de Ciências ou Tecnologia relacionados a conceitos teóricos, você tem +2.",
            tipo: "passivo",
            efeito: "conhecimento_cultura_pop_bonus_ciencias_teoria"
        },
        equipamento: "Livros ou mangás, console portátil, mochila com adesivos, action figures, laptop com jogos e softwares",
        sugestaoAtributos: ["intelecto", "presenca"]
    },
    
    "operario": {
        nome: "Operário",
        pericias: ["fortitude", "profissao_operario"],
        poder: {
            nome: "Ferramenta de Trabalho",
            descricao: "Escolha uma arma simples ou tática que, a critério do mestre, poderia ser usada como ferramenta em sua profissão (como uma marreta para um pedreiro). Você sabe usar a arma escolhida e recebe +1 em testes de ataque, rolagens de dano e margem de ameaça com ela.",
            tipo: "passivo"
        },
        equipamento: "Ferramentas de trabalho, uniforme ou macacão, botas de segurança, lancheira, capacete",
        sugestaoAtributos: ["forca", "vigor"]
    },
    
    "policial": {
        nome: "Policial",
        pericias: ["percepcao", "pontaria"],
        poder: {
            nome: "Patrulha",
            descricao: "Você recebe +2 em Defesa.",
            tipo: "passivo"
        },
        equipamento: "Colete à prova de balas, arma de serviço (se permitido), algemas, rádio comunicador, distintivo, lanterna tática",
        sugestaoAtributos: ["presenca", "agilidade"]
    },
    
    "profetizado": {
        nome: "Profetizado",
        pericias: ["vontade", "escolha_luta_ou_pontaria"],
        poder: {
            nome: "Luta ou Fuga",
            descricao: "Uma vez por cena, quando reduzido a 0 de Vida, você não fica inconsciente imediatamente. Pode realizar uma última ação antes de cair. Em situações de extremo perigo, você tem +2 em testes de Vontade.",
            tipo: "ativo",
            usos: { porCena: 1 },
            efeito: "ultima_acao_morrendo_bonus_vontade_perigo"
        },
        equipamento: "Objeto profético (livro antigo, medalhão, arma herdada), roupas simples, diário de visões, kit de primeiros socorros",
        sugestaoAtributos: ["vigor", "presenca"],
        especial: true
    },
    
    "psicologo": {
        nome: "Psicólogo",
        pericias: ["intuicao", "profissao_psicologo"],
        poder: {
            nome: "Terapia",
            descricao: "Uma vez por dia, você pode ajudar um aliado a recuperar 1d6 de Sanidade com uma conversa terapêutica. Em testes de Intuição para entender motivações ou detectar mentiras, você tem vantagem.",
            tipo: "ativo",
            usos: { porDia: 1 },
            efeito: "curar_sanidade_vantagem_intuicao_motivacoes"
        },
        equipamento: "Bloco de anotações, gravador, livros de psicologia, relógio de pulso, roupas profissionais discretas",
        sugestaoAtributos: ["presenca", "intelecto"]
    },
    
    "religioso": {
        nome: "Religioso",
        pericias: ["religiao", "vontade"],
        poder: {
            nome: "Acalentar",
            descricao: "Você pode acalmar pessoas em pânico com teste de Presença (DT 15). Aliados próximos recebem +1 em testes de Vontade contra medo. Seu conhecimento religioso concede +2 em testes de Religião sobre sua fé específica.",
            tipo: "ativo",
            efeito: "acalmar_panico_bonus_aliados_vontade_bonus_religiao"
        },
        equipamento: "Símbolos religiosos, vestes religiosas ou discretas, livro sagrado, kit de oração, diário espiritual",
        sugestaoAtributos: ["presenca", "vigor"]
    },
    
    "reporter_investigativo": {
        nome: "Repórter Investigativo",
        pericias: ["atualidades", "investigacao"],
        poder: {
            nome: "Encontrar a Verdade",
            descricao: "Você tem fontes em vários lugares. Pode obter informações públicas rapidamente (1d4 horas em vez de 1d4 dias). Em testes de Investigação para desvendar segredos ou conspirações, você tem +2.",
            tipo: "passivo",
            efeito: "fontes_rapidas_bonus_investigacao_segredos"
        },
        equipamento: "Gravador profissional, câmera, caderno de reportagem, laptop, credencial de imprensa, contatos importantes",
        sugestaoAtributos: ["presenca", "intelecto"]
    },
    
    "servidor_publico": {
        nome: "Servidor Público",
        pericias: ["intuicao", "vontade"],
        poder: {
            nome: "Espírito Cívico",
            descricao: "Você conhece procedimentos burocráticos e pode acelerá-los. Em instituições públicas, você tem acesso facilitado a arquivos não classificados. Recebe +2 em testes de Vontade para resistir a corrupção ou suborno.",
            tipo: "passivo",
            efeito: "acelerar_burocracia_acesso_arquivos_resistencia_suborno"
        },
        equipamento: "Cracha funcional, pastas com documentos, roupas formais, caneta, agenda, calculadora",
        sugestaoAtributos: ["presenca", "intelecto"]
    },
    
    "teorico_conspiracao": {
        nome: "Teórico da Conspiração",
        pericias: ["investigacao", "ocultismo"],
        poder: {
            nome: "Eu Já Sabia",
            descricao: "Você suspeita de tudo. Quando o mestre revela uma surpresa ou reviravolta, você pode declarar 'Eu já sabia!' e ganhar um ponto de Sanidade. Em testes para conectar informações aparentemente não relacionadas, você tem vantagem.",
            tipo: "ativo",
            efeito: "ganhar_sanidade_surpresa_vantagem_conexoes"
        },
        equipamento: "Quadro de conexões com barbante e fotos, dossiês impressos, laptop com teorias, roupas casuais, gravador escondido",
        sugestaoAtributos: ["intelecto", "presenca"]
    },
    
    "ti": {
        nome: "T.I.",
        pericias: ["investigacao", "tecnologia"],
        poder: {
            nome: "Motor de Busca",
            descricao: "Você encontra informações online rapidamente. Testes de Tecnologia para hackear ou pesquisar na internet levam metade do tempo. Em sistemas de informática, você tem +2 para contornar segurança digital básica.",
            tipo: "passivo",
            efeito: "pesquisa_rapida_bonus_hackear"
        },
        equipamento: "Laptop poderoso, dispositivos de rede, pen drives com ferramentas, fones de ouvido, café em garrafa térmica, mochila técnica",
        sugestaoAtributos: ["intelecto", "agilidade"]
    },
    
    "trabalhador_rural": {
        nome: "Trabalhador Rural",
        pericias: ["adestramento", "sobrevivencia"],
        poder: {
            nome: "Desbravador",
            descricao: "Você é excepcionalmente resistente. Recebe +2 em testes de Fortitude contra doenças e venenos naturais. Conhece usos medicinais de plantas comuns (cura 1d4 de Vida com teste de Sobrevivência).",
            tipo: "passivo",
            efeito: "resistencia_doencas_conhecimento_plantas_medicinais"
        },
        equipamento: "Chapéu, botas de campo, facão, cantil, tabaco ou rapé, animais de trabalho (se aplicável), kit de reparos simples",
        sugestaoAtributos: ["vigor", "forca"]
    },
    
    "trambiqueiro": {
        nome: "Trambiqueiro",
        pericias: ["crime", "enganacao"],
        poder: {
            nome: "Impostor",
            descricao: "Você pode se passar por outras profissões com teste de Enganação. Em situações sociais onde está fingindo ser alguém, você tem vantagem nos testes. Conhece técnicas para criar documentos falsos convincentes.",
            tipo: "passivo",
            efeito: "fingir_profissao_vantagem_enganacao_documentos_falsos"
        },
        equipamento: "Roupas versáteis para disfarces, kit de falsificação básica, celular descartável, carteiras de identidade falsas, dinheiro falso de demonstração",
        sugestaoAtributos: ["presenca", "agilidade"]
    },
    
    "universitario": {
        nome: "Universitário",
        pericias: ["atualidades", "investigacao"],
        poder: {
            nome: "Dedicação",
            descricao: "Quando foca em uma tarefa acadêmica ou de pesquisa, você pode rolar novamente um teste de Intelecto relacionado uma vez por cena. Tem acesso a bibliotecas universitárias e bancos de dados acadêmicos.",
            tipo: "ativo",
            usos: { porCena: 1 },
            efeito: "reroll_teste_intelecto_acesso_bibliotecas"
        },
        equipamento: "Mochila com livros, laptop, cadernos, canetas, crachá universitário, café termicamente, roupas casuais",
        sugestaoAtributos: ["intelecto", "presenca"]
    },
    
    "vitima": {
        nome: "Vítima",
        pericias: ["reflexos", "vontade"],
        poder: {
            nome: "Cicatrizes Psicológicas",
            descricao: "Você já viu o pior. Recebe +2 em testes de Vontade contra efeitos de medo ou horror. Quando testemunha algo traumático, pode rolar novamente um teste de Sanidade uma vez por sessão.",
            tipo: "ativo",
            usos: { porSessao: 1 },
            efeito: "bonus_vontade_medo_reroll_sanidade_trauma"
        },
        equipamento: "Objetos de valor sentimental, diário terapêutico, roupas simples, kit de emergência (lanterna, apito), medicamentos para ansiedade",
        sugestaoAtributos: ["vigor", "presenca"]
    }
};

// Mapeamento de IDs de perícia para nomes amigáveis
const MAPEAMENTO_PERICIAS_NOMES = {
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
    'profissao_cozinheiro': 'Profissão (Cozinheiro)',
    'profissao_engenheiro': 'Profissão (Engenheiro)',
    'profissao_executivo': 'Profissão (Executivo)',
    'profissao_operario': 'Profissão (Operário)',
    'profissao_psicologo': 'Profissão (Psicólogo)',
    'reflexos': 'Reflexos',
    'religiao': 'Religião',
    'sobrevivencia': 'Sobrevivência',
    'tatica': 'Tática',
    'tecnologia': 'Tecnologia',
    'vontade': 'Vontade',
    'escolha_mestre': 'Duas à escolha do Mestre',
    'escolha_luta_ou_pontaria': 'Luta ou Pontaria (escolha)'
};

// No final do arquivo origens.js, adicionar:
function obterOrigemPorId(id) {
    // Retorna a origem pelo ID ou null se não existir
    return ORIGENS[id] || null;
}

// Função para obter nome amigável de uma perícia
function obterNomePericia(idPericia) {
    return MAPEAMENTO_PERICIAS_NOMES[idPericia] || idPericia;
}

// Função para listar todas as origens
function listarTodasOrigens() {
    return Object.keys(ORIGENS).map(id => ({
        id: id,
        nome: ORIGENS[id].nome,
        pericias: ORIGENS[id].pericias,
        poder: ORIGENS[id].poder.nome
    }));
}