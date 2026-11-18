const formCadastro = document.getElementById('form-cadastro');

async function obterUsuarios() {
    const salvos = localStorage.getItem('usuarios');
    if (salvos) {
        return JSON.parse(salvos);
    }
    try {
        const res = await fetch('./data/perfil.json');
        const data = await res.json();
        const usuarioPadrao = {
            nome: data.usuario.nome,
            email: data.usuario.email || 'cristiano@email.com',
            senha: data.usuario.senha || '123',
            bio: data.usuario.bio,
            foto: data.usuario.foto,
            posts: data.posts || []
        };
        const listaInicial = [usuarioPadrao];
        localStorage.setItem('usuarios', JSON.stringify(listaInicial));
        return listaInicial;
    } catch (err) {
        return [];
    }
}

formCadastro.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = document.getElementById('campo-nome').value.trim();
    const email = document.getElementById('campo-email').value.trim().toLowerCase();
    const senha = document.getElementById('campo-senha').value;
    const confirmarSenha = document.getElementById('campo-confirmar-senha').value;

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem! Verifique e tente novamente.');
        return;
    }

    const usuarios = await obterUsuarios();

    if (usuarios.some(u => u.email.toLowerCase() === email)) {
        alert('Este e-mail já está cadastrado!');
        return;
    }

    const novoUsuario = {
        nome: nome,
        email: email,
        senha: senha,
        bio: 'Apaixonado por sustentabilidade e consumo consciente.',
        foto: 'imgs/foto-cristiano.webp',
        posts: []
    };

    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    localStorage.setItem('usuarioLogado', JSON.stringify(novoUsuario));

    window.location.href = './home.html';
});
