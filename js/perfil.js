const botaoEditar = document.querySelector('.botao-perfil');
const textoNome = document.querySelector('.card-perfil h3');
const textoBio = document.querySelector('.card-perfil p');
const fotoPerfil = document.getElementById('perfil-foto');
const inputFotoPerfil = document.getElementById('input-foto-perfil');
const botaoSair = document.querySelector('.botao-sair');
const abaMeusPosts = document.getElementById('aba-meus-posts');
const abaCurtidos = document.getElementById('aba-curtidos');
const btnNovoPost = document.getElementById('btn-novo-post');

let usuarioAtual = null;
let dadosPosts = [];
let postsBlog = [];
let indiceEdicao = null;
let abaAtual = 'meus';

function comprimirImagem(arquivo, larguraMaxima = 800, qualidade = 0.7) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();

        leitor.onload = function (evento) {
            const img = new Image();

            img.onload = function () {
                const canvas = document.createElement('canvas');
                let largura = img.width;
                let altura = img.height;

                if (largura > larguraMaxima) {
                    altura = Math.round((altura * larguraMaxima) / largura);
                    largura = larguraMaxima;
                }

                canvas.width = largura;
                canvas.height = altura;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, largura, altura);

                resolve(canvas.toDataURL('image/webp', qualidade));
            };

            img.onerror = () => reject(new Error('Falha ao carregar a imagem.'));
            img.src = evento.target.result;
        };

        leitor.onerror = () => reject(new Error('Falha ao ler o arquivo.'));
        leitor.readAsDataURL(arquivo);
    });
}

function salvarUsuarioNoStorage() {
    if (!usuarioAtual) return false;

    usuarioAtual.posts = dadosPosts;

    try {
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const idx = usuarios.findIndex(u => u.email === usuarioAtual.email);

        if (idx !== -1) {
            usuarios[idx] = usuarioAtual;
        } else {
            usuarios.push(usuarioAtual);
        }

        const todosPostsUsuarios = [];
        usuarios.forEach(u => {
            if (Array.isArray(u.posts)) {
                todosPostsUsuarios.push(...u.posts);
            }
        });

        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtual));
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        localStorage.setItem('postsPerfil', JSON.stringify(todosPostsUsuarios));

        return true;
    } catch (erro) {
        console.error('Erro ao salvar no localStorage:', erro);

        if (erro.name === 'QuotaExceededError' || erro.code === 22) {
            alert('Limite de armazenamento atingido! Apague posts antigos ou escolha uma imagem menor.');
        } else {
            alert('Não foi possível salvar os dados. Tente novamente.');
        }

        return false;
    }
}

botaoEditar.addEventListener('click', function () {
    if (textoNome.isContentEditable) {
        textoNome.contentEditable = 'false';
        textoBio.contentEditable = 'false';
        botaoEditar.innerHTML = '<img src="imgs/lapis-editar-perfil.webp" alt="Icone"> Editar perfil';

        if (usuarioAtual) {
            usuarioAtual.nome = textoNome.innerText.trim();
            usuarioAtual.bio = textoBio.innerText.trim();
            salvarUsuarioNoStorage();
        }
    } else {
        textoNome.contentEditable = 'true';
        textoBio.contentEditable = 'true';
        textoNome.focus();
        botaoEditar.innerHTML = 'Salvar perfil';
    }
});

fotoPerfil.addEventListener('click', function () {
    inputFotoPerfil.click();
});

inputFotoPerfil.addEventListener('change', async function () {
    const arquivo = inputFotoPerfil.files[0];
    if (!arquivo) return;

    try {
        const fotoComprimida = await comprimirImagem(arquivo, 300, 0.7);
        const fotoAnterior = usuarioAtual ? usuarioAtual.foto : fotoPerfil.getAttribute('src');

        if (usuarioAtual) {
            usuarioAtual.foto = fotoComprimida;

            if (salvarUsuarioNoStorage()) {
                fotoPerfil.setAttribute('src', fotoComprimida);
            } else {
                usuarioAtual.foto = fotoAnterior;
            }
        }
    } catch (erro) {
        console.error(erro);
        alert('Não foi possível processar essa imagem. Tente outro arquivo.');
    } finally {
        inputFotoPerfil.value = '';
    }
});

if (botaoSair) {
    botaoSair.addEventListener('click', function () {
        localStorage.removeItem('usuarioLogado');
    });
}

async function loadData() {
    try {
        const [response, resBlog] = await Promise.all([
            fetch('./data/perfil.json'),
            fetch('./data/blog.json')
        ]);

        if (!response.ok) {
            throw new Error('Erro ao carregar JSON: ' + response.status);
        }

        const data = await response.json();
        if (resBlog.ok) {
            postsBlog = await resBlog.json();
        }

        const usuariosSalvos = localStorage.getItem('usuarios');
        if (!usuariosSalvos) {
            const padrao = {
                nome: data.usuario.nome,
                email: data.usuario.email || 'cristiano@email.com',
                senha: data.usuario.senha || '123',
                bio: data.usuario.bio,
                foto: data.usuario.foto,
                posts: data.posts || []
            };
            localStorage.setItem('usuarios', JSON.stringify([padrao]));
        }

        const logadoSalvo = localStorage.getItem('usuarioLogado');
        if (logadoSalvo) {
            usuarioAtual = JSON.parse(logadoSalvo);
        } else {
            const listaUsuarios = JSON.parse(localStorage.getItem('usuarios'));
            usuarioAtual = listaUsuarios[0];
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtual));
        }

        document.getElementById('perfil-nome').innerText = usuarioAtual.nome;
        document.getElementById('perfil-bio').innerText = usuarioAtual.bio;
        document.getElementById('perfil-foto').setAttribute('src', usuarioAtual.foto);

        dadosPosts = usuarioAtual.posts || [];
        salvarUsuarioNoStorage();
        renderizarLista();
    } catch (err) {
        console.error(err);
    }
}

function obterPostsCurtidos() {
    const titulosCurtidos = JSON.parse(localStorage.getItem('postsCurtidos') || '[]');
    const postsPerfilSalvos = JSON.parse(localStorage.getItem('postsPerfil') || '[]');
    const todosPosts = [...postsBlog, ...postsPerfilSalvos];

    return titulosCurtidos
        .map(titulo => todosPosts.find(p => p.titulo === titulo))
        .filter(Boolean);
}

function renderizarLista() {
    const ul = document.getElementById('cards');
    const msgVazia = document.getElementById('msg-lista-vazia');
    ul.innerHTML = '';

    const lista = abaAtual === 'meus' ? dadosPosts : obterPostsCurtidos();

    if (lista.length === 0) {
        msgVazia.innerText = abaAtual === 'meus'
            ? 'Lista vazia'
            : 'Você ainda não curtiu nenhum post';
        msgVazia.style.display = 'block';
    } else {
        msgVazia.style.display = 'none';
        lista.forEach((post, index) => addItemLista(post, index, abaAtual === 'curtidos'));
    }
}

function addItemLista(item, index, ehCurtido = false) {
    const li = document.createElement('li');
    li.classList.add('card-posts');

    const headerPost = document.createElement('div');
    headerPost.classList.add('header-post');

    const titulo = document.createElement('h3');
    titulo.innerText = item.titulo;

    const acoesPost = document.createElement('div');
    acoesPost.classList.add('acoes-post');

    if (ehCurtido) {
        const btnDescurtir = document.createElement('button');
        btnDescurtir.innerHTML = '<img src="imgs/coracao.webp" alt="Descurtir">';
        btnDescurtir.classList.add('btn-descurtir-post');
        btnDescurtir.title = 'Remover dos curtidos';
        btnDescurtir.addEventListener('click', function (e) {
            e.stopPropagation();
            let curtidos = JSON.parse(localStorage.getItem('postsCurtidos') || '[]');
            curtidos = curtidos.filter(t => t !== item.titulo);
            localStorage.setItem('postsCurtidos', JSON.stringify(curtidos));
            renderizarLista();
        });
        acoesPost.appendChild(btnDescurtir);
    } else {
        const btnEditar = document.createElement('button');
        btnEditar.innerHTML = '<img src="imgs/lapis-editar-perfil.webp" alt="Editar">';
        btnEditar.classList.add('btn-editar-post');
        btnEditar.title = 'Editar post';
        btnEditar.addEventListener('click', function (e) {
            e.stopPropagation();
            abrirModalEdicao(item, index);
        });

        const btnRemover = document.createElement('button');
        btnRemover.innerHTML = '<img src="imgs/lixeira.webp" alt="Lixeira">';
        btnRemover.classList.add('btn-remover-post');
        btnRemover.title = 'Excluir post';
        btnRemover.addEventListener('click', function (e) {
            e.stopPropagation();
            if (!confirm('Tem certeza que deseja excluir este post?')) return;
            dadosPosts.splice(index, 1);
            salvarUsuarioNoStorage();
            renderizarLista();
        });

        acoesPost.appendChild(btnEditar);
        acoesPost.appendChild(btnRemover);
    }

    headerPost.appendChild(titulo);
    headerPost.appendChild(acoesPost);

    const imgPost = document.createElement('img');
    imgPost.setAttribute('src', item.imagem);
    imgPost.setAttribute('alt', item.titulo);

    const resumo = document.createElement('p');
    const conteudoTexto = item.conteudo || '';
    resumo.innerText = item.resumo || (conteudoTexto.length > 90
        ? conteudoTexto.substring(0, 90) + '...'
        : conteudoTexto);

    li.appendChild(headerPost);
    li.appendChild(imgPost);
    li.appendChild(resumo);

    li.addEventListener('click', function () {
        abrirModal(item);
    });

    document.getElementById('cards').appendChild(li);
}

if (abaMeusPosts && abaCurtidos) {
    abaMeusPosts.addEventListener('click', function () {
        abaAtual = 'meus';
        abaMeusPosts.classList.add('ativa');
        abaCurtidos.classList.remove('ativa');
        btnNovoPost.style.display = '';
        renderizarLista();
    });

    abaCurtidos.addEventListener('click', function () {
        abaAtual = 'curtidos';
        abaCurtidos.classList.add('ativa');
        abaMeusPosts.classList.remove('ativa');
        btnNovoPost.style.display = 'none';
        renderizarLista();
    });
}

function abrirModal(item) {
    document.getElementById('modal-titulo').innerText = item.titulo;
    document.getElementById('modal-imagem').setAttribute('src', item.imagem);
    document.getElementById('modal-texto').innerText = item.conteudo || item.resumo || '';

    document.getElementById('modal-overlay').classList.remove('overlay-escondido');
    document.body.classList.add('sem-rolagem');
}

function fecharModal() {
    document.getElementById('modal-overlay').classList.add('overlay-escondido');
    document.body.classList.remove('sem-rolagem');
}

function abrirModalCadastro() {
    indiceEdicao = null;
    document.getElementById('form-novo-post').reset();

    document.querySelector('#modal-cadastro-overlay h2').innerText = 'Novo Post';
    document.querySelector('#form-novo-post button[type="submit"]').innerText = 'Publicar';
    document.getElementById('nova-imagem').required = true;

    document.getElementById('modal-cadastro-overlay').classList.remove('overlay-escondido');
    document.body.classList.add('sem-rolagem');
}

function abrirModalEdicao(item, index) {
    indiceEdicao = index;

    document.querySelector('#modal-cadastro-overlay h2').innerText = 'Editar Post';
    document.querySelector('#form-novo-post button[type="submit"]').innerText = 'Salvar alterações';

    document.getElementById('novo-titulo').value = item.titulo;
    document.getElementById('novo-conteudo').value = item.conteudo;

    const inputArquivo = document.getElementById('nova-imagem');
    inputArquivo.value = '';
    inputArquivo.required = false;

    document.getElementById('modal-cadastro-overlay').classList.remove('overlay-escondido');
    document.body.classList.add('sem-rolagem');
}

function fecharModalCadastro() {
    indiceEdicao = null;
    document.getElementById('modal-cadastro-overlay').classList.add('overlay-escondido');
    document.body.classList.remove('sem-rolagem');
}

document.getElementById('fechar-modal').addEventListener('click', fecharModal);
btnNovoPost.addEventListener('click', abrirModalCadastro);
document.getElementById('fechar-modal-cadastro').addEventListener('click', fecharModalCadastro);

document.getElementById('modal-overlay').addEventListener('click', function (e) {
    if (e.target === this) fecharModal();
});

document.getElementById('modal-cadastro-overlay').addEventListener('click', function (e) {
    if (e.target === this) fecharModalCadastro();
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        fecharModal();
        fecharModalCadastro();
    }
});

document.getElementById('form-novo-post').addEventListener('submit', async function (e) {
    e.preventDefault();

    const titulo = document.getElementById('novo-titulo').value.trim();
    const conteudo = document.getElementById('novo-conteudo').value.trim();
    const inputArquivo = document.getElementById('nova-imagem');
    const arquivo = inputArquivo.files[0];
    const resumo = conteudo.length > 90 ? conteudo.substring(0, 90) + '...' : conteudo;

    try {
        if (indiceEdicao !== null) {
            const postAnterior = { ...dadosPosts[indiceEdicao] };
            const imagemFinal = arquivo
                ? await comprimirImagem(arquivo, 800, 0.7)
                : postAnterior.imagem;

            dadosPosts[indiceEdicao] = {
                ...postAnterior,
                titulo: titulo,
                imagem: imagemFinal,
                resumo: resumo,
                conteudo: conteudo
            };

            if (salvarUsuarioNoStorage()) {
                renderizarLista();
                e.target.reset();
                fecharModalCadastro();
            } else {
                dadosPosts[indiceEdicao] = postAnterior;
            }
        } else {
            if (!arquivo) return;

            const imagemComprimida = await comprimirImagem(arquivo, 800, 0.7);

            const novoPost = {
                titulo: titulo,
                imagem: imagemComprimida,
                resumo: resumo,
                conteudo: conteudo,
                tags: 'reciclagem educacao upcycling noticias'
            };

            dadosPosts.push(novoPost);

            if (salvarUsuarioNoStorage()) {
                renderizarLista();
                e.target.reset();
                fecharModalCadastro();
            } else {
                dadosPosts.pop();
            }
        }
    } catch (erro) {
        console.error(erro);
        alert('Não foi possível processar essa imagem. Tente outro arquivo.');
    }
});

loadData();