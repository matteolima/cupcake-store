const USERS_KEY   = 'cks_users';
const SESSION_KEY = 'cks_session';

const CODIGO_ADMIN = 'ADMIN2026';

// ── Seed inicial (só executado uma vez, quando o storage está vazio) ─────────
const SEED_USERS = [
  { id: 0, nome: 'Administrador',  email: 'admin@cupcakestore.com', senha: 'admin123',  tipo: 'admin',   status: 'ativo',   criado: '2026-01-01' },
  { id: 1, nome: 'Ana Souza',      email: 'ana@email.com',           senha: 'senha123',  tipo: 'cliente', status: 'ativo',   criado: '2026-01-10' },
  { id: 2, nome: 'Bruno Lima',     email: 'bruno@email.com',         senha: 'senha123',  tipo: 'cliente', status: 'ativo',   criado: '2026-02-14' },
  { id: 3, nome: 'Carla Mendes',   email: 'carla@email.com',         senha: 'admin123',  tipo: 'admin',   status: 'ativo',   criado: '2026-01-01' },
  { id: 4, nome: 'Diego Ferreira', email: 'diego@email.com',         senha: 'senha123',  tipo: 'cliente', status: 'inativo', criado: '2026-03-22' },
  { id: 5, nome: 'Elisa Rocha',    email: 'elisa@email.com',         senha: 'senha123',  tipo: 'cliente', status: 'ativo',   criado: '2026-04-05' },
];

export function initAuth() {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
  }
}

// ── CRUD de usuários ─────────────────────────────────────────────────────────
export function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  catch { return []; }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/** Remove a senha antes de expor o objeto de usuário */
function strip(user) {
  const { senha: _, ...safe } = user;
  return safe;
}

// ── Login ─────────────────────────────────────────────────────────────────────
export function login(email, senha) {
  const users = getUsers();
  const user  = users.find(
    (u) =>
      u.email.toLowerCase() === email.trim().toLowerCase() &&
      u.senha === senha &&
      u.status === 'ativo'
  );
  if (!user) return null;
  const safe = strip(user);
  setSession(safe);
  return safe;
}

// ── Cadastro ─────────────────────────────────────────────────────────────────
export function register({ nome, email, senha, tipo, codigoAdmin }) {
  if (tipo === 'admin' && codigoAdmin !== CODIGO_ADMIN) {
    return { erro: 'Código de administrador inválido.' };
  }

  const users = getUsers();
  if (users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
    return { erro: 'E-mail já cadastrado.' };
  }

  const novo = {
    id:     Date.now(),
    nome:   nome.trim(),
    email:  email.trim().toLowerCase(),
    senha,
    tipo,
    status: 'ativo',
    criado: new Date().toISOString().split('T')[0],
  };

  saveUsers([...users, novo]);
  const safe = strip(novo);
  setSession(safe);
  return safe;
}

// ── Sessão ────────────────────────────────────────────────────────────────────
export function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
  catch { return null; }
}

export function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export { CODIGO_ADMIN };
