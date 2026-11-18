var mapa = L.map('map').setView([-19.55, -42.45], 9);

L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 19,
    attribution: '© Google'
}).addTo(mapa);

var pontosDeColeta = [];

async function carregarPontos() {
    try {
        var response = await fetch('./data/mapa.json');
        pontosDeColeta = await response.json();

        pontosDeColeta.forEach(function (ponto) {
            var conteudoPopup = `
                <strong style="color: #2b7a2b; font-size: 14px;">${ponto.nome}</strong><br><br>
                <b>📍 Local:</b> ${ponto.endereco} - ${ponto.bairro}, ${ponto.cidade}<br>
                <b>♻️ Aceita:</b> ${ponto.materiais}<br>
                <b>🕒 Horário:</b> ${ponto.horario}<br>
                <b>📞 Contato:</b> ${ponto.telefone}
            `;

            ponto.marcador = L.marker([ponto.lat, ponto.lng]).addTo(mapa).bindPopup(conteudoPopup);
        });
    } catch (err) {
        console.error(err);
    }
}

carregarPontos();

var formBusca = document.querySelector('.barra-busca');

formBusca.addEventListener('submit', function (evento) {
    evento.preventDefault();

    var textoDigitado = document.getElementById('busca-mapa').value.toLowerCase();
    var encontrou = false;

    for (var i = 0; i < pontosDeColeta.length; i++) {
        var p = pontosDeColeta[i];

        if (p.cidade.toLowerCase().includes(textoDigitado) ||
            p.bairro.toLowerCase().includes(textoDigitado) ||
            p.nome.toLowerCase().includes(textoDigitado)) {

            mapa.flyTo([p.lat, p.lng], 15);
            p.marcador.openPopup();

            encontrou = true;
            break;
        }
    }

    if (!encontrou) {
        alert("Ponto de coleta não encontrado. Tente buscar por 'Ipatinga', 'Timóteo', 'Coronel Fabriciano' ou 'Caratinga'.");
    }
});

setTimeout(function () {
    mapa.invalidateSize();
}, 100);
