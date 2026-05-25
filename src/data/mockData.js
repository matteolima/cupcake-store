export const usuariosIniciais = [
  { id: 1, nome: 'Ana Souza',      email: 'ana@email.com',    tipo: 'cliente', status: 'ativo',   criado: '2026-01-10' },
  { id: 2, nome: 'Bruno Lima',     email: 'bruno@email.com',  tipo: 'cliente', status: 'ativo',   criado: '2026-02-14' },
  { id: 3, nome: 'Carla Mendes',   email: 'carla@email.com',  tipo: 'admin',   status: 'ativo',   criado: '2026-01-01' },
  { id: 4, nome: 'Diego Ferreira', email: 'diego@email.com',  tipo: 'cliente', status: 'inativo', criado: '2026-03-22' },
  { id: 5, nome: 'Elisa Rocha',    email: 'elisa@email.com',  tipo: 'cliente', status: 'ativo',   criado: '2026-04-05' },
];

export const pedidosIniciais = [
  {
    id: 'PED-001',
    cliente: 'Ana Souza',
    email: 'ana@email.com',
    status: 'entregue',
    total: 38.70,
    pagamento: 'pix',
    entrega: 'delivery',
    data: '2026-05-20',
  },
  {
    id: 'PED-002',
    cliente: 'Bruno Lima',
    email: 'bruno@email.com',
    status: 'em_preparo',
    total: 29.00,
    pagamento: 'cartao_credito',
    entrega: 'retirada',
    data: '2026-05-24',
  },
  {
    id: 'PED-003',
    cliente: 'Elisa Rocha',
    email: 'elisa@email.com',
    status: 'pendente',
    total: 55.80,
    pagamento: 'pix',
    entrega: 'delivery',
    data: '2026-05-25',
  },
  {
    id: 'PED-004',
    cliente: 'Diego Ferreira',
    email: 'diego@email.com',
    status: 'cancelado',
    total: 25.80,
    pagamento: 'dinheiro',
    entrega: 'retirada',
    data: '2026-05-18',
  },
  {
    id: 'PED-005',
    cliente: 'Ana Souza',
    email: 'ana@email.com',
    status: 'enviado',
    total: 43.80,
    pagamento: 'cartao_debito',
    entrega: 'delivery',
    data: '2026-05-23',
  },
];

export const configuracoesIniciais = {
  loja: {
    nome: 'CupcakeStore',
    endereco: 'Rua das Flores, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
    telefone: '(11) 99999-9999',
    email: 'contato@cupcakestore.com',
  },
  entrega: {
    ativa: true,
    taxaFixa: 8.00,
    gratis_acima: 80.00,
    raio_km: 10,
  },
  pagamento: {
    dinheiro: true,
    cartao_credito: true,
    cartao_debito: true,
    pix: true,
  },
  pix: {
    tipo: 'email',
    chave: 'contato@cupcakestore.com',
    titular: 'Cláudio Matteo Assunção Lima',
  },
};
