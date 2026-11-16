  const trilho = document.getElementById('trilho');
  const bolinhas = document.querySelectorAll('.bolinha');
  let indiceAtual = 0;

  function mudarSlide(novoIndice) {
    indiceAtual = novoIndice;
    const larguraBanner = trilho.clientWidth;
    trilho.scrollTo({ left: larguraBanner * indiceAtual, behavior: 'smooth' });
    atualizarBolinhas();
  }

  function atualizarBolinhas() {
    bolinhas.forEach((b, index) => {
      b.classList.toggle('ativa', index === indiceAtual);
    });
  }

  bolinhas.forEach((bolinha, index) => {
    bolinha.addEventListener('click', () => mudarSlide(index));
  });

  trilho.addEventListener('scroll', () => {
    const novoIndice = Math.round(trilho.scrollLeft / trilho.clientWidth);
    if (novoIndice !== indiceAtual) {
      indiceAtual = novoIndice;
      atualizarBolinhas();
    }
  });

  setInterval(() => {
    const proximo = (indiceAtual + 1) % bolinhas.length;
    mudarSlide(proximo);
  }, 4000);