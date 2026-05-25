import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

const TIPO_COLOR   = { admin: 'bg-purple-100 text-purple-700', cliente: 'bg-blue-100 text-blue-700' };
const STATUS_COLOR = { ativo: 'bg-green-100 text-green-700',   inativo: 'bg-gray-100 text-gray-500' };

const VAZIO = { nome: '', email: '', tipo: 'cliente', status: 'ativo' };

function Modal({ titulo, dados, setDados, onSalvar, onFechar, labelBtn, IconeBtn }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-800">{titulo}</h3>
          <button onClick={onFechar} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Nome</label>
            <input value={dados.nome} onChange={(e) => setDados((p) => ({ ...p, nome: e.target.value }))}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Nome completo" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">E-mail</label>
            <input value={dados.email} onChange={(e) => setDados((p) => ({ ...p, email: e.target.value }))}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="email@exemplo.com" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Tipo</label>
              <select value={dados.tipo} onChange={(e) => setDados((p) => ({ ...p, tipo: e.target.value }))}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
                <option value="cliente">Cliente</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select value={dados.status} onChange={(e) => setDados((p) => ({ ...p, status: e.target.value }))}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>
        </div>

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

export default function Usuarios({ usuarios, setUsuarios }) {
  const [editando,    setEditando]    = useState(null);
  const [adicionando, setAdicionando] = useState(false);
  const [novo,        setNovo]        = useState(VAZIO);

  const remover = (id) => {
    if (!window.confirm('Remover este usuário?')) return;
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  const salvarEdicao = () => {
    if (!editando.nome || !editando.email) return;
    setUsuarios((prev) => prev.map((u) => (u.id === editando.id ? editando : u)));
    setEditando(null);
  };

  const adicionar = () => {
    if (!novo.nome || !novo.email) return;
    setUsuarios((prev) => [
      ...prev,
      { ...novo, id: Date.now(), criado: new Date().toISOString().split('T')[0] },
    ]);
    setNovo(VAZIO);
    setAdicionando(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Usuários</h1>
          <p className="text-gray-400 text-sm mt-1">{usuarios.length} usuários cadastrados</p>
        </div>
        <button onClick={() => setAdicionando(true)}
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
          <Plus size={16} />Adicionar
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Usuário</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">E-mail</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Criado em</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-xs font-bold shrink-0">
                        {u.nome.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{u.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TIPO_COLOR[u.tipo]}`}>
                      {u.tipo === 'admin' ? 'Admin' : 'Cliente'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[u.status]}`}>
                      {u.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(u.criado).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setEditando({ ...u })}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Editar">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => remover(u.id)}
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

      {editando && (
        <Modal titulo="Editar Usuário" dados={editando} setDados={setEditando}
          onSalvar={salvarEdicao} onFechar={() => setEditando(null)}
          labelBtn="Salvar" IconeBtn={Save} />
      )}
      {adicionando && (
        <Modal titulo="Novo Usuário" dados={novo} setDados={setNovo}
          onSalvar={adicionar} onFechar={() => { setAdicionando(false); setNovo(VAZIO); }}
          labelBtn="Adicionar" IconeBtn={Plus} />
      )}
    </div>
  );
}
