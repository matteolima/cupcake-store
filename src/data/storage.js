import { configuracoesIniciais } from './mockData';

const PEDIDOS_KEY = 'cks_pedidos';
const CONFIG_KEY  = 'cks_config';

// ── Pedidos ───────────────────────────────────────────────────────────────────
export function getPedidos() {
  try { return JSON.parse(localStorage.getItem(PEDIDOS_KEY) || '[]'); }
  catch { return []; }
}

export function savePedidos(pedidos) {
  localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos));
}

export function addPedido(pedido) {
  const lista = getPedidos();
  lista.unshift(pedido);
  savePedidos(lista);
  return pedido;
}

export function updatePedidoStatus(id, status) {
  const lista = getPedidos().map((p) => (p.id === id ? { ...p, status } : p));
  savePedidos(lista);
}

export function getPedidosByUser(userId) {
  return getPedidos().filter((p) => p.userId === userId);
}

/** Gera ID sequencial estilo PED-XXXXXX */
export function gerarIdPedido() {
  const lista = getPedidos();
  const ultimo = lista
    .map((p) => parseInt(p.id.replace('PED-', ''), 10))
    .filter((n) => !isNaN(n));
  const proximo = ultimo.length ? Math.max(...ultimo) + 1 : 1;
  return `PED-${String(proximo).padStart(3, '0')}`;
}

// ── Configurações da loja ─────────────────────────────────────────────────────
export function getConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? JSON.parse(raw) : configuracoesIniciais;
  } catch {
    return configuracoesIniciais;
  }
}

export function saveConfig(config) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}
