const botao = document.getElementById('botao-claro-escuro');

botao.addEventListener('click', function () {
    document.body.classList.toggle('modo-escuro');
});

const botaoEditar = document.querySelector('.botao-perfil');
const textoNome = document.querySelector('.card-perfil h3');
const textoBio = document.querySelector('.card-perfil p');

botaoEditar.addEventListener('click', function () {
    if (textoNome.isContentEditable) {
        textoNome.contentEditable = "false";
        textoBio.contentEditable = "false";
        botaoEditar.innerHTML = '<img src="imgs/lapis-editar-perfil.png" alt="Icone"> Editar perfil';
    } else {
        textoNome.contentEditable = "true";
        textoBio.contentEditable = "true";
        textoNome.focus();
        botaoEditar.innerHTML = 'Salvar perfil';
    }
});