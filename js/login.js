const botao = document.getElementById('botao-claro-escuro');
const icone = document.getElementById('icone-tema');

botao.addEventListener('click', function () {
    document.body.classList.toggle('modo-escuro');

if (document.body.classList.contains('modo-escuro')) {
        icone.src = 'imgs/lua.png';
    } else {
        icone.src = 'imgs/sol.png';
    }
});