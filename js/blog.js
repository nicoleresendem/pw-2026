document.addEventListener("DOMContentLoaded", async () => {
    const campoBusca = document.getElementById("busca-blog");
    const tags = document.querySelectorAll(".tag");
    const containerBlog = document.getElementById("blog-content");

    let tagSelecionada = null;

    const criarCardHTML = (post) => {
        const ehHalf = post.tipo === "half";
        const classeTipo = ehHalf ? "card-half" : "card-full";
        const tagsPost = post.tags || "reciclagem educacao upcycling noticias";
        const altTexto = post.alt || post.titulo;

        const article = document.createElement("article");
        article.className = `card ${classeTipo}`;
        article.setAttribute("data-tags", tagsPost);

        article.innerHTML = `
            <div class="card-image-wrapper">
                <img src="${post.imagem}" alt="${altTexto}">
                <i class="fa-solid fa-heart heart-icon"></i>
            </div>
            <div class="card-info">
                <h2>${post.titulo}</h2>
                ${ehHalf ? "" : '<i class="fa-solid fa-ellipsis ellipsis-icon"></i>'}
            </div>
        `;

        return article;
    };

    const carregarPosts = async () => {
        try {
            const [resBlog, resPerfil] = await Promise.all([
                fetch("./data/blog.json"),
                fetch("./data/perfil.json")
            ]);

            const postsBlog = await resBlog.json();
            const dataPerfil = await resPerfil.json();
            const postsSalvos = localStorage.getItem("postsPerfil");
            const postsPerfil = postsSalvos ? JSON.parse(postsSalvos) : (dataPerfil.posts || []);

            const todosOsPosts = [...postsBlog, ...postsPerfil];
            containerBlog.innerHTML = "";

            let gridHalfAtual = null;

            todosOsPosts.forEach(post => {
                const card = criarCardHTML(post);

                if (post.tipo === "half") {
                    if (!gridHalfAtual) {
                        gridHalfAtual = document.createElement("div");
                        gridHalfAtual.className = "card-grid-half";
                        containerBlog.appendChild(gridHalfAtual);
                    }
                    gridHalfAtual.appendChild(card);
                } else {
                    gridHalfAtual = null;
                    containerBlog.appendChild(card);
                }
            });
        } catch (err) {
            console.error(err);
        }
    };

    const normalizarTexto = (texto) => {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const filtrarPosts = () => {
        const termoBusca = normalizarTexto(campoBusca.value);
        const artigos = document.querySelectorAll(".card");

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

        document.querySelectorAll(".card-grid-half").forEach(grid => {
            const temVisivel = Array.from(grid.children).some(c => c.style.display !== "none");
            grid.style.display = temVisivel ? "" : "none";
        });
    };

    await carregarPosts();

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
