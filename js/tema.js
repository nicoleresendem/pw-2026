const botaoTema = document.getElementById('botao-claro-escuro');
const iconeTema = document.getElementById('icone-tema');

if (localStorage.getItem('modo-escuro') === 'ativo') {
    document.body.classList.add('modo-escuro');
    if (iconeTema) {
        iconeTema.src = 'imgs/lua.webp';
    }
}

if (botaoTema) {
    botaoTema.addEventListener('click', function () {
        document.body.classList.toggle('modo-escuro');

        if (document.body.classList.contains('modo-escuro')) {
            iconeTema.src = 'imgs/lua.webp';
            localStorage.setItem('modo-escuro', 'ativo');
        } else {
            iconeTema.src = 'imgs/sol.webp';
            localStorage.setItem('modo-escuro', 'inativo');
        }
    });
}
