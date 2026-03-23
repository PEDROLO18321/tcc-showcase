function calcularStatus(atributos, nex, classe, origem) {  // Adicione o parâmetro 'origem'
    let etapa = Math.max(1, nex / 5);

    // Se não houver classe selecionada, retorna tudo zerado
    if (!classe) {
        return {
            vida: { max: 0 },
            esforco: { max: 0 },
            sanidade: { max: 0 },
            determinacao: { max: 0 }
        };
    }

    // Limite especial do Sobrevivente
    if (classe === "sobrevivente") {
        etapa = Math.min(etapa, 5);
    }

    const vig = atributos.vigor || 0;
    const pre = atributos.presenca || 0;

    let status = {
        vida: { max: 0 },
        esforco: { max: 0 },
        sanidade: { max: 0 },
        determinacao: { max: 0 }
    };

    switch (classe) {

        case "combatente":
            status.vida.max =
                20 + vig + (etapa - 1) * (4 + vig);

            status.esforco.max =
                2 + pre + (etapa - 1) * (2 + pre);

            status.sanidade.max =
                12 + (etapa - 1) * 3;

            status.determinacao.max =
                6 + pre + (etapa - 1) * (3 + pre);
            break;

        case "especialista":
            status.vida.max =
                16 + vig + (etapa - 1) * (3 + vig);

            status.esforco.max =
                3 + pre + (etapa - 1) * (3 + pre);

            status.sanidade.max =
                16 + (etapa - 1) * 4;

            status.determinacao.max =
                8 + pre + (etapa - 1) * (4 + pre);
            break;

        case "ocultista":
            status.vida.max =
                12 + vig + (etapa - 1) * (2 + vig);

            status.esforco.max =
                4 + pre + (etapa - 1) * (4 + pre);

            status.sanidade.max =
                20 + (etapa - 1) * 5;

            status.determinacao.max =
                10 + pre + (etapa - 1) * (5 + pre);
            break;

        case "sobrevivente":
            status.vida.max =
                8 + vig + (etapa - 1) * 2;

            status.esforco.max =
                2 + pre + (etapa - 1) * 1;

            status.sanidade.max =
                8 + (etapa - 1) * 2;

            status.determinacao.max =
                4 + pre + (etapa - 1) * 2;
            break;
    }

    // Aplicar bônus passivo de origem: Calejado (Desgarrado)
    if (origem && origem === "desgarrado") {
        status.vida.max += Math.floor(nex / 5);  // +1 PV por 5% NEX (etapa)
    }

    // === NOVO: Bônus fixo do Mergulhador ===
    if (origem && origem === "mergulhador") {
        status.vida.max += 5;   // +5 PV fixo
    }

    // === BÔNUS DE PE MÁXIMO DO UNIVERSITÁRIO ===
    // +1 PE a cada 10% de NEX começando em 5% (5%, 15%, 25%... 95%)
    if (origem && origem === "universitario") {
        const extraPE = Math.floor((nex + 5) / 10);
        status.esforco.max += extraPE;
    }

    // Aplicar bônus passivo de origem: Cicatrizes Psicológicas (Vítima)
    if (origem && origem === "vitima") {
        status.sanidade.max += Math.floor(nex / 5);  // +1 Sanidade por cada 5% de NEX
    }

    return status;
}

/* =========================
   VALIDAÇÃO DOS STATUS
========================= */
function validarStatusAtual(e) {
    const tipo = e.target.id.replace("_atual", "");
    const max = Number(document.getElementById(`${tipo}_max`).value) || 0;

    if (e.target.value > max) e.target.value = max;
    if (e.target.value < 0) e.target.value = 0;
}