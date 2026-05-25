import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

const VAZIO = {
  nome: '', descricao: '', ingredientes: '',
  preco: '', estoque: '', emoji: '🧁', cor: 'bg-pink-400', ativo: true,
};

const CORES = [
  'bg-pink-400','bg-red-400','bg-orange-400','bg-amber-600',
  'bg-yellow-300','bg-green-400','bg-teal-400','bg-blue-400','bg-purple-400',
];

function FormProduto({ dados, set }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-gray-700">Nome *</label>
        <input value={dados.nome} onChange={(e) => set((p) => ({ ...p, nome: e.target.value }))}
          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          placeholder="Ex: Red Velvet" />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Descrição</label>
        <textarea value={dados.descricao} onChange={(e) => set((p) => ({ ...p, descricao: e.target.value }))}
          rows={2}
          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          placeholder="Descreva o produto..." />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Ingredientes</label>
        <textarea value={dados.ingredientes} onChange={(e) => set((p) => ({ ...p, ingredientes: e.target.value }))}
          rows={2}
          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          placeholder="Liste os ingredientes..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700">Preço (R$) *</label>
          <input type="number" step="0.01" value={dados.preco}
            onChange={(e) => set((p) => ({ ...p, preco: e.target.value }))}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="0,00" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Estoque</label>
          <input type="number" value={dados.estoque}
            onChange={(e) => set((p) => ({ ...p, estoque: e.target.value }))}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="0" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Emoji</label>
          <input value={dados.emoji} onChange={(e) => set((p) => ({ ...p, emoji: e.target.value }))}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select value={dados.ativo ? 'ativo' : 'inativo'}
            onChange={(e) => set((p) => ({ ...p, ativo: e.target.value === 'ativo' }))}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Cor do card</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {CORES.map((c) => (
            <button key={c} type="button" onClick={() => set((p) => ({ ...p, cor: c }))}
              className={`w-7 h-7 rounded-full ${c} border-2 transition-all ${dados.cor === c ? 'border-gray-800 scale-110' : 'border-transparent'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Modal({ titulo, dados, set, onSalvar, onFechar, labelBtn, IconeBtn }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-800">{titulo}</h3>
          <button onClick={onFechar} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <FormProduto dados={dados} set={set} />
        <div className="flex gap-3 mt-6">
          <button onClick={onFechar}
            className="flex-1 border border-gray-200 text-gray-600 font-medium py-2 rounded-xl text-sm hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={onSalvar}
            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 rounded-xl text-sm flex items-center justify-center gap-2">
            <IconeBtn size={15} />{labelBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Produtos({ cupcakes, setCupcakes }) {
  const [editando,    setEditando]    = useState(null);
  const [adicionando, setAdicionando] = useState(false);
  const [novo,        setNovo]        = useState(VAZIO);

  const remover = (id) => {
    if (!window.confirm('Remover este produto?')) return;
    setCupcakes((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleAtivo = (id) =>
    setCupcakes((prev) => prev.map((c) => (c.id === id ? { ...c, ativo: !c.ativo } : c)));

  const adicionar = () => {
    if (!novo.nome || !novo.preco) return;
    setCupcakes((prev) => [
      ...prev,
      { ...novo, id: Date.now(), preco: parseFloat(novo.preco), estoque: parseInt(novo.estoque) || 0 },
    ]);
    setNovo(VAZIO);
    setAdicionando(false);
  };

  const salvarEdicao = () => {
    setCupcakes((prev) =>
      prev.map((c) =>
        c.id === editando.id
          ? { ...editando, preco: parseFloat(editando.preco), estoque: parseInt(editando.estoque) }
          : c
      )
    );
    setEditando(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
          <p className="text-gray-400 text-sm mt-1">{cupcakes.length} produtos no catálogo</p>
        </div>
        <button onClick={() => setAdicionando(true)}
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
          <Plus size={16} />Novo Produto
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Produto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Descrição</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ingredientes</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Preço</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Estoque</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {cupcakes.map((c) => (
                <tr key={c.id} className={`border-t border-gray-50 hover:bg-gray-50 ${!c.ativo && 'opacity-50'}`}>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`${c.cor} w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0`}>
                        {c.emoji}
                      </span>
                      <span className="font-semibold text-gray-800 text-sm whitespace-nowrap">{c.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-[160px]">
                    <p className="text-xs text-gray-500 line-clamp-2">{c.descricao || '—'}</p>
                  </td>
                  <td className="px-4 py-3 max-w-[160px]">
                    <p className="text-xs text-gray-500 line-clamp-2">{c.ingredientes || '—'}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800 text-sm whitespace-nowrap">
                    R$ {c.preco.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-gray-700 text-sm">{c.estoque} un.</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleAtivo(c.id)} title={c.ativo ? 'Clique para desativar' : 'Clique para ativar'}>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${c.ativo ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {c.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setEditando({ ...c })}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Editar">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => remover(c.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Remover">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {adicionando && (
        <Modal titulo="Novo Produto" dados={novo} set={setNovo}
          onSalvar={adicionar} onFechar={() => { setAdicionando(false); setNovo(VAZIO); }}
          labelBtn="Adicionar" IconeBtn={Plus} />
      )}
      {editando && (
        <Modal titulo="Editar Produto" dados={editando} set={setEditando}
          onSalvar={salvarEdicao} onFechar={() => setEditando(null)}
          labelBtn="Salvar" IconeBtn={Save} />
      )}
    </div>
  );
}
