const formLogin = document.querySelector('.card-login form');

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

formLogin.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('campo-email').value.trim().toLowerCase();
    const senha = document.getElementById('campo-senha').value;

    const usuarios = await obterUsuarios();
    const usuarioEncontrado = usuarios.find(
        u => u.email.toLowerCase() === email && u.senha === senha
    );

    if (!usuarioEncontrado) {
        alert('E-mail ou senha incorretos!');
        return;
    }

    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
    window.location.href = './home.html';
});
