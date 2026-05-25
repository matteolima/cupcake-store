import { DollarSign, Users, Package, TrendingUp } from 'lucide-react';

export default function Admin({ cupcakes }) {
  const totalEstoque = cupcakes.reduce((acc, c) => acc + c.estoque, 0);
  const totalProdutos = cupcakes.length;

  const cards = [
    {
      titulo: 'Total de Vendas',
      valor: 'R$ 4.872,50',
      icone: <DollarSign size={24} />,
      cor: 'bg-green-100 text-green-600',
      desc: '+12% este mês',
    },
    {
      titulo: 'Usuários Cadastrados',
      valor: '138',
      icone: <Users size={24} />,
      cor: 'bg-blue-100 text-blue-600',
      desc: '+5 novos hoje',
    },
    {
      titulo: 'Produtos Ativos',
      valor: totalProdutos,
      icone: <Package size={24} />,
      cor: 'bg-pink-100 text-pink-600',
      desc: 'No catálogo',
    },
    {
      titulo: 'Itens em Estoque',
      valor: totalEstoque,
      icone: <TrendingUp size={24} />,
      cor: 'bg-amber-100 text-amber-600',
      desc: 'Total disponível',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-pink-700 mb-2">Painel Administrativo</h1>
      <p className="text-gray-400 mb-8">Bem-vindo, Administrador 👋</p>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((card) => (
          <div key={card.titulo} className="bg-white rounded-2xl shadow-md p-5 border border-pink-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500 font-medium">{card.titulo}</p>
              <div className={`${card.cor} p-2 rounded-lg`}>{card.icone}</div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{card.valor}</p>
            <p className="text-xs text-gray-400 mt-1">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Tabela de estoque */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-pink-100">
        <div className="px-6 py-4 border-b border-pink-50">
          <h2 className="text-lg font-bold text-gray-800">Estoque de Produtos</h2>
        </div>
        <table className="w-full">
          <thead className="bg-pink-50">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-pink-700">Produto</th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-pink-700">Estoque</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-pink-700">Preço</th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-pink-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {cupcakes.map((cupcake) => (
              <tr key={cupcake.id} className="border-t border-pink-50 hover:bg-pink-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`${cupcake.cor} w-9 h-9 rounded-full flex items-center justify-center text-lg`}>
                      {cupcake.emoji}
                    </span>
                    <span className="font-semibold text-gray-800">{cupcake.nome}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center font-semibold text-gray-700">
                  {cupcake.estoque} un.
                </td>
                <td className="px-6 py-4 text-right text-gray-800">
                  R$ {cupcake.preco.toFixed(2).replace('.', ',')}
                </td>
                <td className="px-4 py-4 text-center">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      cupcake.estoque > 10
                        ? 'bg-green-100 text-green-700'
                        : cupcake.estoque > 5
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {cupcake.estoque > 10 ? 'Disponível' : cupcake.estoque > 5 ? 'Baixo' : 'Crítico'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
