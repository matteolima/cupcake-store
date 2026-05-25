import { Trash2, ShoppingBag } from 'lucide-react';

export default function Carrinho({ carrinho, setCarrinho, setActiveTab }) {
  const removerItem = (id) => setCarrinho(carrinho.filter((item) => item.id !== id));

  const alterarQuantidade = (id, delta) => {
    setCarrinho(
      carrinho.map((item) =>
        item.id === id ? { ...item, quantidade: Math.max(1, item.quantidade + delta) } : item
      )
    );
  };

  const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  if (carrinho.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <ShoppingBag size={72} className="text-pink-200 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Seu carrinho está vazio</h2>
        <p className="text-gray-400 mb-6">Adicione cupcakes deliciosos à sua sacola!</p>
        <button
          onClick={() => setActiveTab('vitrine')}
          className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Ver Vitrine
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-pink-700 mb-6">Meu Carrinho</h1>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-pink-100 mb-6">
        <table className="w-full">
          <thead className="bg-pink-50">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-pink-700">Produto</th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-pink-700">Qtd.</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-pink-700">Subtotal</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {carrinho.map((item) => (
              <tr key={item.id} className="border-t border-pink-50 hover:bg-pink-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`${item.cor} w-10 h-10 rounded-full flex items-center justify-center text-xl`}>
                      {item.emoji}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800">{item.nome}</p>
                      <p className="text-sm text-gray-400">R$ {item.preco.toFixed(2).replace('.', ',')} cada</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => alterarQuantidade(item.id, -1)}
                      className="w-7 h-7 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold flex items-center justify-center"
                    >−</button>
                    <span className="w-6 text-center font-semibold">{item.quantidade}</span>
                    <button
                      onClick={() => alterarQuantidade(item.id, 1)}
                      className="w-7 h-7 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold flex items-center justify-center"
                    >+</button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-bold text-gray-800">
                  R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => removerItem(item.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-2xl shadow-md p-6 border border-pink-100">
        <div>
          <p className="text-gray-500 text-sm">Total do pedido</p>
          <p className="text-3xl font-bold text-pink-600">
            R$ {total.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <button
          onClick={() => setActiveTab('checkout')}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-8 py-3 rounded-xl transition-colors text-lg w-full sm:w-auto"
        >
          Finalizar Compra →
        </button>
      </div>
    </div>
  );
}
