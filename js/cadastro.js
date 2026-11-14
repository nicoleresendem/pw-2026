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

const formCadastro = document.getElementById('form-cadastro');

formCadastro.addEventListener('submit', function (e) {
    const senha = document.getElementById('campo-senha').value;
    const confirmarSenha = document.getElementById('campo-confirmar-senha').value;

    if (senha !== confirmarSenha) {
        e.preventDefault(); 
        alert('As senhas não coincidem! Verifique e tente novamente.');
    }
});