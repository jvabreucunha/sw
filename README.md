# Partiu

Protótipo navegável de um app para organizar viagens pelo litoral catarinense: a pessoa responde algumas perguntas, escolhe lugares deslizando cartões e organiza tudo numa linha do tempo por dia.

## Como abrir

Não precisa de build. Abra `index.html` no navegador para ver todas as telas, ou `app.html` para seguir o fluxo do começo.

Para evitar bloqueios do navegador com arquivos locais, dá para servir a pasta:

```bash
npx serve .
```

Cada tela também abre direto pelo endereço:

| Endereço | Tela |
| --- | --- |
| `app.html#intro` | Apresentação |
| `app.html#dest` | Destino |
| `app.html#dates` | Datas |
| `app.html#budget` | Orçamento |
| `app.html#prefs` | Interesses |
| `app.html#loading` | Busca de lugares |
| `app.html#discover` | Escolher lugares |
| `app.html#organize` | Organizar roteiro (com exemplo preenchido) |
| `app.html#main` | Explorar no mapa |

## Estrutura

```
index.html                 página de desenvolvimento com todas as telas
app.html                   o app (marcação das telas)
css/app.css                estilos
js/data.js                 cidades e lugares de exemplo
js/app.js                  lógica: onboarding, perguntas, roteiro, mapa
tiles/                     blocos do mapa (CARTO Positron), zoom 11 a 15
scripts/download-tiles.js  baixa os blocos do mapa de novo
explorations/              variações de design que ficaram de referência
```

## Mapa

O mapa usa [Leaflet 1.9.4](https://leafletjs.com) (via cdnjs) com os blocos do estilo CARTO Positron salvos em `tiles/`, cobrindo as quatro cidades. Para baixar de novo ou ampliar a área, edite as coordenadas em `scripts/download-tiles.js` e rode:

```bash
node scripts/download-tiles.js
```

Mapa: © OpenStreetMap contributors © CARTO.

## Dados

Os pontos turísticos (praias, Cristo Luz, Unipraias, igrejas) têm coordenadas conferidas no OpenStreetMap. Restaurantes, hotéis, notas e preços são fictícios. Sem acesso ao GPS, a localização usada é o Shopping Russi & Russi, em Itapema.
