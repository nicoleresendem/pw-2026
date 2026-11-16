const formCadastro = document.getElementById('form-cadastro');

formCadastro.addEventListener('submit', function (e) {
    const senha = document.getElementById('campo-senha').value;
    const confirmarSenha = document.getElementById('campo-confirmar-senha').value;

    if (senha !== confirmarSenha) {
        e.preventDefault();
        alert('As senhas não coincidem! Verifique e tente novamente.');
    }
});