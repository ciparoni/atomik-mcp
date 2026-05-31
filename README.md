# Atomik MCP

> Construa páginas Elementor em linguagem natural, conversando com o Claude.

O **Atomik MCP** conecta o [Claude](https://claude.ai/code) ao editor do Elementor aberto no Chrome, via [extensão Atomik](https://atomik.com.br). Com ele instalado, você pede em português normal — *"cria uma seção com 3 cards de depoimento"* — e o Claude monta tudo direto no editor.

## Pré-requisitos

- **Node.js 18+** ([nodejs.org](https://nodejs.org/))
- **Claude Code** ([claude.com/claude-code](https://claude.com/claude-code))
- **Extensão Atomik** instalada no Chrome
- Editor do Elementor aberto numa página

## Instalação

```bash
npm install -g @atomik-dev/mcp
```

## Configuração

Edite o arquivo `~/.claude.json` (cria se não existir) e adicione:

```json
{
  "mcpServers": {
    "atomik": {
      "command": "atomik-mcp"
    }
  }
}
```

Reinicie o Claude Code. Pronto.

## Como testar

1. Abra uma página em edição no Elementor
2. Confira o **pontinho verde** no painel da extensão Atomik
3. No Claude Code, peça: *"insere uma seção com um título e um botão primário"*
4. Acompanhe o canvas — os componentes aparecem em segundos

## O que o MCP oferece

50+ ferramentas pro Claude usar, organizadas por categoria:

- **Componentes prontos** — biblioteca Atomik (cards, abas, botões, timelines, formulários)
- **Estrutura** — criar / editar / mover / duplicar elementos
- **Estilo** — cor, tipografia, espaçamento, sombra, border-radius
- **Kit Global** — listar / criar / editar cores e tipografia do tema
- **Animação** — letras em cascata, revelação por linhas, transições entre seções
- **Polish** — popups, vídeos especiais, cursores customizados, snippets CSS/JS
- **Figma** — sincronizar cores e tipografia diretas do Figma
- **Análise em massa** — varrer fontes/cores/links/imagens e atualizar tudo de uma vez

## Como atualizar

```bash
npm update -g @atomik-dev/mcp
```

## Suporte

Bug ou dúvida: abra uma [issue](https://github.com/ciparoni/atomik-mcp/issues).

## Licença

[MIT](./LICENSE) — Othon Ciparoni
