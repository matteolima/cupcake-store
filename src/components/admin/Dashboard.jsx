import { DollarSign, Users, Package, TrendingUp, ShoppingBag, AlertTriangle } from 'lucide-react';

const STATUS_COLOR = {
  pendente:   'bg-yellow-100 text-yellow-700',
  em_preparo: 'bg-blue-100 text-blue-700',
  enviado:    'bg-purple-100 text-purple-700',
  entregue:   'bg-green-100 text-green-700',
  cancelado:  'bg-red-100 text-red-700',
};
const STATUS_LABEL = {
  pendente: 'Pendente', em_preparo: 'Em Preparo',
  enviado: 'Enviado', entregue: 'Entregue', cancelado: 'Cancelado',
};

export default function Dashboard({ cupcakes, usuarios, pedidos }) {
  const totalVendas        = pedidos.reduce((s, p) => s + p.total, 0);
  const totalEstoque       = cupcakes.reduce((s, c) => s + c.estoque, 0);
  const produtosAtivos     = cupcakes.filter((c) => c.ativo).length;
  const usuariosAtivos     = usuarios.filter((u) => u.status === 'ativo').length;
  const pedidosPendentes   = pedidos.filter((p) => p.status === 'pendente').length;
  const estoqueCritico     = cupcakes.filter((c) => c.estoque <= 5).length;

  const cards = [
    { titulo: 'Total de Vendas',    valor: `R$ ${totalVendas.toFixed(2).replace('.', ',')}`, Icone: DollarSign, cor: 'bg-green-100 text-green-600',  desc: `${pedidos.length} pedidos` },
    { titulo: 'Usuários Ativos',    valor: usuariosAtivos,  Icone: Users,      cor: 'bg-blue-100 text-blue-600',   desc: `${usuarios.length} cadastrados` },
    { titulo: 'Produtos Ativos',    valor: produtosAtivos,  Icone: Package,    cor: 'bg-pink-100 text-pink-600',   desc: 'No catálogo' },
    { titulo: 'Itens em Estoque',   valor: totalEstoque,    Icone: TrendingUp, cor: 'bg-amber-100 text-amber-600', desc: 'Total disponível' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Bem-vindo ao painel CupcakeStore 👋</p>
      </div>

      {/* Alertas */}
      {(pedidosPendentes > 0 || estoqueCritico > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pedidosPendentes > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
              <ShoppingBag size={20} className="text-yellow-600 shrink-0" />
              <p className="text-sm text-yellow-800 font-medium">
                {pedidosPendentes} pedido(s) aguardando confirmação
              </p>
            </div>
          )}
          {estoqueCritico > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle size={20} className="text-red-600 shrink-0" />
              <p className="text-sm text-red-800 font-medium">
                {estoqueCritico} produto(s) com estoque crítico
              </p>
            </div>
          )}
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(({ titulo, valor, Icone, cor, desc }) => (
          <div key={titulo} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500 font-medium">{titulo}</p>
              <div className={`${cor} p-2 rounded-lg`}><Icone size={20} /></div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{valor}</p>
            <p className="text-xs text-gray-400 mt-1">{desc}</p>
          </div>
        ))}
      </div>

      {/* Pedidos recentes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">Pedidos Recentes</h2>
          <span className="text-xs text-gray-400">{pedidos.length} no total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Pedido</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Cliente</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.slice(0, 5).map((p) => (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-mono font-semibold text-gray-700">{p.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{p.cliente}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[p.status]}`}>
                      {STATUS_LABEL[p.status]}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-right font-semibold text-gray-800">
                    R$ {p.total.toFixed(2).replace('.', ',')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
