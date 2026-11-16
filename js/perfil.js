const botaoEditar = document.querySelector('.botao-perfil');
const textoNome = document.querySelector('.card-perfil h3');
const textoBio = document.querySelector('.card-perfil p');

botaoEditar.addEventListener('click', function () {
    if (textoNome.isContentEditable) {
        textoNome.contentEditable = "false";
        textoBio.contentEditable = "false";
        botaoEditar.innerHTML = '<img src="imgs/lapis-editar-perfil.webp" alt="Icone"> Editar perfil';
    } else {
        textoNome.contentEditable = "true";
        textoBio.contentEditable = "true";
        textoNome.focus();
        botaoEditar.innerHTML = 'Salvar perfil';
    }
});

var dadosPosts = [];

async function loadData() {
    try {
        var response = await fetch('./data/perfil.json');
        if (!response.ok) {
            throw new Error("Erro ao carregar JSON: " + response.status);
        }

        var data = await response.json();

        document.getElementById("perfil-nome").innerText = data.usuario.nome;
        document.getElementById("perfil-bio").innerText = data.usuario.bio;
        document.getElementById("perfil-foto").setAttribute("src", data.usuario.foto);

        dadosPosts = data.posts;
        renderizarLista();

    } catch (err) {
        console.error(err);
    }
}

function renderizarLista() {
    var ul = document.getElementById("cards");
    ul.innerHTML = "";

    if (dadosPosts.length === 0) {
        document.getElementById("msg-lista-vazia").style.display = "block";
    } else {
        document.getElementById("msg-lista-vazia").style.display = "none";
        for (var i = 0; i < dadosPosts.length; i++) {
            addItemLista(dadosPosts[i], i);
        }
    }
}

function addItemLista(item, index) {
    var li = document.createElement("li");
    li.classList.add("card-posts");

    var headerPost = document.createElement("div");
    headerPost.classList.add("header-post");

    var titulo = document.createElement("h3");
    titulo.innerText = item.titulo;

    var btnRemover = document.createElement("button");
    btnRemover.innerHTML = '<img src="imgs/lixeira.webp" alt="Lixeira">';
    btnRemover.classList.add("btn-remover-post");
    btnRemover.addEventListener("click", function (e) {
        e.stopPropagation(); // Impede que clicar em "Excluir" abra a modal do post
        dadosPosts.splice(index, 1);
        renderizarLista();
    });

    headerPost.appendChild(titulo);
    headerPost.appendChild(btnRemover);

    var imgPost = document.createElement("img");
    imgPost.setAttribute("src", item.imagem);
    imgPost.setAttribute("alt", item.titulo);

    var resumo = document.createElement("p");
    resumo.innerText = item.resumo;

    li.appendChild(headerPost);
    li.appendChild(imgPost);
    li.appendChild(resumo);

    li.addEventListener("click", function () {
        abrirModal(item);
    });

    document.getElementById("cards").appendChild(li);
}

function abrirModal(item) {
    document.getElementById("modal-titulo").innerText = item.titulo;
    document.getElementById("modal-imagem").setAttribute("src", item.imagem);
    document.getElementById("modal-texto").innerText = item.conteudo;

    document.getElementById("modal-overlay").classList.remove("overlay-escondido");
    document.body.classList.add("sem-rolagem");
}

function fecharModal() {
    document.getElementById("modal-overlay").classList.add("overlay-escondido");
    document.body.classList.remove("sem-rolagem");
}

document.getElementById("fechar-modal").addEventListener("click", fecharModal);

document.getElementById("btn-novo-post").addEventListener("click", function () {
    document.getElementById("modal-cadastro-overlay").classList.remove("overlay-escondido");
    document.body.classList.add("sem-rolagem");
});

function fecharModalCadastro() {
    document.getElementById("modal-cadastro-overlay").classList.add("overlay-escondido");
    document.body.classList.remove("sem-rolagem");
}

document.getElementById("fechar-modal-cadastro").addEventListener("click", fecharModalCadastro);

document.getElementById("form-novo-post").addEventListener("submit", function (e) {
    e.preventDefault();

    var titulo = document.getElementById("novo-titulo").value;
    var conteudo = document.getElementById("novo-conteudo").value;
    var inputArquivo = document.getElementById("nova-imagem");
    var arquivo = inputArquivo.files[0]; // Pega o arquivo de imagem selecionado

    if (arquivo) {
        var leitor = new FileReader();

        leitor.onload = function (evento) {
            var imagemBase64 = evento.target.result;

            var novoPost = {
                titulo: titulo,
                imagem: imagemBase64,
                resumo: conteudo.substring(0, 90) + "...",
                conteudo: conteudo
            };

            dadosPosts.push(novoPost);
            renderizarLista();

            e.target.reset();
            fecharModalCadastro();
        };

        leitor.readAsDataURL(arquivo);
    }
});

loadData();