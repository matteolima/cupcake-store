import { ShoppingCart } from 'lucide-react';

export default function Vitrine({ cupcakes, adicionarAoCarrinho }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-pink-700 mb-2">Nossa Vitrine</h1>
        <p className="text-gray-500">Cupcakes artesanais feitos com amor 🧁</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cupcakes.map((cupcake) => (
          <div
            key={cupcake.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-pink-100"
          >
            {/* Imagem ou emoji */}
            {cupcake.imagem ? (
              <img
                src={cupcake.imagem}
                alt={cupcake.nome}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className={`${cupcake.cor} h-40 flex items-center justify-center`}>
                <span className="text-6xl">{cupcake.emoji}</span>
              </div>
            )}

            <div className="p-5">
              <h2 className="text-lg font-bold text-gray-800 mb-1">{cupcake.nome}</h2>
              <p className="text-sm text-gray-500 mb-4">{cupcake.descricao}</p>
              <div className="flex items-center justify-between">
                <span className="text-pink-600 font-bold text-xl">
                  R$ {cupcake.preco.toFixed(2).replace('.', ',')}
                </span>
                <button
                  onClick={() => adicionarAoCarrinho(cupcake)}
                  disabled={cupcake.estoque === 0}
                  className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <ShoppingCart size={16} />
                  {cupcake.estoque === 0 ? 'Esgotado' : 'Adicionar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
