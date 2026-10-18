document.addEventListener("DOMContentLoaded", () => {
    const campoBusca = document.getElementById("busca-blog");
    const tags = document.querySelectorAll(".tag");
    const artigos = document.querySelectorAll(".card");

    let tagSelecionada = null;

    // Função para remover acentos e deixar tudo em minúsculo
    const normalizarTexto = (texto) => {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const filtrarPosts = () => {
        const termoBusca = normalizarTexto(campoBusca.value);

        artigos.forEach(artigo => {
            // Pega o título e os atributos de tag que colocamos no HTML
            const titulo = normalizarTexto(artigo.querySelector("h2").textContent);
            const categorias = artigo.getAttribute("data-tags") || "";

            // Verifica se o título inclui o texto digitado
            const passouNaBusca = titulo.includes(termoBusca);

            // Verifica se o artigo possui a tag que está clicada no momento
            const passouNaTag = tagSelecionada ? categorias.includes(tagSelecionada) : true;

            // Se passar nos dois filtros, o artigo aparece; senão, é escondido
            if (passouNaBusca && passouNaTag) {
                artigo.style.display = ""; 
            } else {
                artigo.style.display = "none"; 
            }
        });
    };

    // Aciona o filtro sempre que o utilizador digitar algo na barra
    campoBusca.addEventListener("input", filtrarPosts);

    // Lógica de clique nas tags
    tags.forEach(tag => {
        tag.addEventListener("click", () => {
            const valorDaTag = tag.getAttribute("data-tag");

            // Se clicar na mesma tag que já estava ativa, ela é desmarcada
            if (tagSelecionada === valorDaTag) {
                tagSelecionada = null;
                tags.forEach(t => t.style.opacity = "1"); // Restaura a cor forte de todas
            } else {
                // Caso contrário, ativa a nova tag
                tagSelecionada = valorDaTag;
                tags.forEach(t => {
                    // Escurece (aplica transparência) as tags não selecionadas para dar destaque
                    if (t.getAttribute("data-tag") === valorDaTag) {
                        t.style.opacity = "1";
                    } else {
                        t.style.opacity = "0.4";
                    }
                });
            }

            // Atualiza os artigos na tela de acordo com a nova tag
            filtrarPosts();
        });
    });
});