# Partiu — padrão de design

Guia para quem (pessoa ou agente) for criar ou mudar telas do Partiu. Tudo aqui foi tirado do que já existe em `css/` e `js/`. Se algo novo não couber nestas regras, siga o componente mais parecido que já existe antes de inventar outro.

## Princípios

1. **Monocromático e claro.** O app é preto, branco e cinzas, no estilo iOS. Não há cor de marca: o destaque é sempre `--ink` (quase preto) sobre `--surface` (branco). Cor só aparece em fotos/ilustrações e no mapa.
2. **Um celular de 390 × 844.** Tudo é desenhado dentro de `.phone`. No desktop ele fica centralizado com moldura; abaixo de 500px ocupa a tela inteira.
3. **Selecionado = invertido.** Um item escolhido troca para fundo `--ink` e texto `--surface`. Não use outra cor, sombra extra ou ícone de check para indicar seleção.
4. **Pouca decoração.** Bordas finas de 1px, sombras suaves só no que flutua (cartões sobre o mapa, botões flutuantes, painéis). Nada de gradientes decorativos.
5. **Toque confortável.** Toda área clicável tem no mínimo 44 × 44px (botões principais 56px de altura).
6. **Movimento curto e com propósito.** Entradas deslizam ou sobem um pouco; tudo respeita `prefers-reduced-motion`.

## Cores

Os tokens ficam em `:root` no `css/base.css`. Use sempre a variável quando existir.

| Token | Valor | Uso |
| --- | --- | --- |
| `--bg` | `#E7E7EA` | fundo da página, atrás do celular |
| `--surface` | `#FFFFFF` | fundo das telas, cartões, painéis |
| `--fill` | `#F2F2F5` | fundos suaves: campo de busca, item ativo, miniaturas, trilho de progresso |
| `--line` | `#E4E4E8` | divisórias, bordas de cartão, botão desativado |
| `--ink` | `#1C1C1E` | texto principal, botão primário, estado selecionado |
| `--sec` | `#6C6C72` | texto secundário, legendas, rótulos |
| `--muted` | `#B4B4BA` | texto desativado (ex.: dias passados no calendário) |

Cinzas auxiliares já usados (sem token; reutilize estes, não crie novos):

| Valor | Uso |
| --- | --- |
| `#D4D4D9` | borda de botão secundário, pílula, botão redondo |
| `#D0D0D5` / `#C7C7CC` | bordas tracejadas (estado vazio, inserir aqui, trajeto) |
| `#D2D2D7` | pontos de paginação inativos, trilho do slider |
| `#D1D1D6` | alça (grabber) dos painéis |
| `#A2A2A8` | ícones apagados (alça de arrastar, inserir) |
| `#C7C7CC` | texto secundário sobre fundo `--ink` |
| `#3A3A3C` | selo/contador secundário sobre fundo `--ink` |
| `#101012` | moldura do celular |

Categorias do orçamento usam três tons do mesmo cinza (`#1C1C1E`, `#6C6C72`, `#B4B4BA`), definidos em `ALLOC` no `js/core.js`.

O app só tem tema claro (`color-scheme: light`). Não adicione tema escuro sem combinar antes.

## Tipografia

Fonte: **Inter** (400, 500, 600, 700) via Google Fonts, com fallback do sistema em `--font`.

| Papel | Tamanho | Peso | Extra |
| --- | --- | --- | --- |
| Título de tela (`h1`) | 30px | 700 | `letter-spacing: -0.7px`, `line-height: 1.15`, `text-wrap: balance` |
| Título secundário (carregando) | 24px | 700 | `letter-spacing: -0.5px` |
| Título de seção / painel (`h2`) | 18–20px | 700 | `letter-spacing: -0.3px` a `-0.4px` |
| Cabeçalho de tela, nome de cartão grande | 17–19px | 600–700 | |
| Corpo / subtítulo (`.sub`) | 17px | 400 | cor `--sec`, `line-height: 1.4` |
| Nome de item em lista | 15–16px | 600 | corta com reticências em uma linha |
| Texto de apoio | 14–15px | 400–500 | cor `--sec` |
| Rótulo / meta (`.label`) | 13px | 600 | cor `--sec` |
| Mínimo (abas, contadores) | 10–12px | 500–700 | só para detalhes |

Regras:

- Números que mudam ou se alinham (horários, valores, datas, porcentagens) usam `font-variant-numeric: tabular-nums`.
- Títulos grandes têm `letter-spacing` negativo; texto corrido não.
- Linhas de lista usam `white-space: nowrap; overflow: hidden; text-overflow: ellipsis` com `min-width: 0` no pai flex.
- Não use maiúsculas no texto do app. (A página `index.html` usa caixa alta só nos rótulos de seção.)

## Espaçamento e layout

- **Margem lateral das telas:** 24px nas perguntas e na apresentação; 20px nas telas de conteúdo (roteiro, lista de lugares); 16px para elementos que flutuam sobre o mapa.
- **Topo:** cabeçalhos começam em ~48px do topo (área da barra de status). Rodapés com botão terminam com 28–34px de folga embaixo.
- **Espaços entre elementos:** use a escala 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32px. Entre blocos de uma etapa, 24px; dentro de um grupo, 8–12px.
- **Estrutura de tela:** `.screen` é `position: absolute; inset: 0` e coluna flex. Cabeçalho e rodapé são `flex: none`; o miolo é `flex: 1; min-height: 0; overflow-y: auto`.
- **Rodapé fixo:** separado por `border-top: 1px solid var(--line)`, com o botão principal ocupando a largura toda.
- Barras de rolagem ficam escondidas em todo o app; a rolagem lateral com setas usa `js/ui/hnav.js`.

## Formas

| Raio | Onde |
| --- | --- |
| 46px | moldura do celular |
| 28px | ilustração da apresentação |
| 20–22px | painéis que sobem de baixo (`20px 20px 0 0`), cartões de deslizar, estados vazios |
| 16–18px | cartões (bento, categorias, cartão da viagem) |
| 14px | botões primário/secundário, cartões de lista, chips de dia |
| 12px | botões de ícone, busca, miniaturas, chips de horário |
| 8–10px | controles segmentados, etiquetas pequenas |
| 50% / altura÷2 | pílulas, botões redondos, pins, pontos |

Sombras (só para o que flutua):

- leve: `0 2px 8px rgba(0,0,0,.08–.2)` — pins, botões redondos, setas
- cartão flutuante: `0 4px 16px rgba(0,0,0,.10)`
- painel inferior: `0 -4px 20px rgba(0,0,0,.08)`
- destaque (toast, item arrastado): `0 8px 24px rgba(0,0,0,.2)` a `0 16px 36px rgba(0,0,0,.22)`

## Componentes

Reutilize estas classes antes de criar novas. As globais estão em `css/base.css`; as demais, no CSS da tela onde nasceram — se uma passar a ser usada em mais de uma tela, mova para `base.css`.

**Botões**

- `.btn-primary` — ação principal da tela. 100% de largura, 56px, fundo `--ink`, texto branco 17px/600. Desativado: fundo `--line`, texto `--sec`. Variante `.sm` (48px, largura automática). **Uma por tela.**
- `.btn-sec` — ação secundária ao lado da principal: branco, borda `#D4D4D9`, 56px. Pode levar um contador `<i>`.
- `.btn-out` — botão contornado de 48px para ações em estados vazios.
- `.icon-btn` — 44 × 44, raio 12, transparente. Variantes `.filled` (fundo `--fill`) e `.round` (circular com borda).
- `.round-act` — botões redondos de 58px para decidir (pular/quero). `.ok` é o invertido; `.sm` tem 44px.
- `.link`, `.link-sm`, `.text-btn` — ações de texto. `.link` é cinza (ex.: "Pular"); `.link-sm` e `.text-btn` são sublinhados.

**Seleção**

- `.pill` — opções em pílula (40px, borda `#D4D4D9`). Selecionada: invertida.
- `.seg` — controle segmentado estilo iOS: trilho `#EEEEF0`, opção ativa branca com sombra leve.
- `.b` (bento) — cartões de interesse em grade 2 colunas, `.wide` e `.tall`. Selecionado: invertido.
- `.row-btn` — linha de lista com ícone redondo em `--fill`, título e subtítulo, divisória embaixo.
- `.day-chip`, `.time-chip`, `.stage` — chips de dia, horário e etapa; ativo invertido. Horário indisponível: fundo `--fill`, texto `#A2A2A8` riscado.

**Entradas**

- `.search` — campo com fundo `--fill`, 52px, raio 12; no foco ganha anel `0 0 0 2px var(--ink)`.
- `.amount-field` — valor grande editável (44px/700), fundo `--fill` ao passar o mouse.
- `.range` — slider com trilho de 6px e botão branco de 24px.
- `.stepper` — menos/valor/mais com `.icon-btn` de 40px.

**Estrutura e feedback**

- Cabeçalho de tela: `.icon-btn` voltar (chevron 22px, traço 2.2) · título + subtítulo centralizados · ação ou espaçador de 44px.
- `.progress` — barras de 4px por etapa; preenchidas em `--ink`.
- `.dots` — paginação; o ponto ativo estica para 22px.
- `.sheet` / `.when-panel` — painel que sobe de baixo, com `.grabber` (36 × 5px). Fundo escurecido `rgba(0,0,0,.28)` quando é modal.
- `.toast` — aviso escuro flutuante com ação "Desfazer" sublinhada.
- `.map-note` — aviso curto escuro sobre o mapa.
- Estados vazios (`.tl-empty`, `.disc-empty`, `.stage-done`) — caixa com borda tracejada `1.5px dashed #D0D0D5`, texto centralizado, título 17px/600 + explicação em `--sec` + ação.
- `.tabbar` — 4 abas com ícone de 24px e rótulo de 11px; a atual em `--ink`/600.

## Ícones

- Desenhados à mão em `ICON` no `js/core.js` e gerados com `svg(nome, tamanho, traço)`.
- Grade 24 × 24, `fill="none"`, `stroke="currentColor"`, `stroke-linecap="round"`, `stroke-linejoin="round"`, traço 2 (2.2 em setas e fechar do cabeçalho; 1.8 na tabbar).
- Tamanhos: 14–16px dentro de texto, 18–20px em botões, 22px no voltar, 24px na tabbar.
- Sempre `aria-hidden="true"`; o botão leva o `aria-label`.
- Para um ícone novo, adicione ao objeto `ICON` no mesmo estilo de traço. Não traga bibliotecas de ícones.

## Movimento

- Curva padrão: `cubic-bezier(.2, .8, .2, 1)`. Durações de 0,15s (hover/toque) a 0,4s (entradas).
- **Troca de tela:** avançar desliza da direita (`enter-f`), voltar da esquerda (`enter-b`), a anterior some com leve redução (`leave`). Use `go(passo)` / `showScreen()` do `js/core.js`, nunca troque `hidden` na mão.
- **Troca de etapa:** os filhos entram em cascata com 40ms de atraso entre eles (`step-f`/`step-b`), reiniciados com `replay(el, cls)`.
- **Listas:** itens sobem 12px em cascata de 45ms (`--i` como índice).
- **Toque:** botões e cartões encolhem levemente no `:active` (`scale(.92–.97)`).
- **Painéis:** sobem de baixo (`@keyframes up`); fundo aparece com `fade`.
- Toda animação nova precisa ser desligada em `@media (prefers-reduced-motion: reduce)`.

## Acessibilidade

- Estado vai em atributo ARIA, e o CSS estiliza a partir dele: `aria-pressed="true"` para opções alternáveis, `aria-current="page" | "step" | "true"` para o item atual.
- Foco visível: `outline: 2px solid var(--ink); outline-offset: 2px` (já global em `base.css`). Não remova sem dar outro anel de foco.
- Botões só com ícone sempre têm `aria-label` em português.
- Painéis usam `role="dialog"` com `aria-label`; avisos usam `role="status"` ou `aria-live="polite"`.
- Use `<button>` para tudo que é clicável, mesmo cartões e linhas.

## Texto

- Português do Brasil, frase com maiúscula só no começo ("Ver no mapa", não "Ver No Mapa").
- Tom direto e próximo, falando com a pessoa ("Seu roteiro", "Quero ir"). Botões dizem a ação, curtos.
- Valores: `money(n)` → `R$ 4.000`. Datas: `12 nov`, `12–18 nov`, `qua, 12 nov`. Horários: `08:30`.
- Separador de detalhes: ` · ` (ex.: `Praia · Centro`). Faixa: travessão `–`.
- Plural com `plural(n, 'lugar', 'lugares')`.
- Comentários de código também em português.

## Código e arquivos

- Sem build e sem framework: HTML + CSS + JS puro, abre direto no navegador.
- Um CSS e um JS por tela (`css/screens/`, `js/screens/`); o compartilhado fica em `css/base.css` e `js/core.js`. A marcação das telas fica em `app.html`.
- Toda tela nova precisa entrar também na prévia do `index.html` e na tabela de endereços do `README.md`.
- Bibliotecas externas só via cdnjs com versão fixa (ex.: Leaflet 1.9.4). O CSS do Leaflet está embutido em `map.css`.
- HTML gerado em JS passa pelo `esc()` quando mostra texto vindo de dados.
- Variações de design que não entraram no app ficam em `explorations/` como referência.

## Antes de entregar uma tela

- [ ] Só usei os tokens e cinzas listados acima.
- [ ] Seleção é fundo `--ink` + texto branco, via `aria-pressed`/`aria-current`.
- [ ] Alvos de toque com 44px ou mais; uma única ação principal.
- [ ] Números com `tabular-nums`; textos longos cortam com reticências.
- [ ] Ícones no estilo de traço do `ICON`, com `aria-hidden` e `aria-label` no botão.
- [ ] Animações com a curva padrão e desligadas em movimento reduzido.
- [ ] Funciona em 390 × 844 e em tela cheia abaixo de 500px.
- [ ] Tela aparece no `index.html` e no `README.md`.
