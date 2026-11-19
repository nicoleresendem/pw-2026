document.addEventListener("DOMContentLoaded", async () => {
    const campoBusca = document.getElementById("busca-blog");
    const tags = document.querySelectorAll(".tag");
    const containerBlog = document.getElementById("blog-content");

    let tagSelecionada = null;
    let curtidos = JSON.parse(localStorage.getItem("postsCurtidos")) || [];

    const criarCardHTML = (post) => {
        const ehHalf = post.tipo === "half";
        const classeTipo = ehHalf ? "card-half" : "card-full";
        const tagsPost = post.tags || "reciclagem educacao upcycling noticias";
        const altTexto = post.alt || post.titulo;
        const curtido = curtidos.includes(post.titulo);

        const article = document.createElement("article");
        article.className = `card ${classeTipo}`;
        article.setAttribute("data-tags", tagsPost);
        article.dataset.titulo = post.titulo;

        article.innerHTML = `
            <div class="card-image-wrapper">
                <img src="${post.imagem}" alt="${altTexto}">
                <img src="${curtido ? "imgs/coracao.webp" : "imgs/coracaoVazado.webp"}" alt="Curtir" class="heart-icon">
            </div>
            <div class="card-info">
                <h2>${post.titulo}</h2>
                ${ehHalf ? "" : '<i class="fa-solid fa-ellipsis ellipsis-icon"></i>'}
            </div>
        `;

        article.addEventListener("click", (e) => {
            if (e.target.closest(".heart-icon")) return;
            abrirModal(post);
        });

        return article;
    };

    const abrirModal = (post) => {
        document.getElementById("modal-titulo").innerText = post.titulo;
        document.getElementById("modal-imagem").setAttribute("src", post.imagem);
        document.getElementById("modal-texto").innerText = post.conteudo || post.resumo || "";

        document.getElementById("modal-overlay").classList.remove("overlay-escondido");
        document.body.classList.add("sem-rolagem");
    };

    const fecharModal = () => {
        document.getElementById("modal-overlay").classList.add("overlay-escondido");
        document.body.classList.remove("sem-rolagem");
    };

    document.getElementById("fechar-modal").addEventListener("click", fecharModal);
    document.getElementById("modal-overlay").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) fecharModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") fecharModal();
    });

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

            const postsPerfilHalf = postsPerfil.map(post => ({
                ...post,
                tipo: "half"
            }));

            const todosOsPosts = [...postsBlog, ...postsPerfilHalf];
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

    containerBlog.addEventListener("click", (e) => {
        const coracao = e.target.closest(".heart-icon");
        if (!coracao) return;

        const titulo = coracao.closest(".card").dataset.titulo;
        const marcado = !curtidos.includes(titulo);

        coracao.src = marcado ? "imgs/coracao.webp" : "imgs/coracaoVazado.webp";

        curtidos = curtidos.filter(t => t !== titulo);
        if (marcado) curtidos.push(titulo);
        localStorage.setItem("postsCurtidos", JSON.stringify(curtidos));
    });

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