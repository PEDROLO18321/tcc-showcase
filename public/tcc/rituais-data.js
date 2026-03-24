// ==================== rituais-data.js ====================
// Dados de todos os rituais de Ordem Paranormal

const CUSTOS_POR_CIRCULO = { 1: 1, 2: 3, 3: 6, 4: 10 };

const RITUAIS = [
  // ═══════════ 1º CÍRCULO ═══════════

  // ── CONHECIMENTO 1 ──
  {
    id: 1001,
    nome: "Amaldiçoar Arma",
    elemento: "Conhecimento",
    circulo: 1,
    custo: 1,
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 arma corpo a corpo ou pacote de munição",
    duracao: "cena",
    resistencia: null,
    descricao: "Quando aprender este ritual, escolha um elemento entre Conhecimento, Energia, Morte e Sangue. Este ritual passa a ser do elemento escolhido. Você imbui a arma ou munições com o elemento, fazendo com que causem +1d6 de dano do tipo do elemento.",
    formas: {
      discente: { custo: "+2 PE", descricao: "Muda o bônus de dano para +2d6. Requer 2º círculo." },
      verdadeiro: { custo: "+5 PE", descricao: "Muda o alcance para 'curto' e o alvo para 'um aliado à sua escolha'. Requer 3º círculo." }
    }
  },
  {
    id: 1002,
    nome: "Compreensão Paranormal",
    elemento: "Conhecimento",
    circulo: 1,
    custo: 1,
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 ser ou objeto",
    duracao: "cena",
    resistencia: "Vontade anula (veja texto)",
    descricao: "O ritual confere a você compreensão sobrenatural da linguagem. Se tocar um objeto contendo informação (um livro, um dispositivo com uma gravação…), você entende as palavras mesmo que não conheça seu idioma. Se tocar um ser, você pode se comunicar com ele mesmo que não compartilhem um idioma.",
    formas: {
      discente: { custo: "+3 PE", descricao: "Muda a resistência para 'nenhum' e o alvo para 'você' e a duração para 'cena'. O ritual afeta somente o conjurador." },
      verdadeiro: null
    }
  },
  {
    id: 1003,
    nome: "Enfeitiçar",
    elemento: "Conhecimento",
    circulo: 1,
    custo: 1,
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 pessoa",
    duracao: "cena",
    resistencia: "Vontade anula",
    descricao: "Este ritual torna o alvo prestativo. Ele não fica sob seu controle, mas percebe suas palavras e ações da maneira mais favorável possível. Você recebe +10 em testes de Diplomacia com ele. Um alvo hostil ou em combate recebe +5 em seu teste de resistência. Se você ou seus aliados tomarem ação hostil contra o alvo, o efeito é dissipado.",
    formas: {
      discente: { custo: "+2 PE", descricao: "Em vez do normal, você sugere uma ação para o alvo e ele obedece. A sugestão deve parecer aceitável. Requer 2º círculo." },
      verdadeiro: { custo: "+5 PE", descricao: "Afeta todos os alvos dentro do alcance. Requer 3º círculo." }
    }
  },
  {
    id: 1004,
    nome: "Perturbação",
    elemento: "Conhecimento",
    circulo: 1,
    custo: 1,
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 ser",
    duracao: "cena",
    resistencia: "Vontade parcial",
    descricao: "Você força o alvo a obedecer a uma ordem simples e direta. A ordem não pode ser suicida.",
    formas: null
  },
  {
    id: 1005,
    nome: "Ouvir os Sussurros",
    elemento: "Conhecimento",
    circulo: 1,
    custo: 1,
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "cena",
    resistencia: null,
    descricao: "Você se comunica com vozes do Outro Lado para receber informações. Faça uma pergunta sobre um evento, local ou objeto. O mestre faz um teste de Ocultismo secreto; se passar, você recebe uma resposta curta e enigmática.",
    formas: null
  },
  {
    id: 1006,
    nome: "Tecer Ilusão",
    elemento: "Conhecimento",
    circulo: 1,
    custo: 1,
    execucao: "padrão",
    alcance: "médio",
    alvo: "veja texto",
    duracao: "sustentada",
    resistencia: "Vontade desacredita",
    descricao: "Você cria uma ilusão visual ou sonora. A ilusão pode ter até tamanho Grande e emitir sons. Se um ser interagir com a ilusão (tocar, examinar), pode fazer um teste de Vontade para desacreditar.",
    formas: null
  },
  {
    id: 1007,
    nome: "Terceiro Olho",
    elemento: "Conhecimento",
    circulo: 1,
    custo: 1,
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "cena",
    resistencia: null,
    descricao: "Você vê manifestações paranormais ao redor. Consegue detectar auras de rituais ativos e a presença de criaturas paranormais até alcance médio, mesmo através de paredes.",
    formas: null
  },

  // ── ENERGIA 1 ──
  {
    id: 1008,
    nome: "Amaldiçoar Tecnologia",
    elemento: "Energia",
    circulo: 1,
    custo: 1,
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 item tecnológico",
    duracao: "cena",
    resistencia: null,
    descricao: "Você aprimora um item tecnológico, concedendo +1 em testes realizados com ele.",
    formas: null
  },
  {
    id: 1009,
    nome: "Coincidência Forçada",
    elemento: "Energia",
    circulo: 1,
    custo: 1,
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 ser",
    duracao: "cena",
    resistencia: null,
    descricao: "Você manipula os caminhos do caos para que o alvo tenha mais sorte. O alvo recebe +2 em testes de perícias.",
    formas: {
      discente: { custo: "+2 PE", descricao: "Muda o alvo para aliados à sua escolha. Requer 2º círculo." },
      verdadeiro: { custo: "+5 PE", descricao: "Muda o alvo para aliados à sua escolha e o bônus para +5. Requer 3º círculo e afinidade." }
    }
  },
  {
    id: 1010,
    nome: "Eletrocussão",
    elemento: "Energia",
    circulo: 1,
    custo: 1,
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 ser ou objeto",
    duracao: "instantânea",
    resistencia: "Fortitude parcial",
    descricao: "Você manifesta e dispara uma corrente elétrica contra o alvo, que sofre 3d6 pontos de dano de eletricidade e fica vulnerável por uma rodada. Se passar no teste de resistência, sofre apenas metade do dano e evita a condição.",
    formas: {
      discente: { custo: "+2 PE", descricao: "Muda o alvo para 'área: linha de 30m'. Dispara um raio que causa 6d6 pontos de dano de Energia. Requer 2º círculo." },
      verdadeiro: { custo: "+5 PE", descricao: "Muda o alvo para 'alvos escolhidos'. Dispara vários relâmpagos causando 8d6 pontos de dano de Energia em cada. Requer 3º círculo." }
    }
  },
  {
    id: 1011,
    nome: "Embaralhar",
    elemento: "Energia",
    circulo: 1,
    custo: 1,
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "cena",
    resistencia: null,
    descricao: "Você cria três cópias ilusórias suas, como hologramas. As cópias ficam ao seu redor e imitam suas ações. Você recebe +6 na Defesa. Cada vez que um ataque erra, uma cópia desaparece e o bônus diminui em 2.",
    formas: {
      discente: { custo: "+2 PE", descricao: "Muda o número de cópias para 5 (bônus na Defesa para +10). Requer 2º círculo." },
      verdadeiro: { custo: "+5 PE", descricao: "Muda o número de cópias para 8 (bônus na Defesa para +16). Cada cópia destruída emite um clarão, ofuscando o atacante. Requer 3º círculo." }
    }
  },

  // ── MORTE 1 ──
  {
    id: 1012,
    nome: "Alterar Destino",
    elemento: "Morte",
    circulo: 1,
    custo: 1,
    execucao: "livre",
    alcance: "pessoal",
    alvo: "você",
    duracao: "1 rodada",
    resistencia: null,
    descricao: "Espirais surgem no corpo do alvo, tornando seus movimentos mais eficazes.",
    formas: null
  },
  {
    id: 1013,
    nome: "Cicatrização",
    elemento: "Morte",
    circulo: 1,
    custo: 1,
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 ser",
    duracao: "instantânea",
    resistencia: null,
    descricao: "Você acelera o tempo ao redor das feridas do alvo, que cicatrizam instantaneamente. O alvo recupera 3d8+3 PV, mas envelhece 1 ano automaticamente.",
    formas: {
      discente: { custo: "+2 PE", descricao: "Aumenta a cura para 5d8+5 PV. Requer 2º círculo." },
      verdadeiro: { custo: "+9 PE", descricao: "Muda o alcance para 'curto', o alvo para 'seres escolhidos' e aumenta a cura para 7d8+7 PV. Requer 4º círculo e afinidade com Morte." }
    }
  },
  {
    id: 1014,
    nome: "Decadência",
    elemento: "Morte",
    circulo: 1,
    custo: 1,
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 ser",
    duracao: "instantânea",
    resistencia: "Fortitude reduz à metade",
    descricao: "Espirais de trevas envolvem sua mão e definham o alvo, que sofre 2d8+2 pontos de dano de Morte.",
    formas: {
      discente: { custo: "+2 PE", descricao: "Muda a resistência para 'nenhuma' e o dano para 3d8+3. Como parte da execução, você faz um ataque corpo a corpo. Se acertar, causa dano da arma e do ritual somados." },
      verdadeiro: { custo: "+5 PE", descricao: "Muda o alcance para 'pessoal', o alvo para 'área: explosão com 6m de raio' e o dano para 8d8+8. Requer 3º círculo." }
    }
  },
  {
    id: 1015,
    nome: "Definhar",
    elemento: "Morte",
    circulo: 1,
    custo: 1,
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 ser",
    duracao: "cena",
    resistencia: "Fortitude parcial",
    descricao: "Você dispara uma lufada de cinzas que drenam as forças do alvo. O alvo fica fatigado. Se passar no teste de resistência, fica vulnerável.",
    formas: {
      discente: { custo: "+2 PE", descricao: "Em vez do normal, o alvo fica exausto. Se passar na resistência, fica fatigado. Requer 2º círculo." },
      verdadeiro: { custo: "+5 PE", descricao: "Como discente, mas muda o alvo para 'até 5 seres'. Requer 3º círculo e afinidade com Morte." }
    }
  },

  // ── SANGUE 1 ──
  {
    id: 1016,
    nome: "Arma Atroz",
    elemento: "Sangue",
    circulo: 1,
    custo: 1,
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 arma corpo a corpo",
    duracao: "sustentada",
    resistencia: null,
    descricao: "A arma é recoberta por veias carmesim e passa a exalar uma aura de violência. Ela fornece +2 em testes de ataque e +1 na margem de ameaça.",
    formas: {
      discente: { custo: "+2 PE", descricao: "Muda o bônus para +5 em testes de ataque. Requer 2º círculo." },
      verdadeiro: { custo: "+5 PE", descricao: "Muda o bônus para +5 em testes de ataque e +2 na margem de ameaça e no multiplicador de crítico. Requer 3º círculo e afinidade." }
    }
  },
  {
    id: 1017,
    nome: "Armadura de Sangue",
    elemento: "Sangue",
    circulo: 1,
    custo: 1,
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "cena",
    resistencia: null,
    descricao: "Seu sangue escorre para fora do corpo, cobrindo-o sob a forma de uma carapaça que fornece +5 em Defesa. Esse bônus é cumulativo com outros rituais, mas não com bônus fornecido por equipamento.",
    formas: {
      discente: { custo: "+5 PE", descricao: "Fornece +10 na Defesa e resistência a balístico, corte, impacto e perfuração 5. Requer 3º círculo." },
      verdadeiro: { custo: "+9 PE", descricao: "Fornece +15 na Defesa e resistência a balístico, corte, impacto e perfuração 10. Requer 4º círculo e afinidade." }
    }
  },
  {
    id: 1018,
    nome: "Corpo Adaptado",
    elemento: "Sangue",
    circulo: 1,
    custo: 1,
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 pessoa ou animal",
    duracao: "cena",
    resistencia: null,
    descricao: "Este ritual modifica a biologia do alvo para permitir a sobrevivência em ambientes hostis. O alvo fica imune a calor e frio extremos, pode respirar na água e não sufoca em fumaça densa.",
    formas: {
      discente: { custo: "+2 PE", descricao: "Muda a duração para 1 dia." },
      verdadeiro: { custo: "+5 PE", descricao: "Muda o alcance para 'curto' e o alvo para 'pessoas ou animais escolhidos'." }
    }
  },
  {
    id: 1019,
    nome: "Distorcer Aparência",
    elemento: "Sangue",
    circulo: 1,
    custo: 1,
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "cena",
    resistencia: "Vontade desacredita",
    descricao: "Você modifica sua aparência de modo a parecer outra pessoa. Isso inclui altura, peso, tom de pele, cor de cabelo, timbre de voz, etc. Você recebe +10 em testes de Enganação para disfarce.",
    formas: {
      discente: { custo: "+2 PE", descricao: "Muda o alcance para 'curto' e o alvo para '1 ser'. Um alvo involuntário pode anular com teste de Vontade." },
      verdadeiro: { custo: "+5 PE", descricao: "Como Discente, mas muda o alvo para 'seres escolhidos'. Requer 3º círculo." }
    }
  },
  {
    id: 1020,
    nome: "Fortalecimento Sensorial",
    elemento: "Sangue",
    circulo: 1,
    custo: 1,
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "cena",
    resistencia: null,
    descricao: "Você potencializa seus sentidos, recebendo bônus em Investigação, Luta, Percepção e Pontaria.",
    formas: {
      discente: { custo: "+2 PE", descricao: "Além do normal, seus inimigos sofrem penalidade em testes de ataque contra você. Requer 2º círculo." },
      verdadeiro: { custo: "+5 PE", descricao: "Além do normal, você fica imune às condições surpreendido e desprevenido e recebe +10 em Defesa e Reflexos. Requer 4º círculo e afinidade." }
    }
  },

  // ── MEDO 1 ──
  {
    id: 1021,
    nome: "Cinerária",
    elemento: "Medo",
    circulo: 1,
    custo: 1,
    execucao: "padrão",
    alcance: "curto",
    alvo: "área: nuvem de 6m de raio",
    duracao: "cena",
    resistencia: null,
    descricao: "Você manifesta uma névoa carregada de essência paranormal. Rituais conjurados dentro da névoa têm sua DT aumentada em +5.",
    formas: {
      discente: { custo: "+2 PE", descricao: "Além do normal, rituais conjurados dentro da névoa custam –2 PE." },
      verdadeiro: { custo: "+5 PE", descricao: "Além do normal, rituais conjurados dentro da névoa causam dano maximizado." }
    }
  },

  // ═══════════ 2º CÍRCULO ═══════════

  // ── CONHECIMENTO 2 ──
  {
    id: 2001,
    nome: "Aprimorar Mente",
    elemento: "Conhecimento",
    circulo: 2,
    custo: 3,
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 ser",
    duracao: "cena",
    resistencia: null,
    descricao: "O alvo tem sua mente energizada por fagulhos do Conhecimento. Ele recebe +1 em Intelecto ou Presença, à escolha dele.",
    formas: {
      discente: { custo: "+3 PE", descricao: "Muda o bônus para +2. Requer 3º círculo." },
      verdadeiro: { custo: "+7 PE", descricao: "Muda o bônus para +3. Requer 4º círculo e afinidade." }
    }
  },
  {
    id: 2002,
    nome: "Detecção de Ameaças",
    elemento: "Conhecimento",
    circulo: 2,
    custo: 3,
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "área: esfera de 18m de raio",
    duracao: "cena",
    resistencia: null,
    descricao: "Você recebe uma percepção aguçada sobre perigos à sua volta. Quando um ser hostil ou armadilha entra na área, você sente perigo e pode gastar uma ação de movimento para fazer um teste de Percepção (DT 20).",
    formas: {
      discente: { custo: "+3 PE", descricao: "Além do normal, você não fica desprevenido contra perigos detectados e recebe +5 em testes de resistência contra armadilhas. Requer 3º círculo." },
      verdadeiro: null
    }
  },
  {
    id: 2003,
    nome: "Esconder dos Olhos",
    elemento: "Conhecimento",
    circulo: 2,
    custo: 3,
    execucao: "livre",
    alcance: "pessoal",
    alvo: "você",
    duracao: "1 rodada",
    resistencia: null,
    descricao: "Você fica invisível, incluindo seu equipamento, recebendo camuflagem total e +15 em testes de Furtividade. O efeito termina se você faz um ataque ou usa uma habilidade hostil.",
    formas: {
      discente: { custo: "+3 PE", descricao: "Muda a duração para 'sustentada'. Gera uma esfera de invisibilidade para você e aliados a até 3m. Requer 3º círculo." },
      verdadeiro: { custo: "+7 PE", descricao: "Muda a execução para 'ação padrão', o alcance para 'toque', o alvo para '1 ser' e a duração para 'sustentada'. O efeito não é dissipado por ataque. Requer 4º círculo e afinidade." }
    }
  },
  {
    id: 2004,
    nome: "Invadir Mente",
    elemento: "Conhecimento",
    circulo: 2,
    custo: 3,
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 ser",
    duracao: "instantânea",
    resistencia: "Vontade parcial",
    descricao: "Você gera uma rajada mental contra o alvo ou se conecta telepaticamente.",
    formas: null
  },
  {
    id: 2005,
    nome: "Localização",
    elemento: "Conhecimento",
    circulo: 2,
    custo: 3,
    execucao: "padrão",
    alcance: "ilimitado",
    alvo: "1 ser ou objeto",
    duracao: "cena",
    resistencia: null,
    descricao: "Você determina em que direção está um objeto ou ser a sua escolha, desde que já tenha estado em contato com ele anteriormente.",
    formas: null
  },

  // ── ENERGIA 2 ──
  {
    id: 2006,
    nome: "Chamas do Caos",
    elemento: "Energia",
    circulo: 2,
    custo: 3,
    execucao: "padrão",
    alcance: "curto",
    alvo: "veja texto",
    duracao: "cena",
    resistencia: null,
    descricao: "Você manipula o calor e o fogo. Ao conjurar o ritual, escolha um dos seguintes efeitos.",
    modos: [
      { nome: "Chamejar", descricao: "O alvo é uma arma corpo a corpo. Ela causa +1d6 pontos de dano de fogo." },
      { nome: "Esquentar", descricao: "O alvo é um objeto, que começa a esquentar. Ele sofre 1d6 pontos de dano de fogo por rodada e causa o mesmo dano a quem o esteja empunhando." },
      { nome: "Extinguir", descricao: "O alvo é uma chama de tamanho Grande ou menor, que é apagada. Cria nuvem de fumaça com 3m de raio (camuflagem leve)." },
      { nome: "Modelar", descricao: "O alvo é uma chama de tamanho Grande ou menor. A cada rodada, você pode movê-la 9m. Se atravessar um ser, causa 3d6 pontos de dano de fogo." }
    ],
    formas: {
      discente: { custo: "+3 PE", descricao: "Muda a duração para sustentada. Uma vez por rodada você pode gastar uma ação de movimento para projetar uma labareda (4d6 dano de Energia, Reflexos reduz à metade)." },
      verdadeiro: { custo: "+7 PE", descricao: "Como discente, mas muda o dano para 8d6. Requer 3º círculo." }
    }
  },
  {
    id: 2007,
    nome: "Contenção Fantasmagórica",
    elemento: "Energia",
    circulo: 2,
    custo: 3,
    execucao: "padrão",
    alcance: "médio",
    alvo: "1 ser",
    duracao: "cena",
    resistencia: "Reflexos anula",
    descricao: "Três laços de Energia surgem do chão e se enroscam no alvo, deixando-o agarrado. O alvo pode tentar se livrar com teste de Atletismo (DT do ritual). Cada laço tem Defesa 10, 10 PV, RD 5 e imunidade a Energia.",
    formas: {
      discente: { custo: "+3 PE", descricao: "Aumenta para 6 laços, podendo dividir entre alvos (mínimo 2 por alvo). Requer 3º círculo." },
      verdadeiro: { custo: "+5 PE", descricao: "Como discente, e cada laço destruído libera uma onda de choque que causa 2d6+2 de dano de Energia no alvo. Requer 3º círculo e afinidade." }
    }
  },
  {
    id: 2008,
    nome: "Dissonância Acústica",
    elemento: "Energia",
    circulo: 2,
    custo: 3,
    execucao: "padrão",
    alcance: "médio",
    alvo: "área: esfera com 6m de raio",
    duracao: "sustentada",
    resistencia: null,
    descricao: "Você manipula a vibração do ar, criando uma área de dissonância sonora. Todos os seres na área ficam surdos e não podem conjurar rituais.",
    formas: {
      discente: { custo: "+1 PE", descricao: "Muda a área para 'alvo: 1 objeto'. O alvo emana área de silêncio com 3m de raio." },
      verdadeiro: { custo: "+3 PE", descricao: "Muda a duração para cena. Nenhum som pode deixar a área, mas seres dentro podem falar, ouvir e conjurar normalmente. Requer 3º círculo." }
    }
  },

  // ── MORTE 2 ──
  {
    id: 2009,
    nome: "Consumir Manancial",
    elemento: "Morte",
    circulo: 2,
    custo: 3,
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "instantânea",
    resistencia: null,
    descricao: "Você suga uma pequena porção do tempo de vida de plantas, insetos e até mesmo do solo ao redor, recebendo 3d6 pontos de vida temporários até o final da cena.",
    formas: {
      discente: { custo: "+2 PE", descricao: "Muda os PV temporários recebidos para 6d6. Requer 2º círculo." },
      verdadeiro: { custo: "+5 PE", descricao: "Muda o alvo para 'área: esfera com 6m de raio' e a resistência para 'Fortitude reduz à metade'. Causa 3d6 dano de Morte em cada ser e recebe PV temporários iguais ao dano total. Requer 3º círculo e afinidade." }
    }
  },
  {
    id: 2010,
    nome: "Eco Espiral",
    elemento: "Morte",
    circulo: 2,
    custo: 3,
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 ser",
    duracao: "cena",
    resistencia: "Fortitude parcial",
    descricao: "Você manifesta em suas mãos uma cópia do alvo feita de cinzas. No turno seguinte, concentre-se com ação padrão. No segundo turno, descarregue: a cópia explode e o alvo sofre dano de Morte igual ao dano que sofreu na rodada de concentração (Fortitude reduz à metade).",
    formas: {
      discente: { custo: "+3 PE", descricao: "Muda o alvo para 'até 5 seres'." },
      verdadeiro: { custo: "+7 PE", descricao: "Muda a duração para 'até 3 rodadas', permitindo 2 rodadas de concentração. Requer 4º círculo e afinidade." }
    }
  },

  // ── SANGUE 2 ──
  {
    id: 2011,
    nome: "Aprimorar Físico",
    elemento: "Sangue",
    circulo: 2,
    custo: 3,
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 ser",
    duracao: "cena",
    resistencia: null,
    descricao: "O alvo tem seus músculos tonificados e ligamentos reforçados, recebendo +1 em Agilidade ou Força, à escolha dele.",
    formas: {
      discente: { custo: "+3 PE", descricao: "Muda o bônus para +2. Requer 3º círculo." },
      verdadeiro: { custo: "+7 PE", descricao: "Muda o bônus para +3. Requer 4º círculo e afinidade." }
    }
  },
  {
    id: 2012,
    nome: "Flagelo de Sangue",
    elemento: "Sangue",
    circulo: 2,
    custo: 3,
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 pessoa",
    duracao: "cena",
    resistencia: "Fortitude parcial",
    descricao: "Você toca uma pessoa, gravando uma marca escarificada no corpo dela enquanto profere uma ordem. A cada rodada que o alvo desobedecer, a marca causa 10d6 pontos de dano de Sangue e deixa o alvo enjoado (Fortitude reduz à metade e evita a condição).",
    formas: {
      discente: { custo: "+3 PE", descricao: "Muda o alvo para '1 ser (exceto criaturas de Sangue)'. Requer 3º círculo." },
      verdadeiro: { custo: "+7 PE", descricao: "Como Discente, e muda a duração para '1 dia'. Requer 4º círculo e afinidade." }
    }
  },
  {
    id: 2013,
    nome: "Hemofagia",
    elemento: "Sangue",
    circulo: 2,
    custo: 3,
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 ser",
    duracao: "instantânea",
    resistencia: "Fortitude reduz à metade",
    descricao: "Você arranca o sangue do corpo do alvo através da pele dele, causando 6d6 pontos de dano de Sangue. Você então absorve esse sangue, recuperando PV iguais à metade do dano causado.",
    formas: {
      discente: { custo: "+3 PE", descricao: "Muda a resistência para 'nenhuma'. Como parte da execução, faz um ataque corpo a corpo. Se acertar, causa dano da arma e do ritual, recuperando PV iguais à metade do dano total." },
      verdadeiro: { custo: "+7 PE", descricao: "Muda o alcance para 'pessoal', alvo para 'você' e duração para 'cena'. A cada rodada, toque 1 ser e cause 4d6 dano de Sangue. Recupera PV iguais à metade. Requer 4º círculo." }
    }
  },

  // ═══════════ 3º CÍRCULO ═══════════

  // ── CONHECIMENTO 3 ──
  {
    id: 3001,
    nome: "Alterar Memória",
    elemento: "Conhecimento",
    circulo: 3,
    custo: 6,
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 pessoa",
    duracao: "instantânea",
    resistencia: null,
    descricao: "Você invade a mente do alvo e altera ou apaga suas memórias de até uma hora atrás. Se escolher alterar, você pode mudar detalhes de eventos recentes. O alvo recupera suas memórias após 1d4 dias.",
    formas: {
      discente: null,
      verdadeiro: { custo: "+4 PE", descricao: "Você pode alterar ou apagar memórias de até 24 horas atrás. Requer 4º círculo." }
    }
  },
  {
    id: 3002,
    nome: "Contato Paranormal",
    elemento: "Conhecimento",
    circulo: 3,
    custo: 6,
    execucao: "completa",
    alcance: "pessoal",
    alvo: "você",
    duracao: "1 dia",
    resistencia: null,
    descricao: "Você barganha com a entidade de Conhecimento. Recebe seis d6. Sempre que fizer um teste de perícia, pode gastar um d6, rolá-lo e adicionar ao teste. Porém, ao rolar 6, a entidade toma 2 pontos de Sanidade.",
    formas: {
      discente: { custo: "+4 PE", descricao: "Muda os dados para d8. Rolar 8 toma 3 pontos de Sanidade. Requer 4º círculo." },
      verdadeiro: { custo: "+9 PE", descricao: "Muda os dados para d12. Rolar 12 toma 5 pontos de Sanidade. Requer 4º círculo e afinidade." }
    }
  },
  {
    id: 3003,
    nome: "Mergulho Mental",
    elemento: "Conhecimento",
    circulo: 3,
    custo: 6,
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 pessoa",
    duracao: "sustentada",
    resistencia: "Vontade parcial",
    descricao: "Você se infiltra na mente do alvo para vasculhar seus pensamentos e memórias.",
    formas: null
  },
  {
    id: 3004,
    nome: "Vidência",
    elemento: "Conhecimento",
    circulo: 3,
    custo: 6,
    execucao: "completa",
    alcance: "ilimitado",
    alvo: "1 ser ou local",
    duracao: "sustentada",
    resistencia: null,
    descricao: "Você pode observar e ouvir um alvo à distância, como se estivesse presente no local.",
    formas: null
  },

  // ── ENERGIA 3 ──
  {
    id: 3005,
    nome: "Convocação Instantânea",
    elemento: "Energia",
    circulo: 3,
    custo: 6,
    execucao: "padrão",
    alcance: "ilimitado",
    alvo: "1 objeto de até 2 espaços",
    duracao: "instantânea",
    resistencia: "Vontade anula",
    descricao: "Você invoca um objeto previamente preparado com o símbolo do ritual para sua mão. Se o objeto estiver sendo empunhado, o portador pode fazer teste de Vontade.",
    formas: {
      discente: { custo: "+4 PE", descricao: "Muda o alvo para um objeto de até 10 espaços." },
      verdadeiro: { custo: "+9 PE", descricao: "Muda o alvo para '1 recipiente Médio, com itens que somem até 10 espaços' e a duração para 'permanente'. Encanta o recipiente para mantê-lo escondido no Outro Lado. Perde 1 PE permanentemente." }
    }
  },
  {
    id: 3006,
    nome: "Salto Fantasma",
    elemento: "Energia",
    circulo: 3,
    custo: 6,
    execucao: "padrão",
    alcance: "curto",
    alvo: "você e até 5 seres",
    duracao: "instantânea",
    resistencia: null,
    descricao: "Teletransporta você e outros seres para um ponto dentro do alcance que você possa ver.",
    formas: null
  },
  {
    id: 3007,
    nome: "Transfigurar Água",
    elemento: "Energia",
    circulo: 3,
    custo: 6,
    execucao: "padrão",
    alcance: "médio",
    alvo: "veja texto",
    duracao: "cena",
    resistencia: null,
    descricao: "Água e gelo se comportam de forma caótica conforme sua vontade.",
    formas: null
  },
  {
    id: 3008,
    nome: "Transfigurar Terra",
    elemento: "Energia",
    circulo: 3,
    custo: 6,
    execucao: "padrão",
    alcance: "médio",
    alvo: "veja texto",
    duracao: "cena",
    resistencia: null,
    descricao: "Rochas, lama e areia se comportam de forma caótica conforme sua vontade.",
    formas: null
  },

  // ── MORTE 3 ──
  {
    id: 3009,
    nome: "Âncora Temporal",
    elemento: "Morte",
    circulo: 3,
    custo: 6,
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 ser",
    duracao: "cena",
    resistencia: "Vontade parcial",
    descricao: "Uma aura espiralada surge sobre o alvo. No início de cada turno dele, deve fazer teste de Vontade. Se falhar, não pode se deslocar naquele turno. Se passar dois turnos seguidos, o efeito termina.",
    formas: {
      discente: null,
      verdadeiro: { custo: "+4 PE", descricao: "Muda o alvo para 'seres a sua escolha'. Requer 4º círculo." }
    }
  },
  {
    id: 3010,
    nome: "Poeira da Podridão",
    elemento: "Morte",
    circulo: 3,
    custo: 6,
    execucao: "padrão",
    alcance: "médio",
    alvo: "área: nuvem de 6m de raio",
    duracao: "cena",
    resistencia: "Fortitude parcial",
    descricao: "Nuvem de poeira apodrece tudo que toca. Seres na área sofrem dano de Morte a cada rodada.",
    formas: null
  },
  {
    id: 3011,
    nome: "Tentáculos de Lodo",
    elemento: "Morte",
    circulo: 3,
    custo: 6,
    execucao: "padrão",
    alcance: "médio",
    alvo: "área: quadrado de 9m",
    duracao: "cena",
    resistencia: null,
    descricao: "Tentáculos pretos emergem do chão e atacam e agarram seres na área.",
    formas: null
  },
  {
    id: 3012,
    nome: "Zerar Entropia",
    elemento: "Morte",
    circulo: 3,
    custo: 6,
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 ser",
    duracao: "cena",
    resistencia: "Fortitude parcial",
    descricao: "O alvo fica lento ou paralisado conforme o resultado do teste de resistência.",
    formas: null
  },

  // ── SANGUE 3 ──
  {
    id: 3013,
    nome: "Ferver Sangue",
    elemento: "Sangue",
    circulo: 3,
    custo: 6,
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 ser",
    duracao: "sustentada",
    resistencia: "Fortitude parcial",
    descricao: "O sangue do alvo aquece até entrar em ebulição. No início de cada turno do alvo, deve fazer teste de Fortitude. Se falhar, sofre 4d8 de dano de Sangue e fica fraco; se passar, metade do dano. Se passar dois turnos seguidos, o efeito termina.",
    formas: {
      discente: null,
      verdadeiro: { custo: "+4 PE", descricao: "Muda o alvo para 'seres escolhidos'. Requer 4º círculo e afinidade." }
    }
  },
  {
    id: 3014,
    nome: "Forma Monstruosa",
    elemento: "Sangue",
    circulo: 3,
    custo: 6,
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "cena",
    resistencia: null,
    descricao: "Seu corpo se transforma em uma criatura de Sangue. Tamanho muda para Grande, +5 em testes de ataque e dano corpo a corpo e 30 PV temporários. Enquanto transformado, fúria selvagem: não pode falar/conjurar e deve atacar o ser mais próximo.",
    formas: {
      discente: { custo: "+3 PE", descricao: "Além do normal, recebe imunidade a atordoamento, fadiga, sangramento, sono e veneno." },
      verdadeiro: { custo: "+9 PE", descricao: "Muda os bônus em testes de ataque e dano para +10 e os PV temporários para 50. Requer 4º círculo e afinidade." }
    }
  },
  {
    id: 3015,
    nome: "Purgatório",
    elemento: "Sangue",
    circulo: 3,
    custo: 6,
    execucao: "padrão",
    alcance: "médio",
    alvo: "área de sangue",
    duracao: "cena",
    resistencia: null,
    descricao: "Área de sangue deixa alvos vulneráveis a dano e causa dor a quem tentar sair.",
    formas: null
  },

  // ═══════════ 4º CÍRCULO ═══════════

  // ── CONHECIMENTO 4 ──
  {
    id: 4001,
    nome: "Controle Mental",
    elemento: "Conhecimento",
    circulo: 4,
    custo: 10,
    execucao: "padrão",
    alcance: "médio",
    alvo: "1 pessoa ou animal",
    duracao: "sustentada",
    resistencia: "Vontade parcial",
    descricao: "Você domina a mente do alvo, que obedece todos os seus comandos, exceto ordens suicidas. Alvos que passarem no teste ficam pasmos por 1 rodada.",
    formas: {
      discente: { custo: "+5 PE", descricao: "Muda o alvo para até cinco pessoas ou animais." },
      verdadeiro: { custo: "+10 PE", descricao: "Muda o alvo para até dez pessoas ou animais. Requer afinidade com Conhecimento." }
    }
  },

  // ── ENERGIA 4 ──
  {
    id: 4002,
    nome: "Destruição",
    elemento: "Energia",
    circulo: 4,
    custo: 10,
    execucao: "completa",
    alcance: "pessoal",
    alvo: "área: explosão de 15m de raio",
    duracao: "instantânea",
    resistencia: "Fortitude parcial",
    descricao: "Você acumula uma quantidade imensa de Energia e libera em uma explosão intensa. Todos na área sofrem 3d10 x 10 pontos de dano de Energia e todos os itens tecnológicos param de funcionar.",
    formas: {
      discente: { custo: "+5 PE", descricao: "Muda a duração para '5 rodadas' e o efeito para que você não seja afetado. Requer afinidade." },
      verdadeiro: null
    }
  },

  // ── MORTE 4 ──
  {
    id: 4003,
    nome: "Convocar o Algoz",
    elemento: "Morte",
    circulo: 4,
    custo: 10,
    execucao: "padrão",
    alcance: "1,5m",
    alvo: "1 pessoa",
    duracao: "sustentada",
    resistencia: "Vontade parcial, Fortitude parcial",
    descricao: "Usando os medos subconscientes do alvo, você cria uma imagem daquilo que ele mais teme. O algoz flutua 12m por turno em direção à vítima. Se terminar adjacente, o alvo deve fazer teste de Fortitude ou fica com 0 PV.",
    formas: {
      discente: null,
      verdadeiro: { custo: "+4 PE", descricao: "Muda o alvo para 'seres escolhidos'. O algoz persegue implacavelmente, é incorpóreo e imune a dano." }
    }
  },
  {
    id: 4004,
    nome: "Distorção Temporal",
    elemento: "Morte",
    circulo: 4,
    custo: 10,
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "veja texto",
    duracao: "3 rodadas",
    resistencia: null,
    descricao: "Este ritual distorce o fluxo de tempo em relação a você, criando um pequeno bolsão temporal de 3 rodadas. Você pode agir, mas não pode se deslocar nem interagir com seres e objetos.",
    formas: null
  },
  {
    id: 4005,
    nome: "Fim Inevitável",
    elemento: "Morte",
    circulo: 4,
    custo: 10,
    execucao: "completa",
    alcance: "extremo",
    alvo: "efeito: buraco negro com 1,5m de diâmetro",
    duracao: "4 rodadas",
    resistencia: "Fortitude parcial",
    descricao: "Você cria um vácuo. Em cada um dos seus 4 turnos seguintes, todos os seres a até 90m devem fazer teste de Fortitude. Se falharem, ficam caídos e são puxados 30m na direção do vácuo.",
    formas: null
  },

  // ── SANGUE 4 ──
  {
    id: 4006,
    nome: "Capturar o Coração",
    elemento: "Sangue",
    circulo: 4,
    custo: 10,
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 pessoa",
    duracao: "cena",
    resistencia: "Vontade parcial",
    descricao: "Você desperta uma paixão doentia e obcecada por você no alvo. No início de cada turno, o alvo deve fazer teste de Vontade. Se falhar, age para ajudá-lo. Se passar dois turnos seguidos, o efeito termina.",
    formas: null
  },
  {
    id: 4007,
    nome: "Invólucro de Carne",
    elemento: "Sangue",
    circulo: 4,
    custo: 10,
    execucao: "completa",
    alcance: "toque",
    alvo: "1 ser",
    duracao: "permanente",
    resistencia: null,
    descricao: "Cria um clone de carne e sangue com as mesmas estatísticas do alvo.",
    formas: null
  },
  {
    id: 4008,
    nome: "Vínculo de Sangue",
    elemento: "Sangue",
    circulo: 4,
    custo: 10,
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 ser",
    duracao: "cena",
    resistencia: "Fortitude anula",
    descricao: "O alvo sofre todo dano que você sofrer durante a duração do ritual.",
    formas: null
  },

  // ── MEDO 4 ──
  {
    id: 4009,
    nome: "Canalizar o Medo",
    elemento: "Medo",
    circulo: 4,
    custo: 10,
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 pessoa",
    duracao: "permanente até ser descarregada",
    resistencia: null,
    descricao: "Você transfere parte de seu poder para outra pessoa. Escolha um ritual de até 3º círculo que você conheça; o alvo pode conjurá-lo em forma básica uma vez, sem pagar PE. Até ser conjurado, seus PE máximos diminuem em valor igual ao custo.",
    formas: null
  },
  {
    id: 4010,
    nome: "Conhecendo o Medo",
    elemento: "Medo",
    circulo: 4,
    custo: 10,
    execucao: "padrão",
    alcance: "toque",
    alvo: "1 pessoa",
    duracao: "instantânea",
    resistencia: "Vontade parcial",
    descricao: "Você manifesta medo absoluto na mente do alvo. Se falhar no teste, Sanidade é reduzida a 0 e fica enlouquecendo. Se passar, sofre 10d6 de dano mental e fica apavorado por 1 rodada.",
    formas: null
  },
  {
    id: 4011,
    nome: "Lâmina do Medo",
    elemento: "Medo",
    circulo: 4,
    custo: 10,
    execucao: "padrão",
    alcance: "curto",
    alvo: "1 ser",
    duracao: "instantânea",
    resistencia: "Vontade parcial",
    descricao: "Golpeia o alvo com uma lâmina de medo puro, causando dano massivo.",
    formas: null
  },
  {
    id: 4012,
    nome: "Medo Tangível",
    elemento: "Medo",
    circulo: 4,
    custo: 10,
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "cena",
    resistencia: null,
    descricao: "Você recebe uma série de imunidades derivadas de seu domínio sobre o Medo.",
    formas: null
  },
  {
    id: 4013,
    nome: "Presença do Medo",
    elemento: "Medo",
    circulo: 4,
    custo: 10,
    execucao: "padrão",
    alcance: "pessoal",
    alvo: "você",
    duracao: "cena",
    resistencia: null,
    descricao: "Você assume uma forma impossível dentro da Realidade, emanando o próprio Medo.",
    formas: null
  },

  // Ritual Dissipar (Elemento neutro)
  {
    id: 5001,
    nome: "Dissipar Ritual",
    elemento: "Conhecimento",
    circulo: 2,
    custo: 3,
    execucao: "padrão",
    alcance: "médio",
    alvo: "1 ser ou objeto, ou esfera com 3m de raio",
    duracao: "instantânea",
    resistencia: null,
    descricao: "Você dissipa rituais ativos. Faça um teste de Ocultismo; anula quaisquer rituais ativos com DT igual ou menor que o resultado. Pode dissipar itens amaldiçoados por um dia.",
    formas: null
  }
];

// Elementos e suas cores
const ELEMENTO_CORES = {
  "Conhecimento": { cor: "#60a5fa", icone: "🧠" },
  "Energia": { cor: "#fbbf24", icone: "⚡" },
  "Morte": { cor: "#a78bfa", icone: "💀" },
  "Sangue": { cor: "#f87171", icone: "🩸" },
  "Medo": { cor: "#6b7280", icone: "👁" }
};

function buscarRitualPorId(id) {
  return RITUAIS.find(r => r.id === id);
}
