function obterClasse() {
    const radioSelecionado = document.querySelector('input[name="classe"]:checked');
    return radioSelecionado ? radioSelecionado.value : "";
}