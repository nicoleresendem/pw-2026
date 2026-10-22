var mapa = L.map('map').setView([-19.55, -42.45], 9);

L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 19,
    attribution: '© Google'
}).addTo(mapa);

const pontosDeColeta = [
    {
        nome: "BIOVALE RECICLAGEM DE ELETRÔNICOS",
        lat: -19.4506079,
        lng: -42.5868735,
        cidade: "Ipatinga",
        bairro: "Limoeiro",
        endereco: "Av. Sanitária, 2311",
        materiais: "Computadores, placas, cabos, celulares e eletrônicos",
        horario: "Seg-Sex: 08:00 - 17:00",
        telefone: "+55 31 99993-8150"
    },
    {
        nome: "BIOVALE RECICLAGEM DE ELETRÔNICOS (Unidade Fabriciano)",
        lat: -19.5193081,
        lng: -42.6289224,
        cidade: "Coronel Fabriciano",
        bairro: "Centro",
        endereco: "Ponto de coleta integrado",
        materiais: "Computadores, placas, cabos, celulares e eletrônicos",
        horario: "Seg-Sex: 08:00 - 17:00",
        telefone: "+55 31 99993-8150"
    },
    {
        nome: "ASCATI - Associação de Catadores",
        lat: -19.5353314,
        lng: -42.6251517,
        cidade: "Timóteo",
        bairro: "Eldorado",
        endereco: "R. Cento e Sessenta e Um, 501",
        materiais: "Materiais recicláveis em geral",
        horario: "Horário comercial",
        telefone: "Não informado"
    },
    {
        nome: "Reciclagem Vieira",
        lat: -19.7455947,
        lng: -42.1319045,
        cidade: "Caratinga",
        bairro: "Graça",
        endereco: "Av. Monsenhor Aristides Rocha, 695",
        materiais: "Sucatas de alumínio, metais e plásticos",
        horario: "Horário comercial",
        telefone: "Não informado"
    }
];

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