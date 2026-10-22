const botao = document.getElementById('botao-claro-escuro');

botao.addEventListener('click', function () {
    document.body.classList.toggle('modo-escuro');
});