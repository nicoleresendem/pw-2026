document.addEventListener('DOMContentLoaded', () => {
    const saudacao = document.getElementById('saudacao-usuario');
    const usuarioSalvo = localStorage.getItem('usuarioLogado');

    if (saudacao && usuarioSalvo) {
        try {
            const usuario = JSON.parse(usuarioSalvo);
            if (usuario.nome) {
                const primeiroNome = usuario.nome.trim().split(' ')[0];
                saudacao.innerText = `Olá, ${primeiroNome}!`;
            }
        } catch (err) {
            console.error(err);
        }
    }

    const trilho = document.getElementById('trilho');
    const bolinhas = document.querySelectorAll('.bolinha');
    const banner = document.querySelector('.banner-principal');
    let indiceAtual = 0;
    let intervaloCarrossel = null;

    function atualizarBolinhas() {
        bolinhas.forEach((b, index) => {
            b.classList.toggle('ativa', index === indiceAtual);
        });
    }

    function mudarSlide(novoIndice) {
        indiceAtual = novoIndice;
        trilho.scrollTo({ left: trilho.clientWidth * indiceAtual, behavior: 'smooth' });
        atualizarBolinhas();
    }

    function iniciarAutoPlay() {
        pararAutoPlay();
        intervaloCarrossel = setInterval(() => {
            const proximo = (indiceAtual + 1) % bolinhas.length;
            mudarSlide(proximo);
        }, 4500);
    }

    function pararAutoPlay() {
        if (intervaloCarrossel) {
            clearInterval(intervaloCarrossel);
            intervaloCarrossel = null;
        }
    }

    bolinhas.forEach((bolinha, index) => {
        bolinha.addEventListener('click', () => {
            mudarSlide(index);
            iniciarAutoPlay();
        });
    });

    trilho.addEventListener('scroll', () => {
        if (!trilho.clientWidth) return;
        const novoIndice = Math.round(trilho.scrollLeft / trilho.clientWidth);
        if (novoIndice !== indiceAtual && novoIndice >= 0 && novoIndice < bolinhas.length) {
            indiceAtual = novoIndice;
            atualizarBolinhas();
        }
    });

    if (banner) {
        banner.addEventListener('mouseenter', pararAutoPlay);
        banner.addEventListener('mouseleave', iniciarAutoPlay);
        banner.addEventListener('touchstart', pararAutoPlay, { passive: true });
        banner.addEventListener('touchend', iniciarAutoPlay);
    }

    window.addEventListener('resize', () => {
        trilho.scrollTo({ left: trilho.clientWidth * indiceAtual, behavior: 'auto' });
    });

    iniciarAutoPlay();

    const dicasODS12 = [
        'Leve sua própria ecobag ao mercado e recuse sacolas plásticas descartáveis.',
        'Planeje as refeições da semana antes de fazer compras para evitar o desperdício de alimentos.',
        'Lave e seque rapidamente embalagens recicláveis antes de separá-las para a coleta.',
        'Dê preferência a produtos com refil, embalagens retornáveis ou comprados a granel.',
        'Antes de descartar roupas ou objetos, veja se podem ser consertados, doados ou reaproveitados.',
        'Descarte pilhas, baterias e eletrônicos sempre em ecopontos — nunca no lixo comum.',
        'Aproveite talos, cascas e folhas em receitas ou comece uma pequena composteira em casa.'
    ];

    const textoDica = document.getElementById('texto-dica-ods');
    const btnNovaDica = document.getElementById('btn-nova-dica');
    let indiceDica = Math.floor(Math.random() * dicasODS12.length);

    function mostrarDica() {
        if (textoDica) {
            textoDica.innerText = dicasODS12[indiceDica];
        }
    }

    if (btnNovaDica) {
        btnNovaDica.addEventListener('click', () => {
            indiceDica = (indiceDica + 1) % dicasODS12.length;
            mostrarDica();
        });
    }

    mostrarDica();
});