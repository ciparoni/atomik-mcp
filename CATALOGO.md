# Catálogo do MCP Atomik

Este documento lista tudo que o Claude consegue fazer dentro do editor do Elementor quando o pontinho verde do Atomik está aceso. Cada item mostra:

- **Como pedir** — frase natural que você manda no chat
- **O que faz** — explicação simples
- **Como funciona por trás** (opcional) — o nome da ferramenta MCP, pra quem quiser saber

---

## Como funciona

1. **Abre o editor do Elementor** numa aba do Chrome
2. **Confere o pontinho verde** no painel do Atomik (lado direito)
3. **Pede pro Claude** o que quer fazer — em português normal mesmo
4. **O Claude executa** direto no editor, em tempo real

Não precisa decorar nome de função. Os exemplos abaixo são só pra você ter ideia do que dá pra pedir.

---

## 1. Ver o que tem na página

Antes de mexer, é útil olhar o que já existe.

| Como pedir | O que faz |
|---|---|
| "Mostra o que eu selecionei agora" | Devolve o elemento selecionado no editor (tipo, ID, pai) |
| "Lista a estrutura da página" | Devolve a árvore inteira: seções → containers → widgets |
| "Me mostra o JSON desse elemento" (com um ID) | Lê tudo de um elemento específico |
| "Procura todos os botões com texto 'Comprar'" | Busca elementos por tipo, texto, classe |
| "Quantos cards de imagem tem nessa página?" | Mesma busca, contando ao final |

**Por trás:** `obter_selecao_atual`, `ler_estrutura_pagina`, `ler_elemento`, `buscar_elementos`

---

## 2. Adicionar componentes prontos

O Atomik tem uma biblioteca de componentes (cards, abas, botões, timelines, etc). É a forma mais rápida de montar uma página.

| Como pedir | O que faz |
|---|---|
| "Quais componentes existem no Atomik?" | Lista o catálogo inteiro |
| "Insere um card de depoimento" | Adiciona 1 componente no local selecionado |
| "Insere um botão primário sólido em modo claro" | Mesma coisa, mas variante light |
| "Monta um hero com título, descrição e dois botões" | Insere vários componentes em sequência |
| "Coloca uma timeline vertical numerada aqui" | Componente específico, direto |

**Por trás:** `listar_componentes`, `inserir_componente`, `inserir_multiplos_componentes`

### Atalho: começar uma seção

Sempre que for inserir vários componentes, peça pra **criar uma seção nova primeiro**:

> "Cria uma seção nova e depois insere 3 cards de ícone"

---

## 3. Construir elementos do zero

Quando o componente da biblioteca não serve, dá pra criar do nada.

| Como pedir | O que faz |
|---|---|
| "Cria um container vazio aqui" | Adiciona um container/flexbox em branco |
| "Cria um título 'Bem-vindo' azul" | Cria um widget de texto já estilizado |
| "Duplica esse elemento" | Faz uma cópia ao lado do original |
| "Move esse elemento pra dentro daquele container" | Reposiciona o elemento na árvore |
| "Apaga esse elemento" | Remove |

**Por trás:** `criar_elemento`, `duplicar_elemento`, `mover_elemento`, `remover_elemento`

---

## 4. Ajustar estilo (cores, fontes, espaçamento)

Aqui o Claude se vira sem você ter que abrir o painel lateral do Elementor.

| Como pedir | O que faz |
|---|---|
| "Deixa o fundo desse card amarelo claro" | Aplica `background-color` |
| "Cor do texto vermelha no hover" | Aplica cor com estado :hover |
| "Fonte Cabin, peso 600, tamanho 18px" | Tipografia em uma linha |
| "Padding 40 em cima e embaixo, 20 nas laterais" | Padding/margem por lado |
| "Largura do card: 4 colunas de 12 com gutter 20" | Largura usando o **grid do Atomik** (responsiva por natureza) |
| "Borda arredondada de 12px só nos cantos de cima" | Border-radius por canto |
| "Sombra grande embaixo: 0 20px 60px preto com 30%" | Box-shadow |

**Por trás:** `definir_cor`, `definir_tipografia`, `definir_espacamento`, `definir_largura`, `definir_border_radius`, `definir_sombra`

### Por que não usar "largura 400px"?

A tool `definir_largura` aplica uma fórmula matemática que sempre alinha o elemento com o grid de 12 colunas. Assim, se a tela muda de tamanho, o card continua proporcional. **É a forma certa de fazer no Atomik.**

---

## 5. Selecionar e navegar

| Como pedir | O que faz |
|---|---|
| "Seleciona o elemento com ID abc1234" | Foca o cursor do editor naquele elemento |
| "Tira a seleção" | Limpa o que está selecionado |
| "Desfaz" / "Volta a última ação" | Cmd+Z |
| "Refaz" | Cmd+Shift+Z |
| "Salva a página" | Salvamento automático |

**Por trás:** `selecionar_elemento`, `limpar_selecao`, `desfazer`, `refazer`, `salvar_pagina`

---

## 6. Mexer em vários elementos de uma vez

Quando você quer mudar coisa em **toda a página** de uma vez (cor, fonte, link), o Claude faz duas etapas:

**Passo 1 — descobrir o que tem:**

| Como pedir | O que faz |
|---|---|
| "Quais fontes estão sendo usadas na página?" | Lista todas as font-family + onde aparecem |
| "Quantos tamanhos de fonte diferentes tem?" | Lista por tamanho |
| "Quais pesos de fonte usei?" | Lista por peso (300, 400, 600...) |
| "Mostra todas as cores da página" | Lista hex + globais + quantas vezes aparecem |
| "Quais links existem nessa página?" | Lista URLs |
| "Quais imagens?" | Lista de imagens |
| "Quais campos de formulário?" | Lista de inputs |

**Passo 2 — alterar em massa:**

| Como pedir | O que faz |
|---|---|
| "Troca todo Inter 400 por Cabin 500" | Mass update de peso |
| "Todo título 32px no desktop vira 28px" | Mass update de tamanho |
| "Troca a cor `#cccccc` por `#ffc107`" | Mass update de cor |
| "Substitui esse link antigo pelo novo em toda página" | Mass update de URL |

**Por trás:** `varrer_pagina`, `atualizar_cores_em_massa`, `atualizar_peso_em_massa`, `atualizar_tamanho_em_massa`, `substituir_link_em_massa`

---

## 7. Kit Global (identidade da marca)

O Elementor tem um "Kit" central de cores e tipografia. Mexer aqui muda a página inteira.

| Como pedir | O que faz |
|---|---|
| "Quais cores estão no Kit Global?" | Lista cores V3 e V4 |
| "Cria uma cor global chamada 'Honey' com `#ffc107`" | Adiciona cor ao Kit |
| "Muda a cor primária pra `#0066ff`" | Edita cor existente |
| "Quais estilos de texto tem no Kit?" | Lista tipografia global |

**Por trás:** `listar_kit_cores`, `criar_cor_global`, `editar_cor_global`, `listar_kit_tipografia`

---

## 8. Trazer design do Figma

Se você tem cores e tipografia num arquivo Figma, dá pra jogar tudo no Elementor.

| Como pedir | O que faz |
|---|---|
| "Aplica as cores do Figma no Kit" | Sincroniza Variables/Styles → Kit Global |
| "Aplica a tipografia do Figma" | Sincroniza Text Styles → Kit |
| "Importa esse grid do Figma como bento" | Recria layout de grid no editor |

> ⚠️ Pra isso funcionar, o JSON do Figma precisa estar disponível. Em geral o fluxo é: você copia o frame no Figma → cola na extensão → o Claude usa os dados.

**Por trás:** `figma_aplicar_cores`, `figma_aplicar_tipografia`, `figma_importar_grid`

---

## 9. Ambiência visual (luz, pattern, transição)

Coisas que dão "alma" pra seção.

| Como pedir | O que faz |
|---|---|
| "Coloca uma luz de fundo amarela no centro dessa seção" | Glow desfocado atrás do conteúdo |
| "Luz branca no canto superior direito, opacidade 30" | Mesma luz, posição/opacidade custom |
| "Pattern de pontinhos discreto atrás do conteúdo" | Padrão repetido (pontos, grade, cruz, diagonal) |
| "Transição em curva entre essa seção e a próxima" | Borda animada de seção (shutter/pixel/curva) |

**Por trás:** `inserir_luz_fundo`, `inserir_pattern`, `aplicar_transicao_secao`

---

## 10. Animações de texto e elementos

| Como pedir | O que faz |
|---|---|
| "Anima esse título letra por letra em cascata" | Letras aparecem uma a uma |
| "Revelação por linhas quando rolar a tela" | Cada linha aparece separadamente no scroll |
| "Aplica a animação 'fade up' customizada" | Usa um preset da biblioteca de animações |

**Por trás:** `aplicar_animacao`

---

## 11. Popups (modais e overlays)

7 tipos prontos, cada um com visual diferente.

| Como pedir | O que faz |
|---|---|
| "Cria um popup com efeito de pixels" | Overlay com transição pixelada |
| "Popup com animação SVG na entrada" | Overlay com SVG animado |
| "Popup tipo veneziana (shutter)" | Overlay desliza tipo persiana |
| "Popup simples só com fundo escuro" | Overlay básico |
| "Popup em 2 colunas (texto + imagem)" | Layout dividido |
| "Drawer lateral que desliza da direita" | Painel lateral |
| "Popup de vídeo com botão de play" | Vídeo dentro do popup |

**Por trás:** `criar_popup`

---

## 12. Vídeos especiais

| Como pedir | O que faz |
|---|---|
| "Vídeo controlado por scroll" | Frames sincronizados com a rolagem |
| "GIF que toca em loop" | Loop curto |
| "Vídeo que toca no hover" | Só roda quando passa o mouse |
| "VSL (vídeo sales letter) com controles customizados" | Player completo de venda |

**Por trás:** `inserir_video`

---

## 13. Cursor customizado

Pra dar personalidade na navegação.

| Como pedir | O que faz |
|---|---|
| "Cursor com bolinha cheia preta" | Cursor minimalista |
| "Cursor com um label 'Clique' quando passar nesse botão" | Texto colado no cursor |
| "Cursor que cresce nesse elemento" | Efeito grow |
| "Brilho ao redor do cursor sobre essa seção" | Glow seguindo o mouse |

**Por trás:** `aplicar_cursor`, `inserir_cursor_label`, `inserir_cursor_grow`, `aplicar_cursor_glow`

---

## 14. Inserir código (CSS/JS)

Pra quando o estilo nativo não chega.

| Como pedir | O que faz |
|---|---|
| "Adiciona esse CSS no widget Scripts" | Cola CSS na página |
| "Envolve essa seção com `<div class='wrapper'>...</div>`" | Adiciona tag HTML em volta |
| "Adiciona esse JavaScript" | Cola JS na página |
| "Valida o CSS do widget Scripts" | Confere se a sintaxe está OK |

**Por trás:** `inserir_css_snippet`, `inserir_tag_css`, `envolver_html`, `inserir_js_snippet`, `validar_css`

---

## Tabela rápida — todos os 50 comandos

| # | Categoria | Função MCP | Pra que serve |
|---|---|---|---|
| 1 | Catálogo | `listar_componentes` | Lista todos os componentes prontos |
| 2 | Catálogo | `inserir_componente` | Insere 1 componente |
| 3 | Catálogo | `inserir_multiplos_componentes` | Insere vários em sequência |
| 4 | Estrutura | `ler_estrutura_pagina` | Devolve árvore da página |
| 5 | Estrutura | `ler_elemento` | Lê JSON de um elemento |
| 6 | Estrutura | `criar_elemento` | Cria elemento do zero |
| 7 | Estrutura | `editar_elemento` | Edita settings ou styles |
| 8 | Estrutura | `remover_elemento` | Apaga elemento |
| 9 | Ambiência | `inserir_luz_fundo` | Glow desfocado num container |
| 10 | Ambiência | `inserir_pattern` | Pattern decorativo |
| 11 | Seleção | `obter_selecao_atual` | Mostra o que está selecionado |
| 12 | Seleção | `selecionar_elemento` | Seleciona por ID |
| 13 | Seleção | `limpar_selecao` | Limpa seleção |
| 14 | Seleção | `buscar_elementos` | Busca por tipo/texto/classe |
| 15 | Seleção | `duplicar_elemento` | Duplica |
| 16 | Seleção | `mover_elemento` | Move pra outro pai |
| 17 | Histórico | `desfazer` | Cmd+Z |
| 18 | Histórico | `refazer` | Cmd+Shift+Z |
| 19 | Histórico | `salvar_pagina` | Salva |
| 20 | Estilo | `definir_cor` | Cor (fundo/texto/borda) |
| 21 | Estilo | `definir_tipografia` | Família/peso/tamanho/espaçamento |
| 22 | Estilo | `definir_espacamento` | Margin/padding 4 lados |
| 23 | Estilo | `definir_largura` | Largura via grid Atomik |
| 24 | Estilo | `definir_sombra` | Box-shadow |
| 25 | Estilo | `definir_border_radius` | Cantos arredondados |
| 26 | Kit | `listar_kit_cores` | Cores do Kit Global |
| 27 | Kit | `criar_cor_global` | Adiciona cor ao Kit |
| 28 | Kit | `editar_cor_global` | Edita cor do Kit |
| 29 | Kit | `listar_kit_tipografia` | Estilos de texto do Kit |
| 30 | Análise | `varrer_pagina` | Lista fontes/cores/links/etc da página |
| 31 | Massa | `atualizar_cores_em_massa` | Troca cor em todos os lugares |
| 32 | Massa | `atualizar_peso_em_massa` | Troca peso de fonte em massa |
| 33 | Massa | `atualizar_tamanho_em_massa` | Troca tamanho de fonte em massa |
| 34 | Massa | `substituir_link_em_massa` | Troca URL em todos os lugares |
| 35 | Figma | `figma_aplicar_cores` | Cores Figma → Kit |
| 36 | Figma | `figma_aplicar_tipografia` | Tipografia Figma → Kit |
| 37 | Figma | `figma_importar_grid` | Grid Figma → bento Elementor |
| 38 | Animação | `aplicar_animacao` | Letras cascata / revelação linhas / custom |
| 39 | Animação | `aplicar_transicao_secao` | Shutter / pixel / curva |
| 40 | Popup | `criar_popup` | 7 templates de popup |
| 41 | Vídeo | `inserir_video` | Scroll / GIF / hover / VSL |
| 42 | Cursor | `aplicar_cursor` | Cursor customizado |
| 43 | Cursor | `inserir_cursor_label` | Label junto ao cursor |
| 44 | Cursor | `inserir_cursor_grow` | Cursor cresce |
| 45 | Cursor | `aplicar_cursor_glow` | Brilho seguindo o cursor |
| 46 | Código | `inserir_css_snippet` | Cola CSS no Scripts |
| 47 | Código | `inserir_tag_css` | CSS pra seletor específico |
| 48 | Código | `envolver_html` | Envolve com tags HTML |
| 49 | Código | `inserir_js_snippet` | Cola JS no Scripts |
| 50 | Código | `validar_css` | Confere sintaxe do CSS |

---

## Dicas pra pedir bem

- **Diga o que selecionou.** Antes de "deixa o fundo amarelo", clique no elemento no editor — o Claude descobre sozinho com `obter_selecao_atual`.
- **Use linguagem natural.** "Padding 40 em cima e embaixo" funciona melhor que "passa um JSON pra `padding`".
- **Combine pedidos.** "Cria uma seção, coloca 3 cards de ícone com fundo escuro e adiciona uma luz amarela atrás" — o Claude planeja a sequência.
- **Peça pra desfazer.** Se algo deu errado, diga "desfaz" e tente outra abordagem.
- **Salve quando estiver feliz.** "Salva a página" ao final pra não perder o trabalho.

---

## E quando algo não funciona?

- **Pontinho verde apagado:** o Claude não consegue mexer no editor. Confere se o editor está aberto e o Atomik está ativo.
- **"Elemento não encontrado":** o ID que o Claude tentou usar não existe (ou foi removido). Peça pra ele listar a estrutura de novo.
- **"Função indisponível":** algum recurso novo do MCP encostou em uma feature que ainda não está pronta. Avisa o time pra ajustar.
- **Comportamento estranho em popup/cursor/vídeo:** essas tools são as mais novas e podem precisar de ajuste fino — reporta o que viu.
