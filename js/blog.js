document.addEventListener("DOMContentLoaded", () => {
    const campoBusca = document.getElementById("busca-blog");
    const tags = document.querySelectorAll(".tag");
    const artigos = document.querySelectorAll(".card");

    let tagSelecionada = null;

    const normalizarTexto = (texto) => {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const filtrarPosts = () => {
        const termoBusca = normalizarTexto(campoBusca.value);

        artigos.forEach(artigo => {
            const titulo = normalizarTexto(artigo.querySelector("h2").textContent);
            const categorias = artigo.getAttribute("data-tags") || "";
            const passouNaBusca = titulo.includes(termoBusca);
            const passouNaTag = tagSelecionada ? categorias.includes(tagSelecionada) : true;
            if (passouNaBusca && passouNaTag) {
                artigo.style.display = "";
            } else {
                artigo.style.display = "none";
            }
        });
    };

    campoBusca.addEventListener("input", filtrarPosts);

    tags.forEach(tag => {
        tag.addEventListener("click", () => {
            const valorDaTag = tag.getAttribute("data-tag");

            if (tagSelecionada === valorDaTag) {
                tagSelecionada = null;
                tags.forEach(t => t.style.opacity = "1");
            } else {
                tagSelecionada = valorDaTag;
                tags.forEach(t => {
                    if (t.getAttribute("data-tag") === valorDaTag) {
                        t.style.opacity = "1";
                    } else {
                        t.style.opacity = "0.4";
                    }
                });
            }

            filtrarPosts();
        });
    });
});