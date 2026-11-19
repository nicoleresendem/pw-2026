const botaoTema = document.getElementById('botao-claro-escuro');
const iconeTema = document.getElementById('icone-tema');

function aplicarTema(modoEscuro) {
    document.body.classList.toggle('modo-escuro', modoEscuro);

    if (iconeTema) {
        iconeTema.src = modoEscuro ? 'imgs/lua.webp' : 'imgs/sol.webp';
        iconeTema.alt = modoEscuro ? 'Ativar tema claro' : 'Ativar tema escuro';
    }

    if (botaoTema) {
        botaoTema.setAttribute('aria-label', modoEscuro ? 'Ativar tema claro' : 'Ativar tema escuro');
        botaoTema.setAttribute('aria-pressed', String(modoEscuro));
    }
}

aplicarTema(localStorage.getItem('modo-escuro') === 'ativo');

if (botaoTema) {
    botaoTema.addEventListener('click', function () {
        const ativarEscuro = !document.body.classList.contains('modo-escuro');
        aplicarTema(ativarEscuro);
        localStorage.setItem('modo-escuro', ativarEscuro ? 'ativo' : 'inativo');
    });
}