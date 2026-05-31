# Atomik MCP — Integração com o Editor do Elementor

Este servidor MCP conecta o Claude Code ao editor do Elementor aberto no Chrome, via extensão Atomik. Quando o pontinho verde aparece no painel da Atomik, a conexão está ativa e você pode inserir componentes diretamente na página que está sendo editada.

## Quando usar as ferramentas

Sempre que o usuário pedir para construir, inserir, adicionar ou montar qualquer coisa no Elementor, use as ferramentas deste MCP. Não crie arquivos, não sugira código — insira diretamente no editor.

## Fluxo padrão

1. Chame `listar_componentes` para conhecer o catálogo completo disponível
2. Escolha os componentes adequados ao pedido do usuário
3. Use `inserir_componente` ou `inserir_multiplos_componentes` para inserir no editor

## Ferramentas disponíveis

### `listar_componentes`
Retorna todos os componentes do Atomik organizados por categoria (cards, abas, botões, textos, timelines, formulários, etc.) com a chave exata de cada um.

### `inserir_componente`
Insere um único componente no editor. Parâmetros:
- `componente`: chave do componente (ex: `card_depoimento`, `abas_underline`)
- `modo`: `dark` (padrão) ou `light`

### `inserir_multiplos_componentes`
Insere uma lista de componentes em sequência. Use quando o usuário pedir uma seção completa ou múltiplos elementos de uma vez.

### `ler_estrutura_pagina`
Lê a estrutura atual da página no editor (containers, widgets, IDs). Use quando precisar entender o que já existe antes de inserir.

## Exemplos de pedidos e como responder

**"Insere um card de depoimento"**
→ Chame `inserir_componente` com `componente: "card_depoimento"`

**"Monta uma seção de benefícios com ícones"**
→ Chame `listar_componentes`, escolha cards de ícone adequados, chame `inserir_multiplos_componentes`

**"Cria um hero com título, descrição e dois botões"**
→ Chame `inserir_multiplos_componentes` com `texto_tag_titulo_descricao`, `btn_primary_solid`, `btn_outline_amber`

## Importante

- O componente é inserido no container selecionado no editor. Se nada estiver selecionado, vai para a raiz da página.
- Modo `dark` é o padrão visual do Atomik. Use `light` apenas se o usuário pedir explicitamente.
- Nunca crie arquivos ou escreva código como resposta — sempre use as ferramentas para inserir diretamente.
