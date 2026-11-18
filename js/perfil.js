const botaoEditar = document.querySelector('.botao-perfil');
const textoNome = document.querySelector('.card-perfil h3');
const textoBio = document.querySelector('.card-perfil p');
const fotoPerfil = document.getElementById('perfil-foto');
const inputFotoPerfil = document.getElementById('input-foto-perfil');
const botaoSair = document.querySelector('.botao-sair');

var usuarioAtual = null;
var dadosPosts = [];

function salvarUsuarioNoStorage() {
    if (!usuarioAtual) return;
    usuarioAtual.posts = dadosPosts;
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtual));

    var usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    var idx = usuarios.findIndex(u => u.email === usuarioAtual.email);
    if (idx !== -1) {
        usuarios[idx] = usuarioAtual;
    } else {
        usuarios.push(usuarioAtual);
    }
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    var todosPostsUsuarios = [];
    usuarios.forEach(u => {
        if (Array.isArray(u.posts)) {
            todosPostsUsuarios = todosPostsUsuarios.concat(u.posts);
        }
    });
    localStorage.setItem("postsPerfil", JSON.stringify(todosPostsUsuarios));
}

botaoEditar.addEventListener('click', function () {
    if (textoNome.isContentEditable) {
        textoNome.contentEditable = "false";
        textoBio.contentEditable = "false";
        botaoEditar.innerHTML = '<img src="imgs/lapis-editar-perfil.webp" alt="Icone"> Editar perfil';

        if (usuarioAtual) {
            usuarioAtual.nome = textoNome.innerText.trim();
            usuarioAtual.bio = textoBio.innerText.trim();
            salvarUsuarioNoStorage();
        }
    } else {
        textoNome.contentEditable = "true";
        textoBio.contentEditable = "true";
        textoNome.focus();
        botaoEditar.innerHTML = 'Salvar perfil';
    }
});

fotoPerfil.addEventListener('click', function () {
    inputFotoPerfil.click();
});

inputFotoPerfil.addEventListener('change', function () {
    var arquivo = inputFotoPerfil.files[0];
    if (!arquivo) return;

    var leitor = new FileReader();
    leitor.onload = function (evento) {
        var fotoBase64 = evento.target.result;
        fotoPerfil.setAttribute("src", fotoBase64);
        if (usuarioAtual) {
            usuarioAtual.foto = fotoBase64;
            salvarUsuarioNoStorage();
        }
    };
    leitor.readAsDataURL(arquivo);
});

if (botaoSair) {
    botaoSair.addEventListener('click', function () {
        localStorage.removeItem("usuarioLogado");
    });
}

async function loadData() {
    try {
        var response = await fetch('./data/perfil.json');
        if (!response.ok) {
            throw new Error("Erro ao carregar JSON: " + response.status);
        }

        var data = await response.json();

        var usuariosSalvos = localStorage.getItem("usuarios");
        if (!usuariosSalvos) {
            var padrao = {
                nome: data.usuario.nome,
                email: data.usuario.email || "cristiano@email.com",
                senha: data.usuario.senha || "123",
                bio: data.usuario.bio,
                foto: data.usuario.foto,
                posts: data.posts || []
            };
            localStorage.setItem("usuarios", JSON.stringify([padrao]));
        }

        var logadoSalvo = localStorage.getItem("usuarioLogado");
        if (logadoSalvo) {
            usuarioAtual = JSON.parse(logadoSalvo);
        } else {
            var listaUsuarios = JSON.parse(localStorage.getItem("usuarios"));
            usuarioAtual = listaUsuarios[0];
            localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtual));
        }

        document.getElementById("perfil-nome").innerText = usuarioAtual.nome;
        document.getElementById("perfil-bio").innerText = usuarioAtual.bio;
        document.getElementById("perfil-foto").setAttribute("src", usuarioAtual.foto);

        dadosPosts = usuarioAtual.posts || [];
        salvarUsuarioNoStorage();
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
        e.stopPropagation();
        dadosPosts.splice(index, 1);
        salvarUsuarioNoStorage();
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
    var arquivo = inputArquivo.files[0];

    if (arquivo) {
        var leitor = new FileReader();

        leitor.onload = function (evento) {
            var imagemBase64 = evento.target.result;

            var novoPost = {
                titulo: titulo,
                imagem: imagemBase64,
                resumo: conteudo.substring(0, 90) + "...",
                conteudo: conteudo,
                tags: "reciclagem educacao upcycling noticias"
            };

            dadosPosts.push(novoPost);
            salvarUsuarioNoStorage();
            renderizarLista();

            e.target.reset();
            fecharModalCadastro();
        };

        leitor.readAsDataURL(arquivo);
    }
});

loadData();
