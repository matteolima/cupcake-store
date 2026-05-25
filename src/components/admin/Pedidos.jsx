import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { getPedidos, savePedidos } from '../../data/storage';

const STATUS_COLOR = {
  pendente:   'bg-yellow-100 text-yellow-700',
  em_preparo: 'bg-blue-100 text-blue-700',
  enviado:    'bg-purple-100 text-purple-700',
  entregue:   'bg-green-100 text-green-700',
  cancelado:  'bg-red-100 text-red-700',
};
const STATUS_LABEL    = { pendente: 'Pendente', em_preparo: 'Em Preparo', enviado: 'Enviado', entregue: 'Entregue', cancelado: 'Cancelado' };
const PAGAMENTO_LABEL = { pix: 'PIX', cartao_credito: 'Crédito', cartao_debito: 'Débito', dinheiro: 'Dinheiro' };
const ENTREGA_LABEL   = { delivery: 'Delivery', retirada: 'Retirada' };

export default function Pedidos() {
  const [pedidos,   setPedidosState] = useState(() => getPedidos());
  const [filtro,    setFiltro]       = useState('todos');
  const [expandido, setExpandido]    = useState(null);

  const setPedidos = (fn) => {
    setPedidosState((prev) => {
      const updated = typeof fn === 'function' ? fn(prev) : fn;
      savePedidos(updated);
      return updated;
    });
  };

  const alterarStatus = (id, novoStatus) =>
    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, status: novoStatus } : p)));

  const lista = filtro === 'todos' ? pedidos : pedidos.filter((p) => p.status === filtro);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>
          <p className="text-gray-400 text-sm mt-1">{lista.length} pedido(s)</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-gray-400" />
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white">
            <option value="todos">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="em_preparo">Em Preparo</option>
            <option value="enviado">Enviado</option>
            <option value="entregue">Entregue</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {lista.length === 0 ? (
          <p className="text-center py-12 text-gray-400 text-sm">Nenhum pedido encontrado.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {lista.map((p) => (
              <div key={p.id}>
                {/* Linha principal */}
                <div className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 flex-wrap">
                  <button onClick={() => setExpandido(expandido === p.id ? null : p.id)}
                    className="text-gray-400 hover:text-gray-600 shrink-0">
                    {expandido === p.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <span className="text-sm font-mono font-bold text-gray-700 w-24">{p.id}</span>
                  <span className="text-sm text-gray-700 flex-1 min-w-[100px]">{p.cliente}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[p.status]}`}>
                    {STATUS_LABEL[p.status]}
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:inline">{PAGAMENTO_LABEL[p.pagamento]}</span>
                  <span className="text-xs text-gray-500 hidden sm:inline">{ENTREGA_LABEL[p.entrega]}</span>
                  <span className="text-sm font-bold text-gray-800 ml-auto">
                    R$ {p.total.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-xs text-gray-400 hidden md:inline whitespace-nowrap">
                    {new Date(p.data).toLocaleDateString('pt-BR')} {p.hora}
                  </span>
                  <select value={p.status} onChange={(e) => alterarStatus(p.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-400 bg-white">
                    <option value="pendente">Pendente</option>
                    <option value="em_preparo">Em Preparo</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregue">Entregue</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                {/* Detalhes expandidos */}
                {expandido === p.id && (
                  <div className="px-12 pb-4 bg-gray-50 space-y-3">
                    {/* Itens */}
                    <div className="space-y-1">
                      {(p.itens || []).map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span className={`${item.cor} w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0`}>
                            {item.emoji}
                          </span>
                          <span className="flex-1 text-gray-700">{item.nome}</span>
                          <span className="text-gray-400">×{item.quantidade}</span>
                          <span className="font-semibold text-gray-800">
                            R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Totais */}
                    <div className="text-xs text-gray-500 space-y-0.5 pt-1 border-t border-gray-200">
                      {p.taxaEntrega > 0 && (
                        <p>Taxa de entrega: R$ {p.taxaEntrega.toFixed(2).replace('.', ',')}</p>
                      )}
                      <p className="font-bold text-gray-700">
                        Total: R$ {p.total.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    {/* Endereço */}
                    {p.entrega === 'delivery' && p.endereco && (
                      <div className="text-xs text-gray-500">
                        <p className="font-semibold text-gray-600">📍 Entrega</p>
                        <p>{p.endereco.rua}, {p.endereco.cidade} — {p.endereco.cep}</p>
                        <p>{p.endereco.telefone}</p>
                      </div>
                    )}
                    {/* Troco */}
                    {p.pagamento === 'dinheiro' && p.troco && (
                      <p className="text-xs text-gray-500">💵 Troco para: R$ {parseFloat(p.troco).toFixed(2).replace('.', ',')}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
