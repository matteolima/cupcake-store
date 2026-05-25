import { ExternalLink } from 'lucide-react';
import Vitrine from '../Vitrine';

export default function PreviewLoja({ cupcakes }) {
  const ativos = cupcakes.filter((c) => c.ativo);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Preview da Loja</h1>
          <p className="text-gray-400 text-sm mt-1">
            Visualização de como os clientes veem a vitrine — mostra apenas produtos ativos.
          </p>
        </div>
        <a
          href="https://matteolima.github.io/cupcake-store/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          <ExternalLink size={16} />
          Abrir site
        </a>
      </div>

      {/* Janela de browser simulada */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Barra de endereço */}
        <div className="bg-gray-100 px-4 py-2 flex items-center gap-2.5 border-b border-gray-200">
          <div className="flex gap-1.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white rounded-md text-xs text-gray-400 px-3 py-1 text-center border border-gray-200">
            matteolima.github.io/cupcake-store
          </div>
        </div>

        {/* Conteúdo */}
        <div className="overflow-y-auto max-h-[68vh] bg-gray-50">
          {ativos.length > 0 ? (
            <Vitrine cupcakes={ativos} adicionarAoCarrinho={() => {}} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <span className="text-4xl mb-3">🧁</span>
              <p className="text-sm">Nenhum produto ativo para exibir.</p>
              <p className="text-xs mt-1">Ative produtos na seção <strong>Produtos</strong>.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
