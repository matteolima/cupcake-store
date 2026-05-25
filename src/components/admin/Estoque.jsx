import { useState } from 'react';
import { Plus, Minus, AlertTriangle } from 'lucide-react';

function statusEstoque(qtd) {
  if (qtd === 0)  return { label: 'Esgotado', color: 'bg-red-100 text-red-700' };
  if (qtd <= 5)   return { label: 'Crítico',  color: 'bg-red-100 text-red-700' };
  if (qtd <= 10)  return { label: 'Baixo',    color: 'bg-yellow-100 text-yellow-700' };
  return           { label: 'OK',            color: 'bg-green-100 text-green-700' };
}

export default function Estoque({ cupcakes, setCupcakes }) {
  const [ajustesManual, setAjustesManual] = useState({});

  const ajustar = (id, delta) =>
    setCupcakes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estoque: Math.max(0, c.estoque + delta) } : c))
    );

  const aplicarManual = (id) => {
    const val = parseInt(ajustesManual[id] ?? '');
    if (isNaN(val)) return;
    setCupcakes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estoque: Math.max(0, val) } : c))
    );
    setAjustesManual((p) => ({ ...p, [id]: '' }));
  };

  const total   = cupcakes.reduce((s, c) => s + c.estoque, 0);
  const criticos = cupcakes.filter((c) => c.estoque <= 5).length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Estoque</h1>
        <p className="text-gray-400 text-sm mt-1">{total} unidades disponíveis no total</p>
      </div>

      {criticos > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={20} className="text-red-600 shrink-0" />
          <p className="text-sm text-red-800 font-medium">
            {criticos} produto(s) com estoque crítico ou esgotado — reponha o quanto antes!
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Produto</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Quantidade</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Ajuste rápido</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Definir valor</th>
              </tr>
            </thead>
            <tbody>
              {cupcakes.map((c) => {
                const st = statusEstoque(c.estoque);
                return (
                  <tr key={c.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`${c.cor} w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0`}>
                          {c.emoji}
                        </span>
                        <span className="font-semibold text-gray-800">{c.nome}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-2xl font-bold text-gray-800">{c.estoque}</span>
                      <span className="text-xs text-gray-400 ml-1">un.</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${st.color}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => ajustar(c.id, -10)}
                          className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors font-medium">
                          −10
                        </button>
                        <button onClick={() => ajustar(c.id, -1)} disabled={c.estoque === 0}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors disabled:opacity-40">
                          <Minus size={14} />
                        </button>
                        <button onClick={() => ajustar(c.id, 1)}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-colors">
                          <Plus size={14} />
                        </button>
                        <button onClick={() => ajustar(c.id, 10)}
                          className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-colors font-medium">
                          +10
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <input
                          type="number" min="0"
                          value={ajustesManual[c.id] ?? ''}
                          onChange={(e) => setAjustesManual((p) => ({ ...p, [c.id]: e.target.value }))}
                          placeholder={c.estoque}
                          className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                        <button onClick={() => aplicarManual(c.id)}
                          className="px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold rounded-lg transition-colors">
                          OK
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
