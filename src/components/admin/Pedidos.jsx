import { useState } from 'react';
import { Filter } from 'lucide-react';

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

export default function Pedidos({ pedidos, setPedidos }) {
  const [filtro, setFiltro] = useState('todos');

  const lista = filtro === 'todos' ? pedidos : pedidos.filter((p) => p.status === filtro);

  const alterarStatus = (id, novoStatus) =>
    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, status: novoStatus } : p)));

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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Pedido</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Cliente</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Pagamento</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Entrega</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Data</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Alterar status</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-mono font-semibold text-gray-700">{p.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{p.cliente}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[p.status]}`}>
                      {STATUS_LABEL[p.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-600">{PAGAMENTO_LABEL[p.pagamento]}</td>
                  <td className="px-4 py-3 text-center text-xs text-gray-600">{ENTREGA_LABEL[p.entrega]}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800 text-sm whitespace-nowrap">
                    R$ {p.total.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(p.data).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <select value={p.status} onChange={(e) => alterarStatus(p.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-400 bg-white">
                      <option value="pendente">Pendente</option>
                      <option value="em_preparo">Em Preparo</option>
                      <option value="enviado">Enviado</option>
                      <option value="entregue">Entregue</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {lista.length === 0 && (
            <p className="text-center py-12 text-gray-400 text-sm">Nenhum pedido encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
