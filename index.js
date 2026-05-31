#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { WebSocketServer } from 'ws';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { execSync } from 'child_process';

const WS_PORT = 3847;
const CMD_TIMEOUT_MS = 15000;
const LOCK_FILE = '/tmp/atomik-mcp.lock';

function killOldInstance() {
  if (!existsSync(LOCK_FILE)) return;
  try {
    const pid = parseInt(readFileSync(LOCK_FILE, 'utf8').trim(), 10);
    if (pid && pid !== process.pid) {
      try { execSync(`kill ${pid} 2>/dev/null || true`); } catch {}
      const end = Date.now() + 800;
      while (Date.now() < end) {}
    }
  } catch {}
}

killOldInstance();
writeFileSync(LOCK_FILE, String(process.pid));
process.on('exit', () => { try { unlinkSync(LOCK_FILE); } catch {} });

const CATALOG = {
  cards: {
    label: 'Cards',
    componentes: [
      { chave: 'card_imagem_lado',               descricao: 'Card com imagem ao lado e texto' },
      { chave: 'card_imagem_vazada_lado',         descricao: 'Card com imagem em vazado ao lado' },
      { chave: 'card_imagem_topo',               descricao: 'Card com imagem no topo' },
      { chave: 'card_imagem_fundo',              descricao: 'Card com imagem de fundo' },
      { chave: 'card_depoimento',                descricao: 'Card de depoimento / testemunho' },
      { chave: 'card_icone_topo',                descricao: 'Card com ícone no topo' },
      { chave: 'card_icone_simples_linha',        descricao: 'Card com ícone simples em linha' },
      { chave: 'card_icone_simples_grande',       descricao: 'Card com ícone grande' },
      { chave: 'card_icone_redondo_linha',        descricao: 'Card com ícone redondo em linha' },
      { chave: 'card_icone_quadrado_linha',       descricao: 'Card com ícone quadrado em linha' },
      { chave: 'card_icone_redondo_coluna',       descricao: 'Card com ícone redondo em coluna' },
      { chave: 'card_icone_quadrado_coluna',      descricao: 'Card com ícone quadrado em coluna' },
      { chave: 'card_mini_icone_quadrado_coluna', descricao: 'Card mini com ícone quadrado em coluna' },
      { chave: 'card_icone_redondo_coluna_vazado',descricao: 'Card com ícone redondo vazado em coluna' },
      { chave: 'card_tag_apoio_titulo_descricao', descricao: 'Card com tag, título e descrição' },
      { chave: 'card_tag_imagem_fundo',           descricao: 'Card com tag e imagem de fundo' },
      { chave: 'card_icone_titulo',               descricao: 'Card com ícone e título' },
    ],
  },
  abas: {
    label: 'Abas (Tabs)',
    componentes: [
      { chave: 'abas_underline',  descricao: 'Abas com sublinhado' },
      { chave: 'abas_pill',       descricao: 'Abas em formato pílula' },
      { chave: 'abas_capsula',    descricao: 'Abas em cápsula' },
      { chave: 'abas_vertical',   descricao: 'Abas na vertical' },
      { chave: 'abas_cards',      descricao: 'Abas em formato de cards' },
      { chave: 'abas_expansivo',  descricao: 'Abas com expansão' },
      { chave: 'abas_etapas',     descricao: 'Abas em formato de etapas' },
    ],
  },
  sanfonas: {
    label: 'Sanfonas e Acordeões',
    componentes: [
      { chave: 'sanfona_divisor',    descricao: 'Sanfona com divisor' },
      { chave: 'acordeao_divisor',   descricao: 'Acordeão com divisor' },
      { chave: 'sanfona_card',       descricao: 'Sanfona em card' },
      { chave: 'acordeao_card',      descricao: 'Acordeão em card' },
      { chave: 'sanfona_bloco',      descricao: 'Sanfona em bloco' },
      { chave: 'acordeao_bloco',     descricao: 'Acordeão em bloco' },
      { chave: 'sanfona_flutuante',  descricao: 'Sanfona flutuante' },
      { chave: 'acordeao_flutuante', descricao: 'Acordeão flutuante' },
    ],
  },
  botoes: {
    label: 'Botões',
    componentes: [
      { chave: 'btn_primary_solid',       descricao: 'Botão primário sólido' },
      { chave: 'btn_pill_solid',          descricao: 'Botão pílula sólido' },
      { chave: 'btn_outline_amber',       descricao: 'Botão outline âmbar' },
      { chave: 'btn_ghost',               descricao: 'Botão ghost transparente' },
      { chave: 'btn_pill_gradient',       descricao: 'Botão pílula com gradiente' },
      { chave: 'btn_3d',                  descricao: 'Botão com efeito 3D' },
      { chave: 'btn_3d_brilho',           descricao: 'Botão 3D com brilho' },
      { chave: 'btn_com_seta_1',          descricao: 'Botão com seta (estilo 1)' },
      { chave: 'btn_com_seta_2',          descricao: 'Botão com seta (estilo 2)' },
      { chave: 'btn_seta_animada_hover',  descricao: 'Botão com seta animada no hover' },
      { chave: 'btn_texto_duplo',         descricao: 'Botão com texto duplo' },
      { chave: 'btn_brilho_hover',        descricao: 'Botão com brilho no hover' },
      { chave: 'btn_brilho_bordas',       descricao: 'Botão com brilho nas bordas' },
      { chave: 'btn_brilho_dinamico',     descricao: 'Botão com brilho dinâmico' },
      { chave: 'btn_mascara_1',           descricao: 'Botão com máscara (estilo 1)' },
      { chave: 'btn_mascara_2',           descricao: 'Botão com máscara (estilo 2)' },
      { chave: 'btn_borda_degrade',       descricao: 'Botão com borda degradê' },
      { chave: 'btn_concavo',             descricao: 'Botão côncavo' },
      { chave: 'btn_primario_secundario', descricao: 'Par de botões primário + secundário' },
    ],
  },
  textos: {
    label: 'Blocos de Texto',
    componentes: [
      { chave: 'texto_titulo',                              descricao: 'Título simples' },
      { chave: 'texto_titulo_descricao',                   descricao: 'Título com descrição' },
      { chave: 'texto_tag_titulo',                         descricao: 'Tag + título' },
      { chave: 'texto_tag_titulo_descricao',               descricao: 'Tag + título + descrição' },
      { chave: 'texto_titulo_centralizado',                descricao: 'Título centralizado' },
      { chave: 'texto_titulo_descricao_centralizado',      descricao: 'Título + descrição centralizados' },
      { chave: 'texto_tag_titulo_centralizado',            descricao: 'Tag + título centralizados' },
      { chave: 'texto_tag_titulo_descricao_centralizado',  descricao: 'Tag + título + descrição centralizados' },
      { chave: 'texto_h1',                                 descricao: 'Heading H1' },
      { chave: 'texto_h2',                                 descricao: 'Heading H2' },
      { chave: 'texto_h3',                                 descricao: 'Heading H3' },
      { chave: 'texto_h4',                                 descricao: 'Heading H4' },
      { chave: 'texto_paragrafo',                          descricao: 'Parágrafo de texto' },
      { chave: 'texto_subtitulo',                          descricao: 'Subtítulo' },
      { chave: 'texto_small',                              descricao: 'Texto pequeno' },
      { chave: 'texto_caption',                            descricao: 'Legenda / caption' },
    ],
  },
  tags: {
    label: 'Tags e Badges',
    componentes: [
      { chave: 'tag_pill',         descricao: 'Tag em pílula' },
      { chave: 'tag_texto',        descricao: 'Tag de texto simples' },
      { chave: 'tag_pill_icone',   descricao: 'Tag pílula com ícone' },
      { chave: 'tag_outline_icone',descricao: 'Tag outline com ícone' },
      { chave: 'tag_outline',      descricao: 'Tag outline' },
      { chave: 'tag_pill_casual',  descricao: 'Tag pílula casual' },
    ],
  },
  cards_numerados: {
    label: 'Cards Numerados',
    componentes: [
      { chave: 'card_numerado_redondo_outline_coluna',  descricao: 'Numerado redondo outline vertical' },
      { chave: 'card_numerado_quadrado_outline_coluna', descricao: 'Numerado quadrado outline vertical' },
      { chave: 'card_numerado_redondo_outline_linha',   descricao: 'Numerado redondo outline horizontal' },
      { chave: 'card_numerado_quadrado_outline_linha',  descricao: 'Numerado quadrado outline horizontal' },
      { chave: 'card_numerado_redondo_coluna',          descricao: 'Numerado redondo vertical' },
      { chave: 'card_numerado_quadrado_coluna',         descricao: 'Numerado quadrado vertical' },
      { chave: 'card_numerado_redondo_linha',           descricao: 'Numerado redondo horizontal' },
      { chave: 'card_numerado_quadrado_linha',          descricao: 'Numerado quadrado horizontal' },
      { chave: 'card_numerado_divisor_numero',          descricao: 'Numerado com divisor' },
      { chave: 'card_numerado_simples',                 descricao: 'Numerado simples' },
      { chave: 'card_numerado_ghost',                   descricao: 'Numerado ghost' },
      { chave: 'card_numerado_badge',                   descricao: 'Numerado badge' },
    ],
  },
  timelines: {
    label: 'Timelines',
    componentes: [
      { chave: 'timeline_horizontal_simples',                descricao: 'Timeline horizontal simples' },
      { chave: 'timeline_horizontal_icone',                  descricao: 'Timeline horizontal com ícone' },
      { chave: 'timeline_horizontal_numerada',               descricao: 'Timeline horizontal numerada' },
      { chave: 'timeline_horizontal_linha_dupla_icone',      descricao: 'Timeline horizontal linha dupla com ícone' },
      { chave: 'timeline_horizontal_linha_dupla_numerada',   descricao: 'Timeline horizontal linha dupla numerada' },
      { chave: 'timeline_vertical_simples',                  descricao: 'Timeline vertical simples' },
      { chave: 'timeline_vertical_icone',                    descricao: 'Timeline vertical com ícone' },
      { chave: 'timeline_vertical_numerada',                 descricao: 'Timeline vertical numerada' },
      { chave: 'timeline_vertical_linha_dupla_icone',        descricao: 'Timeline vertical linha dupla com ícone' },
      { chave: 'timeline_vertical_linha_dupla_numerada',     descricao: 'Timeline vertical linha dupla numerada' },
      { chave: 'timeline_vertical_alternada',                descricao: 'Timeline vertical alternada' },
      { chave: 'timeline_vertical_centralizada',             descricao: 'Timeline vertical centralizada' },
      { chave: 'timeline_trilha',                            descricao: 'Timeline em trilha / roadmap' },
      { chave: 'timeline_vertical_alternada_prog',           descricao: 'Timeline vertical alternada progressiva' },
      { chave: 'timeline_vertical_alternada_prog_brilho',    descricao: 'Timeline vertical alternada progressiva com brilho' },
    ],
  },
  tabelas_preco: {
    label: 'Tabelas de Preço',
    componentes: [
      { chave: 'tabela_preco_simples',      descricao: 'Tabela de preço simples (1 plano)' },
      { chave: 'tabela_preco_infoproduto',  descricao: 'Tabela de preço para infoproduto' },
      { chave: 'tabela_preco_2_planos',     descricao: 'Tabela de preço com 2 planos' },
      { chave: 'tabela_preco_3_planos',     descricao: 'Tabela de preço com 3 planos' },
      { chave: 'tabela_preco_horizontal',   descricao: 'Tabela de preço horizontal' },
    ],
  },
  formularios: {
    label: 'Formulários',
    componentes: [
      { chave: 'form_simples',       descricao: 'Formulário simples' },
      { chave: 'form_inline',        descricao: 'Formulário em linha' },
      { chave: 'form_botao_interno', descricao: 'Formulário com botão interno' },
      { chave: 'form_multistep',     descricao: 'Formulário multi-etapas' },
      { chave: 'form_floating',      descricao: 'Formulário com labels flutuantes' },
      { chave: 'form_quiz',          descricao: 'Formulário estilo quiz' },
    ],
  },
  avatares: {
    label: 'Avatares',
    componentes: [
      { chave: 'avatar_redondo_linha',      descricao: 'Avatar redondo em linha' },
      { chave: 'avatar_quadrado_linha',     descricao: 'Avatar quadrado em linha' },
      { chave: 'avatar_botao',              descricao: 'Avatar com botão' },
      { chave: 'avatar_redondo_coluna',     descricao: 'Avatar redondo em coluna' },
      { chave: 'avatar_quadrado_coluna',    descricao: 'Avatar quadrado em coluna' },
      { chave: 'avatar_redondo_outline',    descricao: 'Avatar redondo outline' },
      { chave: 'avatar_prova_social',       descricao: 'Grupo de avatares (prova social)' },
      { chave: 'avatar_prova_social_texto', descricao: 'Prova social com texto' },
    ],
  },
};

let wssRef = null;
const pending = new Map();

function log(level, msg) {
  const ts = new Date().toISOString();
  process.stderr.write(`[${ts}] [${level}] ${msg}\n`);
}

function getActiveClient() {
  if (!wssRef) return null;
  for (const c of wssRef.clients) {
    if (c.readyState === 1) return c;
  }
  return null;
}

function startWebSocketServer(attempt = 1) {
  const wss = new WebSocketServer({ port: WS_PORT });
  wssRef = wss;

  wss.on('listening', () => {
    log('INFO', `WebSocket pronto na porta ${WS_PORT}.`);
  });

  wss.on('connection', (ws) => {
    log('INFO', 'Editor conectado.');

    ws.on('message', (raw) => {
      let msg;
      try { msg = JSON.parse(raw); } catch (e) {
        log('WARN', `Mensagem inválida recebida: ${e.message}`);
        return;
      }
      const { id, result, error } = msg;
      if (!id || !pending.has(id)) return;
      const { resolve, reject, timer, tool } = pending.get(id);
      clearTimeout(timer);
      pending.delete(id);
      if (error) {
        log('WARN', `[${id}] Erro na tool "${tool}": ${error}`);
        reject(new Error(error));
      } else {
        log('INFO', `[${id}] Tool "${tool}" concluída.`);
        resolve(result);
      }
    });

    ws.on('close', () => {
      log('INFO', 'Cliente desconectado.');
    });
  });

  wss.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && attempt <= 3) {
      log('WARN', `Porta ${WS_PORT} ocupada, tentando novamente em 3s... (tentativa ${attempt}/3)`);
      setTimeout(() => startWebSocketServer(attempt + 1), 3000);
    } else {
      log('ERROR', `Erro WebSocket: ${err.message}`);
    }
  });
}

startWebSocketServer();

function sendCommand(tool, params) {
  return new Promise((resolve, reject) => {
    const activeClient = getActiveClient();
    if (!activeClient) {
      reject(new Error(
        'Editor do Elementor não conectado. Abra o editor e verifique se o pontinho verde aparece no painel do Atomik.'
      ));
      return;
    }
    const id = randomUUID();
    log('INFO', `[${id}] Enviando tool "${tool}".`);
    const timer = setTimeout(() => {
      pending.delete(id);
      log('WARN', `[${id}] Timeout na tool "${tool}" após ${CMD_TIMEOUT_MS}ms.`);
      reject(new Error('O editor não respondeu a tempo. Verifique se a página do Elementor está aberta.'));
    }, CMD_TIMEOUT_MS);
    pending.set(id, { resolve, reject, timer, tool });
    activeClient.send(JSON.stringify({ id, tool, params }));
  });
}

function toolResult(text) {
  return { content: [{ type: 'text', text }] };
}

function toolError(err) {
  return { isError: true, content: [{ type: 'text', text: err.message }] };
}

const server = new McpServer({ name: 'atomik', version: '1.0.0' });

server.tool(
  'listar_componentes',
  'Lista todos os componentes disponíveis no Atomik organizados por categoria, com a chave exata para inserção.',
  {},
  { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
  async () => toolResult(JSON.stringify(CATALOG, null, 2))
);

server.tool(
  'inserir_componente',
  'Insere um componente do Atomik no editor do Elementor. O componente é inserido no container atualmente selecionado (ou na raiz da página se nada estiver selecionado).',
  {
    componente: z.string().describe(
      'Chave do componente conforme retornado por listar_componentes (ex: card_imagem_lado, abas_underline, btn_3d)'
    ),
    modo: z.enum(['dark', 'light']).optional().describe('Variante de cor. Padrão: dark'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async ({ componente, modo = 'dark' }) => {
    try {
      const result = await sendCommand('inserir_componente', { componente, modo });
      return toolResult(result?.mensagem ?? `Componente "${componente}" inserido.`);
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'ler_estrutura_pagina',
  'Lê a estrutura atual da página aberta no editor do Elementor (containers, seções, widgets e seus IDs).',
  {},
  { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
  async () => {
    try {
      const result = await sendCommand('ler_estrutura_pagina', {});
      return toolResult(JSON.stringify(result, null, 2));
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'inserir_multiplos_componentes',
  'Insere uma sequência de componentes no editor em ordem, um após o outro. Útil para montar seções completas.',
  {
    componentes: z.array(z.object({
      componente: z.string().describe('Chave do componente'),
      modo: z.enum(['dark', 'light']).optional(),
    })).describe('Lista de componentes a inserir em ordem'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async ({ componentes }) => {
    const resultados = [];
    for (const item of componentes) {
      try {
        const result = await sendCommand('inserir_componente', {
          componente: item.componente,
          modo: item.modo ?? 'dark',
        });
        resultados.push(result?.mensagem ?? `"${item.componente}" inserido.`);
      } catch (err) {
        resultados.push(`Erro em "${item.componente}": ${err.message}`);
        return { isError: true, content: [{ type: 'text', text: resultados.join('\n') }] };
      }
    }
    return toolResult(resultados.join('\n'));
  }
);

server.tool(
  'ler_elemento',
  'Lê o JSON completo de um elemento existente no editor (settings, styles, widgetType, elementos filhos). Use para inspecionar um nó antes de editar.',
  {
    id: z.string().describe('ID do elemento (7 chars hex, ex: a1b2c3d)'),
  },
  { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
  async ({ id }) => {
    try {
      const result = await sendCommand('ler_elemento', { id });
      return toolResult(JSON.stringify(result?.elemento ?? {}, null, 2));
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'criar_elemento',
  'Cria um elemento arbitrário (container ou widget V4) dentro de um pai específico. O model deve seguir o schema V4 completo (elType, widgetType, settings, styles, elements). Retorna o ID do elemento criado.',
  {
    parentId: z.string().optional().describe('ID do container pai. Omitir para inserir na raiz da página.'),
    model: z.any().describe('JSON completo do elemento conforme schema V4 (id, elType, widgetType, settings, styles, elements)'),
    at: z.number().optional().describe('Índice de inserção dentro do pai. -1 = final (padrão).'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async ({ parentId, model, at }) => {
    try {
      const result = await sendCommand('criar_elemento', { parentId, model, at });
      return toolResult(result?.mensagem ?? ('Elemento criado.' + (result?.id ? ' ID: ' + result.id : '')));
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'editar_elemento',
  'Edita settings e/ou styles de um elemento existente. settings atualiza conteúdo (texto, link, imagem). styles faz merge de variantes por breakpoint/state sem apagar as demais.',
  {
    id: z.string().describe('ID do elemento a editar'),
    settings: z.any().optional().describe('Objeto de settings a mesclar (ex: { title: { $$type: "html", value: "Novo título" } })'),
    styles: z.any().optional().describe('Objeto de styles a mesclar por classId → variants (ex: { "e-abc-def": { variants: [{ meta: { breakpoint: "desktop", state: null }, props: { color: { $$type: "color", value: "#fff" } }, custom_css: null }] } })'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
  async ({ id, settings, styles }) => {
    try {
      const result = await sendCommand('editar_elemento', { id, settings, styles });
      return toolResult(result?.mensagem ?? 'Elemento atualizado.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'remover_elemento',
  'Remove um elemento existente do editor pelo ID.',
  {
    id: z.string().describe('ID do elemento a remover'),
  },
  { readOnlyHint: false, destructiveHint: true, idempotentHint: true },
  async ({ id }) => {
    try {
      const result = await sendCommand('remover_elemento', { id });
      return toolResult(result?.mensagem ?? 'Elemento removido.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'inserir_luz_fundo',
  'Insere uma luz de fundo (glow desfocado) dentro de um container existente. Cria profundidade e ambiência visual nas seções. Sempre inserida como primeiro filho (atrás do conteúdo).',
  {
    containerId: z.string().describe('ID do container pai onde a luz será inserida'),
    color: z.string().optional().describe('Cor hex da luz. Padrão: #ffffff'),
    opacity: z.number().optional().describe('Opacidade 0-100. Padrão: 20'),
    width: z.number().optional().describe('Largura em px. Padrão: 700'),
    height: z.number().optional().describe('Altura em px. Padrão: 700'),
    blur: z.number().optional().describe('Blur em px. Padrão: 220'),
    preset: z.enum(['tl','tc','tr','ml','mc','mr','bl','bc','br']).optional().describe('Posição: tl=top-left, tc=top-center, tr=top-right, ml=mid-left, mc=center, mr=mid-right, bl=bot-left, bc=bot-center, br=bot-right. Padrão: mc'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async ({ containerId, color, opacity, width, height, blur, preset }) => {
    try {
      const result = await sendCommand('inserir_luz_fundo', { containerId, color, opacity, width, height, blur, preset });
      return toolResult(result?.mensagem ?? 'Luz de fundo inserida.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'inserir_pattern',
  'Insere um pattern decorativo (padrão geométrico repetido) atrás do conteúdo de um container. Adiciona textura sutil às seções.',
  {
    containerId: z.string().describe('ID do container pai onde o pattern será inserido'),
    family: z.enum(['diagonal', 'dots', 'grid', 'cross']).optional().describe('Tipo de padrão. Padrão: diagonal'),
    opacity: z.number().optional().describe('Opacidade 0-100. Padrão: 8'),
    blend: z.string().optional().describe('Modo de blend CSS. Padrão: normal'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async ({ containerId, family, opacity, blend }) => {
    try {
      const result = await sendCommand('inserir_pattern', { containerId, family, opacity, blend });
      return toolResult(result?.mensagem ?? 'Pattern inserida.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'obter_selecao_atual',
  'Retorna o elemento atualmente selecionado no editor (id, elType, widgetType, parentId). Use no início de qualquer fluxo para descobrir onde o usuário está trabalhando.',
  {},
  { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
  async () => {
    try {
      const result = await sendCommand('obter_selecao_atual', {});
      return toolResult(JSON.stringify(result, null, 2));
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'selecionar_elemento',
  'Seleciona programaticamente um elemento no editor pelo ID. Necessário antes de várias actions do sidepanel que dependem de seleção.',
  {
    id: z.string().describe('ID do elemento a selecionar'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
  async ({ id }) => {
    try {
      const result = await sendCommand('selecionar_elemento', { id });
      return toolResult(result?.mensagem ?? 'Elemento selecionado.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'limpar_selecao',
  'Limpa a seleção atual do editor. Inserções subsequentes irão para a raiz da página.',
  {},
  { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
  async () => {
    try {
      const result = await sendCommand('limpar_selecao', {});
      return toolResult(result?.mensagem ?? 'Seleção limpa.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'buscar_elementos',
  'Busca elementos na página por elType, widgetType, texto contido nas settings, ou classe. Útil para encontrar o que editar/duplicar sem precisar ler a página inteira.',
  {
    elType: z.string().optional().describe('Filtrar por elType (ex: "e-flexbox", "widget")'),
    widgetType: z.string().optional().describe('Filtrar por widgetType (ex: "e-heading", "e-button", "e-image")'),
    contemTexto: z.string().optional().describe('Texto que deve aparecer nas settings do elemento (busca case-insensitive)'),
    classe: z.string().optional().describe('Filtrar por classId ou label de classe global'),
    limit: z.number().optional().describe('Máximo de resultados. Padrão: 50'),
  },
  { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
  async (params) => {
    try {
      const result = await sendCommand('buscar_elementos', params);
      return toolResult(JSON.stringify(result, null, 2));
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'duplicar_elemento',
  'Duplica um elemento existente in-place (vira irmão imediato do original). Mais barato que criar_elemento quando você só quer outra cópia.',
  {
    id: z.string().describe('ID do elemento a duplicar'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async ({ id }) => {
    try {
      const result = await sendCommand('duplicar_elemento', { id });
      return toolResult(result?.mensagem ?? 'Elemento duplicado.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'mover_elemento',
  'Move um elemento para dentro de outro container, em uma posição específica. ATENÇÃO: $e.run move é implementado como delete+create; refs ao ID antigo ficam stale.',
  {
    id: z.string().describe('ID do elemento a mover'),
    novoPaiId: z.string().describe('ID do container destino'),
    at: z.number().optional().describe('Posição dentro do destino. -1 = final (padrão).'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async ({ id, novoPaiId, at }) => {
    try {
      const result = await sendCommand('mover_elemento', { id, novoPaiId, at });
      return toolResult(result?.mensagem ?? 'Elemento movido.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'desfazer',
  'Desfaz a última ação no editor (equivalente a Cmd+Z).',
  {},
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async () => {
    try {
      const result = await sendCommand('desfazer', {});
      return toolResult(result?.mensagem ?? 'Ação desfeita.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'refazer',
  'Refaz a última ação desfeita (equivalente a Cmd+Shift+Z).',
  {},
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async () => {
    try {
      const result = await sendCommand('refazer', {});
      return toolResult(result?.mensagem ?? 'Ação refeita.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'salvar_pagina',
  'Salva a página atual no editor do Elementor (auto-save).',
  {},
  { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
  async () => {
    try {
      const result = await sendCommand('salvar_pagina', {});
      return toolResult(result?.mensagem ?? 'Página salva.');
    } catch (err) { return toolError(err); }
  }
);

async function aplicarEstilo({ id, props = {}, custom_css = null, breakpoint = 'desktop', state = null, classId }) {
  return sendCommand('aplicar_estilo', { id, props, custom_css, breakpoint, state, classId });
}

server.tool(
  'definir_cor',
  'Define uma cor em um elemento (color, background-color, border-color, etc). Use valor hex/rgba ou um colorId do kit global. Cria a classe local automaticamente se não existir.',
  {
    id: z.string().describe('ID do elemento'),
    propriedade: z.enum(['color', 'background-color', 'border-color', 'outline-color']).describe('Qual propriedade CSS receberá a cor'),
    valor: z.string().describe('Valor hex (#ff0000), rgba, ou ID de cor global (ex: globals/colors?id=primary)'),
    breakpoint: z.enum(['desktop', 'tablet', 'mobile']).optional().describe('Padrão: desktop'),
    state: z.enum(['hover', 'focus', 'active']).nullable().optional().describe('Estado pseudo (hover/focus/active). Omitir para estado base.'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
  async ({ id, propriedade, valor, breakpoint = 'desktop', state = null }) => {
    try {
      const colorObj = { $$type: 'color', value: valor };
      let props;
      if (propriedade === 'background-color') {
        props = {
          background: {
            $$type: 'background',
            value: {
              color: colorObj,
              clip: { $$type: 'string', value: 'border-box' },
            },
          },
        };
      } else {
        props = { [propriedade]: colorObj };
      }
      const result = await aplicarEstilo({ id, props, breakpoint, state });
      return toolResult(result?.mensagem ?? 'Cor aplicada.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'definir_tipografia',
  'Define propriedades de tipografia em um elemento (família, peso, tamanho, line-height, letter-spacing). Cada campo é opcional — só altera o que for passado.',
  {
    id: z.string().describe('ID do elemento'),
    familia: z.string().optional().describe('Font-family (ex: "Cabin", "Plus Jakarta Sans")'),
    peso: z.number().optional().describe('Font-weight (100-900)'),
    tamanho: z.number().optional().describe('Font-size em px'),
    lineHeight: z.number().optional().describe('Line-height em em (ex: 1.4)'),
    letterSpacing: z.number().optional().describe('Letter-spacing em em (ex: -0.04 para -4%)'),
    breakpoint: z.enum(['desktop', 'tablet', 'mobile']).optional().describe('Padrão: desktop'),
    state: z.enum(['hover', 'focus', 'active']).nullable().optional(),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
  async ({ id, familia, peso, tamanho, lineHeight, letterSpacing, breakpoint = 'desktop', state = null }) => {
    try {
      const props = {};
      if (familia) props['font-family'] = { $$type: 'string', value: familia };
      if (peso !== undefined) props['font-weight'] = { $$type: 'string', value: String(peso) };
      if (tamanho !== undefined) props['font-size'] = { $$type: 'size', value: { size: tamanho, unit: 'px' } };
      if (lineHeight !== undefined) props['line-height'] = { $$type: 'size', value: { size: lineHeight, unit: 'em' } };
      if (letterSpacing !== undefined) props['letter-spacing'] = { $$type: 'size', value: { size: letterSpacing, unit: 'em' } };
      const result = await aplicarEstilo({ id, props, breakpoint, state });
      return toolResult(result?.mensagem ?? 'Tipografia aplicada.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'definir_espacamento',
  'Define margin e/ou padding (4 lados) em um elemento. Use objetos { top, right, bottom, left } em px.',
  {
    id: z.string().describe('ID do elemento'),
    margin: z.object({
      top: z.number().optional(),
      right: z.number().optional(),
      bottom: z.number().optional(),
      left: z.number().optional(),
    }).optional().describe('Margin em px. Lados omitidos viram 0.'),
    padding: z.object({
      top: z.number().optional(),
      right: z.number().optional(),
      bottom: z.number().optional(),
      left: z.number().optional(),
    }).optional().describe('Padding em px. Lados omitidos viram 0.'),
    breakpoint: z.enum(['desktop', 'tablet', 'mobile']).optional(),
    state: z.enum(['hover', 'focus', 'active']).nullable().optional(),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
  async ({ id, margin, padding, breakpoint = 'desktop', state = null }) => {
    try {
      const dim = (v = {}) => ({
        $$type: 'dimensions',
        value: {
          'block-start': { $$type: 'size', value: { size: v.top ?? 0, unit: 'px' } },
          'inline-end':   { $$type: 'size', value: { size: v.right ?? 0, unit: 'px' } },
          'block-end':    { $$type: 'size', value: { size: v.bottom ?? 0, unit: 'px' } },
          'inline-start': { $$type: 'size', value: { size: v.left ?? 0, unit: 'px' } },
        },
      });
      const props = {};
      if (margin) props['margin'] = dim(margin);
      if (padding) props['padding'] = dim(padding);
      const result = await aplicarEstilo({ id, props, breakpoint, state });
      return toolResult(result?.mensagem ?? 'Espaçamento aplicado.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'definir_largura',
  'Define a largura de um elemento usando a fórmula do grid Atomik: calc((100% - (cols-1)*gutter) / cols * span + (span-1)*gutter). Use isso ao invés de px ou % fixo — garante responsividade alinhada ao grid.',
  {
    id: z.string().describe('ID do elemento'),
    cols: z.number().describe('Total de colunas do grid (ex: 12)'),
    gutter: z.number().describe('Gutter entre colunas em px (ex: 20)'),
    span: z.number().describe('Quantas colunas o elemento deve ocupar (ex: 4)'),
    breakpoint: z.enum(['desktop', 'tablet', 'mobile']).optional(),
    state: z.enum(['hover', 'focus', 'active']).nullable().optional(),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
  async ({ id, cols, gutter, span, breakpoint = 'desktop', state = null }) => {
    try {
      const formula = `calc((100% - ${cols - 1} * ${gutter}px) / ${cols} * ${span} + ${span - 1} * ${gutter}px)`;
      const props = { width: { $$type: 'size', value: { size: formula, unit: 'custom' } } };
      const result = await aplicarEstilo({ id, props, breakpoint, state });
      return toolResult(result?.mensagem ?? 'Largura aplicada.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'definir_sombra',
  'Aplica box-shadow em um elemento. Passe o valor CSS completo (ex: "0 10px 40px rgba(0,0,0,.3)"). Aplica via custom_css; lembre-se que custom_css não cascateia por breakpoint.',
  {
    id: z.string().describe('ID do elemento'),
    cssBoxShadow: z.string().describe('Valor completo do box-shadow (ex: "0 10px 40px rgba(0,0,0,.3)")'),
    breakpoint: z.enum(['desktop', 'tablet', 'mobile']).optional(),
    state: z.enum(['hover', 'focus', 'active']).nullable().optional(),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
  async ({ id, cssBoxShadow, breakpoint = 'desktop', state = null }) => {
    try {
      const custom_css = { raw: `box-shadow: ${cssBoxShadow};` };
      const result = await aplicarEstilo({ id, props: {}, custom_css, breakpoint, state });
      return toolResult(result?.mensagem ?? 'Sombra aplicada.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'listar_kit_cores',
  'Lista todas as cores do Kit Global (V3 system_colors + V4 variables). Retorna { v3: [{id, value, title}], v4: [{id, value, label}] }. Use antes de vincular uma cor global ou pra saber o que já existe.',
  {},
  { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
  async () => {
    try {
      const result = await sendCommand('listar_kit_cores', {});
      return toolResult(JSON.stringify(result, null, 2));
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'criar_cor_global',
  'Cria uma nova cor global no Kit. Use para registrar cores da marca antes de aplicá-las em elementos. Padrão é V4.',
  {
    label: z.string().describe('Nome amigável da cor (ex: "Primária", "Honey")'),
    valor: z.string().describe('Valor hex (#ffc107) ou rgba'),
    tipo: z.enum(['v3', 'v4']).optional().describe('V3 = system_colors antigos; V4 = variables novas. Padrão: v4'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async ({ label, valor, tipo }) => {
    try {
      const result = await sendCommand('criar_cor_global', { label, valor, tipo });
      return toolResult(JSON.stringify(result, null, 2));
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'editar_cor_global',
  'Edita o valor (e/ou label) de uma cor global existente. Mudanças se propagam para todos os elementos vinculados.',
  {
    id: z.string().describe('ID da cor global'),
    valor: z.string().optional().describe('Novo valor hex/rgba'),
    label: z.string().optional().describe('Novo nome'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
  async ({ id, valor, label }) => {
    try {
      const result = await sendCommand('editar_cor_global', { id, valor, label });
      return toolResult(result?.mensagem ?? 'Cor editada.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'listar_kit_tipografia',
  'Lista os estilos de texto do Kit Global (família, peso, tamanho).',
  {},
  { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
  async () => {
    try {
      const result = await sendCommand('listar_kit_tipografia', {});
      return toolResult(JSON.stringify(result, null, 2));
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'varrer_pagina',
  'Mapeia todas as ocorrências de um tipo de propriedade na página (fontes, pesos, tamanhos, cores, links, imagens, campos de formulário). Use antes de fazer mudanças em massa para entender o que está em uso.',
  {
    tipo: z.enum(['fontes', 'pesos', 'tamanhos', 'cores', 'links', 'imagens', 'formularios']).describe('Tipo de propriedade a varrer'),
  },
  { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
  async ({ tipo }) => {
    try {
      const result = await sendCommand('varrer_pagina', { tipo });
      return toolResult(JSON.stringify(result, null, 2));
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'atualizar_cores_em_massa',
  'Troca uma cor por outra em todos os lugares da página. Use mapping {sourceHex: targetHex} ou {globalColorId: targetHex}. Combine com varrer_pagina("cores") primeiro.',
  {
    mapping: z.record(z.string(), z.string()).describe('Mapa de substituição: chave = hex/globalId atual, valor = novo hex'),
    globalHexes: z.record(z.string(), z.string()).optional().describe('Para cada globalId, o hex efetivo (opcional, ajuda em alguns fluxos V3)'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async ({ mapping, globalHexes }) => {
    try {
      const result = await sendCommand('atualizar_cores_em_massa', { mapping, globalHexes });
      return toolResult(result?.mensagem ?? 'Cores atualizadas.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'atualizar_peso_em_massa',
  'Troca o font-weight de todos os elementos que usam uma determinada combinação família + peso. Ex: trocar todo Inter 400 por Cabin 500.',
  {
    targetFont: z.string().describe('Família de fonte alvo (ex: "Inter")'),
    targetWeight: z.union([z.string(), z.number()]).describe('Peso atual (ex: 400)'),
    newWeight: z.union([z.string(), z.number()]).describe('Novo peso (ex: 500)'),
    isGlobal: z.boolean().optional().describe('true para alterar via Kit Global, false para alterar nos widgets diretamente'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async (params) => {
    try {
      const result = await sendCommand('atualizar_peso_em_massa', params);
      return toolResult(result?.mensagem ?? 'Pesos atualizados.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'atualizar_tamanho_em_massa',
  'Atualiza font-size em massa para um alvo específico. newValues aceita { desktop, tablet, mobile }.',
  {
    target: z.object({}).passthrough().describe('Alvo da varredura (do retorno de varrer_pagina("tamanhos"))'),
    newValues: z.object({
      desktop: z.number().optional(),
      tablet: z.number().optional(),
      mobile: z.number().optional(),
    }).describe('Novos tamanhos por breakpoint em px'),
    isGlobal: z.boolean().optional(),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async (params) => {
    try {
      const result = await sendCommand('atualizar_tamanho_em_massa', params);
      return toolResult(result?.mensagem ?? 'Tamanhos atualizados.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'substituir_link_em_massa',
  'Substitui todas as ocorrências de uma URL por outra na página (href de botões, imagens, links).',
  {
    oldUrl: z.string().describe('URL atual'),
    newUrl: z.string().describe('Nova URL'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async ({ oldUrl, newUrl }) => {
    try {
      const result = await sendCommand('substituir_link_em_massa', { oldUrl, newUrl });
      return toolResult(result?.mensagem ?? 'Links substituídos.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'figma_aplicar_cores',
  'Aplica as cores extraídas de um arquivo Figma ao Kit Global do Elementor (V3 + V4). Recebe a lista de cores e o mapeamento para os slots do Kit.',
  {
    colors: z.array(z.object({}).passthrough()).describe('Array de cores extraídas do Figma (variables/styles)'),
    systemMapping: z.record(z.string(), z.string()).optional().describe('Mapa { slotKitId: figmaColorId } para forçar onde cada cor vai. Vazio = auto.'),
    mode: z.enum(['replace', 'merge']).optional().describe('replace = sobrescreve, merge = adiciona sem apagar. Padrão: replace'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async (params) => {
    try {
      const result = await sendCommand('figma_aplicar_cores', params);
      return toolResult(result?.mensagem ?? 'Cores Figma aplicadas.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'figma_aplicar_tipografia',
  'Aplica os Text Styles do Figma ao Kit de Tipografia do Elementor.',
  {
    typography: z.array(z.object({}).passthrough()).describe('Array de Text Styles extraídos do Figma'),
    systemMapping: z.record(z.string(), z.string()).optional(),
    mode: z.enum(['replace', 'merge']).optional(),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async (params) => {
    try {
      const result = await sendCommand('figma_aplicar_tipografia', params);
      return toolResult(result?.mensagem ?? 'Tipografia Figma aplicada.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'figma_importar_grid',
  'Importa o grid (bento) de um node Figma como containers + cards no Elementor. data deve conter { grid: { cols, rows, colGap, rowGap, cards[], bgColor, padding, borderRadius } }.',
  {
    data: z.object({}).passthrough().describe('Objeto com a estrutura de grid extraída do Figma'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async ({ data }) => {
    try {
      const result = await sendCommand('figma_importar_grid', { data });
      return toolResult(result?.mensagem ?? 'Grid importado.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'aplicar_animacao',
  'Aplica uma animação preset ao elemento selecionado. Presets: letras_cascata (entrada em cascata de caracteres), revelacao_linhas (revela texto por linhas), custom (anim customizada da biblioteca).',
  {
    preset: z.enum(['letras_cascata', 'revelacao_linhas', 'custom']).describe('Preset de animação'),
    opts: z.object({}).passthrough().optional().describe('Opções: cor, trigger, scrub, anim id (pra custom), etc'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async ({ preset, opts }) => {
    try {
      const result = await sendCommand('aplicar_animacao', { preset, opts });
      return toolResult(result?.mensagem ?? 'Animação aplicada.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'aplicar_transicao_secao',
  'Aplica uma transição entre seções da página. Tipos: shutter (veneziana), pixelated (pixel art), curve (curva suave).',
  {
    tipo: z.enum(['shutter', 'pixelated', 'curve']).describe('Tipo de transição'),
    opts: z.object({}).passthrough().optional().describe('Opções específicas da transição (cor, duração, etc)'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async ({ tipo, opts }) => {
    try {
      const result = await sendCommand('aplicar_transicao_secao', { tipo, opts });
      return toolResult(result?.mensagem ?? 'Transição aplicada.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'criar_popup',
  'Cria um popup do Atomik no editor. Templates: pixels (efeito pixel), svg (animação SVG), shutter (veneziana), simples (overlay básico), columns (2 colunas), lateral (drawer lateral), video_play (vídeo com play).',
  {
    template: z.enum(['pixels', 'svg', 'shutter', 'simples', 'columns', 'lateral', 'video_play']).describe('Template do popup'),
    opts: z.object({}).passthrough().optional().describe('Cor, modo (dark/light), id do popup pré-existente, etc'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async ({ template, opts }) => {
    try {
      const result = await sendCommand('criar_popup', { template, opts });
      return toolResult(result?.mensagem ?? 'Popup criado.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'inserir_video',
  'Insere um vídeo especial no editor. Tipos: scroll (frames acionados por scroll), gif (loop curto), hover (toca no hover), vsl (vídeo sales letter com controles customizados).',
  {
    tipo: z.enum(['scroll', 'gif', 'hover', 'vsl']).describe('Tipo de vídeo'),
    opts: z.object({}).passthrough().optional().describe('URLs do vídeo/frames, modo target (background/inline), etc'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async ({ tipo, opts }) => {
    try {
      const result = await sendCommand('inserir_video', { tipo, opts });
      return toolResult(result?.mensagem ?? 'Vídeo inserido.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'aplicar_cursor',
  'Aplica um cursor customizado à página inteira. Use variant="off" para desativar.',
  {
    variant: z.string().describe('Variante do cursor (ex: "dot", "ring", "off")'),
    config: z.object({}).passthrough().optional().describe('Config do cursor (cor, tamanho, etc)'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async ({ variant, config }) => {
    try {
      const result = await sendCommand('aplicar_cursor', { variant, config });
      return toolResult(result?.mensagem ?? 'Cursor aplicado.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'inserir_cursor_label',
  'Adiciona um label que aparece junto ao cursor quando passa sobre o elemento selecionado.',
  {
    text: z.string().describe('Texto do label (ex: "Clique", "Ver mais")'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async ({ text }) => {
    try {
      const result = await sendCommand('inserir_cursor_label', { text });
      return toolResult(result?.mensagem ?? 'Label aplicado.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'inserir_cursor_grow',
  'Faz o cursor crescer ao passar sobre o elemento selecionado.',
  {},
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async () => {
    try {
      const result = await sendCommand('inserir_cursor_grow', {});
      return toolResult(result?.mensagem ?? 'Cursor grow aplicado.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'aplicar_cursor_glow',
  'Adiciona um efeito de brilho que segue o cursor sobre o elemento selecionado.',
  {
    config: z.object({}).passthrough().optional().describe('Config do glow (cor, intensidade, blur)'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async ({ config }) => {
    try {
      const result = await sendCommand('aplicar_cursor_glow', { config });
      return toolResult(result?.mensagem ?? 'Glow aplicado.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'inserir_css_snippet',
  'Insere um snippet de CSS no widget Scripts da página (ou no escopo informado).',
  {
    css: z.string().optional().describe('CSS bruto a inserir'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async (params) => {
    try {
      const result = await sendCommand('inserir_css_snippet', params);
      return toolResult(result?.mensagem ?? 'CSS inserido.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'inserir_tag_css',
  'Aplica CSS a uma tag/seletor específico.',
  {
    seletor: z.string().optional(),
    regras: z.string().optional(),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async (params) => {
    try {
      const result = await sendCommand('inserir_tag_css', params);
      return toolResult(result?.mensagem ?? 'Tag CSS inserida.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'envolver_html',
  'Envolve a seleção atual no editor de código com um par de tags HTML (ex: <div class="wrapper"> ... </div>).',
  {
    tagOpen: z.string().describe('Tag de abertura (ex: \'<div class="wrapper">\')'),
    tagClose: z.string().describe('Tag de fechamento (ex: "</div>")'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async ({ tagOpen, tagClose }) => {
    try {
      const result = await sendCommand('envolver_html', { tagOpen, tagClose });
      return toolResult(result?.mensagem ?? 'HTML envolvido.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'inserir_js_snippet',
  'Insere um snippet de JavaScript no widget Scripts da página.',
  {
    js: z.string().optional().describe('JS bruto a inserir'),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: false },
  async (params) => {
    try {
      const result = await sendCommand('inserir_js_snippet', params);
      return toolResult(result?.mensagem ?? 'JS inserido.');
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'validar_css',
  'Valida a sintaxe do CSS atualmente no editor de código do widget Scripts. Retorna o resultado da validação.',
  {},
  { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
  async () => {
    try {
      const result = await sendCommand('validar_css', {});
      return toolResult(JSON.stringify(result, null, 2));
    } catch (err) { return toolError(err); }
  }
);

server.tool(
  'definir_border_radius',
  'Define border-radius por canto em px. Lados omitidos viram 0. Para arredondar tudo igual, passe os 4 com o mesmo valor.',
  {
    id: z.string().describe('ID do elemento'),
    topLeft: z.number().optional(),
    topRight: z.number().optional(),
    bottomRight: z.number().optional(),
    bottomLeft: z.number().optional(),
    breakpoint: z.enum(['desktop', 'tablet', 'mobile']).optional(),
    state: z.enum(['hover', 'focus', 'active']).nullable().optional(),
  },
  { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
  async ({ id, topLeft = 0, topRight = 0, bottomRight = 0, bottomLeft = 0, breakpoint = 'desktop', state = null }) => {
    try {
      const px = (n) => ({ $$type: 'size', value: { size: n, unit: 'px' } });
      const allEqual = topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft;
      const props = {
        'border-radius': allEqual
          ? px(topLeft)
          : {
              $$type: 'border-radius',
              value: {
                'start-start': px(topLeft),
                'start-end':   px(topRight),
                'end-end':     px(bottomRight),
                'end-start':   px(bottomLeft),
              },
            },
      };
      const result = await aplicarEstilo({ id, props, breakpoint, state });
      return toolResult(result?.mensagem ?? 'Border-radius aplicado.');
    } catch (err) { return toolError(err); }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
log('INFO', `Servidor iniciado. Aguardando conexão do editor na porta ${WS_PORT}...`);
