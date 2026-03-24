// ==================== itens-amaldicoados-data.js ====================
// Base de dados de maldições e itens amaldiçoados especiais do livro Ordem Paranormal

// Maldições aplicáveis a ARMAS (qualquer arma)
const MALDICOES_ARMAS = [
    // CONHECIMENTO
    {
        id: 'arma-antielemento',
        nome: 'Antielemento',
        elemento: 'Conhecimento',
        descricao: 'A arma é letal contra criaturas de um elemento. Quando ataca uma criatura desse elemento, você pode gastar 2 PE. Se acertar, causa +4d8 pontos de dano. Elemento determinado por 1d4: 1) Conhecimento; 2) Energia; 3) Morte; 4) Sangue.'
    },
    {
        id: 'arma-ritualistica',
        nome: 'Ritualística',
        elemento: 'Conhecimento',
        descricao: 'Você pode armazenar na arma um ritual que tenha como alvo um ser ou que afete uma área, gastando os PE normalmente. O ritual fica guardado e pode ser descarregado como ação livre ao acertar um ataque. O alvo do ritual é o ser atingido.'
    },
    {
        id: 'arma-senciente',
        nome: 'Senciente',
        elemento: 'Conhecimento',
        descricao: 'Gaste uma ação de movimento e 2 PE para imbuir a arma com consciência. Ela flutua e ataca um ser em alcance curto 1x por rodada. Gaste 1 PE por turno para manter. A arma usa suas mesmas estatísticas.'
    },
    // ENERGIA
    {
        id: 'arma-empuxo',
        nome: 'Empuxo',
        elemento: 'Energia',
        descricao: 'A arma corpo a corpo pode ser arremessada em alcance curto (ou tem alcance aumentado em uma categoria). Causa +1 dado de dano quando arremessada e volta voando para você no mesmo turno (reação para pegar).'
    },
    {
        id: 'arma-energetica',
        nome: 'Energética',
        elemento: 'Energia',
        descricao: 'Gaste 2 PE por ataque para transformar a arma/munição em Energia pura. Fornece +5 em testes de ataque, ignora resistência a dano e converte todo dano para Energia. Armas corpo a corpo emanam luz; munição toma forma plasmática.'
    },
    {
        id: 'arma-vibrante',
        nome: 'Vibrante',
        elemento: 'Energia',
        descricao: 'A arma vibra com Energia. Você recebe Ataque Extra (trilha operações especiais do combatente). Se já possui, o custo diminui em -1 PE.'
    },
    // MORTE
    {
        id: 'arma-consumidora',
        nome: 'Consumidora',
        elemento: 'Morte',
        descricao: 'A arma drena entropia. Alvos atingidos ficam lentos até o final da cena. Gaste 2 PE ao atacar: se acertar, o alvo fica imóvel por uma rodada.'
    },
    {
        id: 'arma-erosiva',
        nome: 'Erosiva',
        elemento: 'Morte',
        descricao: 'A arma acelera o envelhecimento, causando +1d8 de dano de Morte. Gaste 2 PE ao atacar: se acertar, a vítima sofre 2d4 de dano de Morte no início de seus turnos por 2 rodadas.'
    },
    // SANGUE
    {
        id: 'arma-sadica',
        nome: 'Sádica',
        elemento: 'Sangue',
        descricao: 'No início de seu turno, recebe +1 em ataques e dano para cada 10 pontos de dano sofridos desde o último turno. Ex: 45 de dano = +4 em ataques e dano.'
    },
    // MEDO
    {
        id: 'arma-medo',
        nome: 'Maldição de Medo',
        elemento: 'Medo',
        descricao: 'Cada item de Medo possui um preço específico determinado pelo mestre, que pode mudar de portador a portador.'
    }
];

// Maldições aplicáveis a PROTEÇÕES
const MALDICOES_PROTECOES = [
    // CONHECIMENTO
    {
        id: 'prot-abascanta',
        nome: 'Abascanta',
        elemento: 'Conhecimento',
        descricao: 'Recebe +5 em testes de resistência contra rituais. 1x por cena, ao ser alvo de ritual, gaste reação e PE igual ao custo para refleti-lo ao conjurador.'
    },
    {
        id: 'prot-profetica',
        nome: 'Profética',
        elemento: 'Conhecimento',
        descricao: 'Resistência a Conhecimento 10. Em testes de resistência, gaste 2 PE para rolar novamente.'
    },
    {
        id: 'prot-sombria',
        nome: 'Sombria',
        elemento: 'Conhecimento',
        descricao: 'Recebe +5 em Furtividade e ignora penalidade de carga. Gaste ação de movimento e 1 PE para fazer o item parecer roupa comum mantendo propriedades.'
    },
    // ENERGIA
    {
        id: 'prot-cinetica',
        nome: 'Cinética',
        elemento: 'Energia',
        descricao: 'Barreira invisível: +2 em Defesa e RD 2 (leve/escudo) ou RD 5 (pesada).'
    },
    {
        id: 'prot-lepida',
        nome: 'Lépida',
        elemento: 'Energia',
        descricao: '+10 em Atletismo e +3m de deslocamento. Gaste 2 PE para ignorar terreno difícil, ganhar escalada e ficar imune a queda de até 9m até fim do turno.'
    },
    {
        id: 'prot-voltaica',
        nome: 'Voltaica',
        elemento: 'Energia',
        descricao: 'Resistência a Energia 10. Gaste ação de movimento e 2 PE para emitir arcos de Energia até fim da cena: 2d6 de dano de Energia em adjacentes no fim de cada turno.'
    },
    // MORTE
    {
        id: 'prot-letargica',
        nome: 'Letárgica',
        elemento: 'Morte',
        descricao: '+2 em Defesa. 25% (leve/escudo) ou 50% (pesada) de chance de ignorar dano extra de críticos e ataques furtivos.'
    },
    {
        id: 'prot-repulsiva',
        nome: 'Repulsiva',
        elemento: 'Morte',
        descricao: 'Resistência a Morte 10. Gaste ação de movimento e 2 PE para cobrir-se de Lodo negro até fim da cena: quem atacar em corpo a corpo sofre 2d8 de Morte.'
    },
    // SANGUE
    {
        id: 'prot-regenerativa',
        nome: 'Regenerativa',
        elemento: 'Sangue',
        descricao: 'Resistência a Sangue 10. Gaste ação de movimento e 1 PE para recuperar 1d12 PV.'
    },
    // MEDO
    {
        id: 'prot-medo',
        nome: 'Maldição de Medo',
        elemento: 'Medo',
        descricao: 'Preço específico determinado pelo mestre.'
    }
];

// Maldições aplicáveis a ACESSÓRIOS (utensílios e vestimentas = equipamentos gerais)
const MALDICOES_ACESSORIOS = [
    // CONHECIMENTO
    {
        id: 'acess-carisma',
        nome: 'Carisma',
        elemento: 'Conhecimento',
        descricao: 'Aura carismática: +1 em Presença (não fornece PE adicionais).'
    },
    {
        id: 'acess-conjuracao',
        nome: 'Conjuração',
        elemento: 'Conhecimento',
        descricao: 'O acessório tem um ritual de 1º círculo. Empunhando, conjure como se conhecesse. Se já conhece, custo -1 PE.'
    },
    {
        id: 'acess-escudo-mental',
        nome: 'Escudo Mental',
        elemento: 'Conhecimento',
        descricao: 'Barreira psíquica: resistência mental 10.'
    },
    {
        id: 'acess-reflexao',
        nome: 'Reflexão',
        elemento: 'Conhecimento',
        descricao: '1x por rodada, ao ser alvo de ritual, gaste PE igual ao custo para refleti-lo ao conjurador.'
    },
    {
        id: 'acess-sagacidade',
        nome: 'Sagacidade',
        elemento: 'Conhecimento',
        descricao: 'Mente acelerada: +1 em Intelecto (não fornece perícias/graus extras).'
    },
    // ENERGIA
    {
        id: 'acess-defesa',
        nome: 'Defesa',
        elemento: 'Energia',
        descricao: 'Barreira de energia invisível: +5 de Defesa.'
    },
    {
        id: 'acess-destreza',
        nome: 'Destreza',
        elemento: 'Energia',
        descricao: 'Aprimora coordenação e velocidade: +1 em Agilidade.'
    },
    {
        id: 'acess-potencia',
        nome: 'Potência',
        elemento: 'Energia',
        descricao: 'Aumenta a DT contra suas habilidades, poderes e rituais em +1.'
    },
    // MORTE
    {
        id: 'acess-esforco-adicional',
        nome: 'Esforço Adicional',
        elemento: 'Morte',
        descricao: 'Fornece +5 PE. Efeito ativa após um dia de uso.'
    },
    // SANGUE
    {
        id: 'acess-disposicao',
        nome: 'Disposição',
        elemento: 'Sangue',
        descricao: 'Poder do Sangue: +1 em Vigor.'
    },
    // VARIA
    {
        id: 'acess-protecao-elemental',
        nome: 'Proteção Elemental',
        elemento: 'Varia',
        descricao: 'Resistência 10 contra um elemento. Conta como item do elemento contra o qual fornece resistência.'
    }
];

// Itens Especiais Amaldiçoados
const ITENS_AMALDICOADOS_ESPECIAIS = [
    // SANGUE
    {
        id: 'esp-perola-sangue',
        nome: 'Pérola de Sangue',
        elemento: 'Sangue',
        categoria: 'II',
        espacos: 1,
        descricao: 'Esfera vermelho-vivo de 2cm. Gaste ação de movimento para absorvê-la: +5 em testes de AGI, FOR e VIG até fim da cena. Depois, teste Fortitude (DT 20): falha = fatigado; falha por 5+ = morrendo.'
    },
    {
        id: 'esp-coracao-pulsante',
        nome: 'Coração Pulsante',
        elemento: 'Sangue',
        categoria: 'III',
        espacos: 1,
        descricao: 'Coração humano pulsante em Sangue. Ao sofrer dano empunhando-o, gaste reação para reduzir dano pela metade. Teste Fortitude (DT 15 + 5/uso): falha = item destruído. Deve ser drenado diariamente.'
    },
    {
        id: 'esp-coroa-espinhos',
        nome: 'Coroa de Espinhos',
        elemento: 'Sangue',
        categoria: 'II',
        espacos: 1,
        descricao: 'Coroa/colar/pulseira de espinhos em Sangue. 1x por rodada, use reação para converter dano mental em dano de Sangue. Não recupera sanidade por descanso. Precisa de 1 semana para ativar.'
    },
    {
        id: 'esp-frasco-vitalidade',
        nome: 'Frasco de Vitalidade',
        elemento: 'Sangue',
        categoria: 'II',
        espacos: 1,
        descricao: 'Frasco com selo de Sangue. Gaste 1 min e até 20 PV de dano para encher com seu sangue. Ação padrão para beber e recuperar os PV armazenados (Fortitude DT 20 para não ficar enjoado).'
    },
    {
        id: 'esp-punhos-enraivecidos',
        nome: 'Punhos Enraivecidos',
        elemento: 'Sangue',
        categoria: 'III',
        espacos: 1,
        descricao: 'Soqueiras de metal vermelho. Ataques desarmados causam +1d8 de Sangue (dano letal). Ao acertar, faça outro ataque pagando 2 PE por ataque extra já realizado no turno.'
    },
    {
        id: 'esp-seringa-transfiguracao',
        nome: 'Seringa de Transfiguração',
        elemento: 'Sangue',
        categoria: 'III',
        espacos: 1,
        descricao: 'Seringa orgânica com veias pulsantes. Ação padrão para sugar sangue de adjacente. Injetar em outra pessoa transfigura aparência (como Distorcer Aparência) por 1 dia. Em 1d6 resultado 1: perde 1 PV permanente.'
    },
    // MORTE
    {
        id: 'esp-amarras-mortais',
        nome: 'Amarras Mortais',
        elemento: 'Morte',
        categoria: 'II',
        espacos: 1,
        descricao: 'Correntes de ferro negro nos antebraços. 1x por rodada, ação padrão e 2 PE para manobra agarrar com +10 no teste. Ação de movimento para puxar alvo agarrado para adjacente.'
    },
    {
        id: 'esp-casaco-lodo',
        nome: 'Casaco de Lodo',
        elemento: 'Morte',
        categoria: 'III',
        espacos: 2,
        descricao: 'Sobretudo preto de Lodo ativo. RD 5 contra corte, impacto, Morte e perfuração. Vulnerabilidade a dano balístico e de Energia.'
    },
    {
        id: 'esp-coletora',
        nome: 'Coletora',
        elemento: 'Morte',
        categoria: 'III',
        espacos: 1,
        descricao: 'Punhal de lâmina negra. Ação completa para matar ser morrendo e absorver 1d8 PE (max 20 PE armazenados). Pesadelos constantes: descanso sempre ruim.'
    },
    {
        id: 'esp-cranio-espiral',
        nome: 'Crânio Espiral',
        elemento: 'Morte',
        categoria: 'IV',
        espacos: 1,
        descricao: 'Crânio distorcido com Lodo. 1x por rodada, ação livre para ganhar ação padrão adicional. Teste Vontade (DT 15 + 5/uso): falha = envelhece 1d4 anos e não pode mais usar no dia.'
    },
    {
        id: 'esp-lanterna-reveladora',
        nome: 'Lanterna Reveladora',
        elemento: 'Morte',
        categoria: 'II',
        espacos: 1,
        descricao: 'Lanterna dourada com sigilos. Ação padrão e 1 PE: emite luz com propriedades de Terceiro Olho por 1 cena. Incomoda criaturas de Sangue.'
    },
    {
        id: 'esp-frasco-lodo',
        nome: 'Frasco de Lodo',
        elemento: 'Morte',
        categoria: 'II',
        espacos: 1,
        descricao: 'Frasco com Lodo da Morte. Aplicar em ferida recente (1 rodada): cura 6d8+20 PV. Ferida antiga: par = 3d8+10 PV; ímpar = 3d8+10 dano de Morte. Uso único.'
    },
    {
        id: 'esp-mascara-sombras',
        nome: 'Máscara das Pessoas nas Sombras',
        elemento: 'Morte',
        categoria: 'III',
        espacos: 1,
        descricao: 'Ferramenta da Seita das Máscaras. Resistência a Conhecimento 10. Ação de movimento e 2 PE para teleportar entre sombras em alcance médio. Pode despertar interesse da mente única das Máscaras.'
    },
    // CONHECIMENTO
    {
        id: 'esp-municao-jurada',
        nome: 'Munição Jurada',
        elemento: 'Conhecimento',
        categoria: 'III',
        espacos: 1,
        descricao: 'Bala com sigilo gravado contra um ser específico. +10 no ataque, dobra margem de ameaça, +6d12 de Conhecimento. Impõe -2 em Defesa e ataques contra outros alvos.'
    },
    {
        id: 'esp-pergaminho-pertinacia',
        nome: 'Pergaminho da Pertinácia',
        elemento: 'Conhecimento',
        categoria: 'II',
        espacos: 1,
        descricao: 'Pergaminho com sigilos dourados. Ação padrão para ganhar 5 PE temporários até fim da cena. Teste Ocultismo (DT 15 + 5/uso): falha = pergaminho se desfaz.'
    },
    // ENERGIA
    {
        id: 'esp-peitoral-segunda-chance',
        nome: 'Peitoral da Segunda Chance',
        elemento: 'Energia',
        categoria: 'III',
        espacos: 1,
        descricao: 'Colete eletrônico. Se reduzido a 0 PV, gasta 5 PE seus para reanimar com 4d10 PV. 1 em 1d10 de chance de matá-lo instantaneamente (vira plasma).'
    },
    {
        id: 'esp-arcabuz-moretti',
        nome: 'Arcabuz dos Moretti',
        elemento: 'Energia',
        categoria: 'III',
        espacos: 1,
        descricao: 'Arma do séc. XV com rachaduras luminosas. Arma simples, fogo, uma mão. +2 no ataque, dano de Energia. Dano por 1d6: 1)2d4, 2)2d6, 3)2d8, 4)2d10, 5)2d12, 6)2d20. Alcance curto, crit x3, sem munição.'
    },
    {
        id: 'esp-talisma-sorte',
        nome: 'Talismã da Sorte',
        elemento: 'Energia',
        categoria: 'II',
        espacos: 1,
        descricao: 'Badulaque modificado por ritual. Ao sofrer dano, reação e 3 PE: role 1d4. 2-3 = evita dano. 4 = evita mas talismã vira cinzas. 1 = dobro do dano e talismã vira cinzas.'
    },
    {
        id: 'esp-bateria-reversa',
        nome: 'Bateria Reversa',
        elemento: 'Energia',
        categoria: 'II',
        espacos: 1,
        descricao: 'Bateria com sigilos. Ação padrão e 2 PE para absorver carga de dispositivo eletrônico em alcance curto. Cheia: ação padrão para transferir carga. Teste Ocultismo (DT 15 + 5/uso).'
    },
    {
        id: 'esp-teclado-conexao-neural',
        nome: 'Teclado de Conexão Neural',
        elemento: 'Energia',
        categoria: 'II',
        espacos: 1,
        descricao: 'Teclado USB com glifos de Energia. Ao plugar em computador (ação de movimento), conecta sua mente à máquina. Use sem impedimento tecnológico ou de idioma, +10 em testes relacionados.'
    },
    // VARIA
    {
        id: 'esp-dedo-decepado',
        nome: 'Dedo Decepado',
        elemento: 'Varia',
        categoria: 'II',
        espacos: 1,
        descricao: 'Dedo seco de alguém com alta exposição paranormal. Recebe um poder paranormal que o dono possuía. Elemento da maldição = elemento do poder.'
    },
    {
        id: 'esp-pesadelo',
        nome: 'Pesadelo',
        elemento: 'Medo',
        categoria: 'III',
        espacos: 1,
        descricao: 'Dispositivo com tela e sigilos. Ação padrão e 2 PE para ativar. Próxima pessoa que tocar faz Vontade (DT+5): falha = atordoada + 4d6 dano mental, repete até passar ou enlouquecer.'
    },
    {
        id: 'esp-veiculo-energizado',
        nome: 'Veículo Energizado',
        elemento: 'Energia',
        categoria: 'IV',
        espacos: 10,
        descricao: 'Motor modificado sem combustível. Motorista pode gastar reação + Pilotagem (DT 25) para assumir forma de energia pura por um instante e atravessar objetos.'
    },
    {
        id: 'esp-jaqueta-verissimo',
        nome: 'Jaqueta de Veríssimo',
        elemento: 'Medo',
        categoria: 'IV',
        espacos: 2,
        descricao: 'Jaqueta aviador histórica. RD paranormal 15. Quando aliado adjacente sofrer dano, reação e 2 PE para receber o dano no lugar. Item único, categoria IV.'
    }
];

// Mapeamento de elemento → cor/ícone (reuso do rituais)
const ELEMENTO_CORES_MALDICAO = {
    'Conhecimento': { cor: '#60a5fa', icone: '🧠' },
    'Energia':      { cor: '#fbbf24', icone: '⚡' },
    'Morte':        { cor: '#a78bfa', icone: '💀' },
    'Sangue':       { cor: '#f87171', icone: '🩸' },
    'Medo':         { cor: '#34d399', icone: '👁' },
    'Varia':        { cor: '#8a8aa0', icone: '✦' }
};

// Função para buscar maldições por tipo de item
function getMaldicoesPorTipo(tipo) {
    if (tipo === 'armas') return MALDICOES_ARMAS;
    if (tipo === 'protecoes') return MALDICOES_PROTECOES;
    if (tipo === 'equipamentosGerais') return MALDICOES_ACESSORIOS;
    return [];
}

function buscarItemEspecialPorId(id) {
    return ITENS_AMALDICOADOS_ESPECIAIS.find(i => i.id === id) || null;
}
