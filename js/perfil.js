const botao = document.getElementById('botao-claro-escuro');
const icone = document.getElementById('icone-tema');
const botaoEditar = document.querySelector('.botao-perfil');
const textoNome = document.querySelector('.card-perfil h3');
const textoBio = document.querySelector('.card-perfil p');

botao.addEventListener('click', function () {
    document.body.classList.toggle('modo-escuro');

    if (document.body.classList.contains('modo-escuro')) {
        icone.src = 'imgs/lua.png'; 
    } else {
        icone.src = 'imgs/sol.png';
    }
});

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