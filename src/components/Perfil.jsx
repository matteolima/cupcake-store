import { useState } from 'react';
import { User, Mail, Calendar, Shield, Lock, Save, Eye, EyeOff, CheckCircle, Package } from 'lucide-react';
import { getUsers, saveUsers, setSession } from '../auth/auth';
import { getPedidosByUser } from '../data/storage';

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

export default function Perfil({ usuarioLogado, setUsuarioLogado }) {
  const [aba, setAba] = useState('dados');

  // dados
  const [nome,     setNome]     = useState(usuarioLogado.nome);
  const [salvoMsg, setSalvoMsg] = useState('');

  // senha
  const [senhaAtual,  setSenhaAtual]  = useState('');
  const [novaSenha,   setNovaSenha]   = useState('');
  const [confirmar,   setConfirmar]   = useState('');
  const [verSenha,    setVerSenha]    = useState(false);
  const [erroSenha,   setErroSenha]   = useState('');

  // pedidos
  const pedidos = getPedidosByUser(usuarioLogado.id);

  const salvarDados = () => {
    if (!nome.trim()) return;
    const users = getUsers().map((u) =>
      u.id === usuarioLogado.id ? { ...u, nome: nome.trim() } : u
    );
    saveUsers(users);
    const atualizado = { ...usuarioLogado, nome: nome.trim() };
    setSession(atualizado);
    setUsuarioLogado(atualizado);
    setSalvoMsg('Dados salvos!');
    setTimeout(() => setSalvoMsg(''), 2500);
  };

  const alterarSenha = () => {
    setErroSenha('');
    const users  = getUsers();
    const atual  = users.find((u) => u.id === usuarioLogado.id);
    if (!atual || atual.senha !== senhaAtual) {
      setErroSenha('Senha atual incorreta.');
      return;
    }
    if (novaSenha.length < 6) {
      setErroSenha('Nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmar) {
      setErroSenha('As senhas não coincidem.');
      return;
    }
    saveUsers(users.map((u) => u.id === usuarioLogado.id ? { ...u, senha: novaSenha } : u));
    setSenhaAtual(''); setNovaSenha(''); setConfirmar('');
    setSalvoMsg('Senha alterada!');
    setTimeout(() => setSalvoMsg(''), 2500);
  };

  const ABAS = [
    { id: 'dados',   label: 'Dados da conta' },
    { id: 'senha',   label: 'Alterar senha' },
    { id: 'pedidos', label: `Meus pedidos${pedidos.length ? ` (${pedidos.length})` : ''}` },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-2xl font-bold shrink-0">
          {usuarioLogado.nome.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">{usuarioLogado.nome}</h1>
          <p className="text-sm text-gray-500">{usuarioLogado.email}</p>
          <span className={`mt-1 inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full
            ${usuarioLogado.tipo === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
            {usuarioLogado.tipo === 'admin' ? '🔧 Administrador' : '🛍️ Cliente'}
          </span>
        </div>
      </div>

      {/* Abas */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {ABAS.map(({ id, label }) => (
            <button key={id} onClick={() => setAba(id)}
              className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                ${aba === id ? 'border-pink-600 text-pink-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* ── Dados da conta ── */}
          {aba === 'dados' && (
            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <User size={14} /> Nome completo
                </label>
                <input value={nome} onChange={(e) => setNome(e.target.value)}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <Mail size={14} /> E-mail
                </label>
                <input value={usuarioLogado.email} disabled
                  className="mt-1 w-full border border-gray-100 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
                <p className="text-xs text-gray-400 mt-1">O e-mail não pode ser alterado.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Shield size={14} /> Tipo de conta
                  </label>
                  <input value={usuarioLogado.tipo === 'admin' ? 'Administrador' : 'Cliente'} disabled
                    className="mt-1 w-full border border-gray-100 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Calendar size={14} /> Membro desde
                  </label>
                  <input value={new Date(usuarioLogado.criado).toLocaleDateString('pt-BR')} disabled
                    className="mt-1 w-full border border-gray-100 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
                </div>
              </div>
              <button onClick={salvarDados}
                className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
                <Save size={15} /> Salvar alterações
              </button>
              {salvoMsg && (
                <p className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                  <CheckCircle size={15} /> {salvoMsg}
                </p>
              )}
            </div>
          )}

          {/* ── Alterar senha ── */}
          {aba === 'senha' && (
            <div className="space-y-4 max-w-md">
              {[
                { label: 'Senha atual',    value: senhaAtual,  set: setSenhaAtual },
                { label: 'Nova senha',     value: novaSenha,   set: setNovaSenha },
                { label: 'Confirmar nova', value: confirmar,   set: setConfirmar },
              ].map(({ label, value, set }) => (
                <div key={label}>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Lock size={14} /> {label}
                  </label>
                  <div className="relative mt-1">
                    <input type={verSenha ? 'text' : 'password'} value={value}
                      onChange={(e) => set(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
                    <button type="button" onClick={() => setVerSenha(!verSenha)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                      {verSenha ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}
              {erroSenha && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{erroSenha}</p>
              )}
              <button onClick={alterarSenha}
                className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
                <Save size={15} /> Alterar senha
              </button>
              {salvoMsg && (
                <p className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                  <CheckCircle size={15} /> {salvoMsg}
                </p>
              )}
            </div>
          )}

          {/* ── Meus pedidos ── */}
          {aba === 'pedidos' && (
            <div className="space-y-4">
              {pedidos.length === 0 ? (
                <div className="text-center py-10">
                  <Package size={48} className="text-pink-200 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Nenhum pedido ainda</p>
                  <p className="text-gray-400 text-sm mt-1">Seus pedidos aparecerão aqui após a compra.</p>
                </div>
              ) : (
                pedidos.map((p) => (
                  <div key={p.id} className="border border-gray-100 rounded-xl overflow-hidden">
                    {/* Cabeçalho do pedido */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono font-bold text-gray-700">{p.id}</span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[p.status]}`}>
                          {STATUS_LABEL[p.status]}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>{new Date(p.data).toLocaleDateString('pt-BR')} • {p.hora}</span>
                        <span>{ENTREGA_LABEL[p.entrega]}</span>
                        <span>{PAGAMENTO_LABEL[p.pagamento]}</span>
                      </div>
                    </div>
                    {/* Itens */}
                    <div className="px-4 py-3 space-y-2">
                      {p.itens.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span className={`${item.cor} w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0`}>
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
                    {/* Rodapé */}
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                      {p.taxaEntrega > 0 && (
                        <span className="text-xs text-gray-400">
                          + R$ {p.taxaEntrega.toFixed(2).replace('.', ',')} entrega
                        </span>
                      )}
                      <span className="ml-auto font-bold text-pink-600">
                        Total: R$ {p.total.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
