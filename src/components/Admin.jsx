import { useState } from 'react';
import {
  LayoutDashboard, Eye, Users, ShoppingBag, Package,
  Archive, Settings, Menu, X, LogOut, ChevronRight,
} from 'lucide-react';
import Dashboard    from './admin/Dashboard';
import PreviewLoja  from './admin/PreviewLoja';
import Usuarios     from './admin/Usuarios';
import Pedidos      from './admin/Pedidos';
import Produtos     from './admin/Produtos';
import Estoque      from './admin/Estoque';
import Configuracoes from './admin/Configuracoes';
import { configuracoesIniciais } from '../data/mockData';
import { getUsers, saveUsers } from '../auth/auth';

const MENU = [
  { id: 'dashboard',     label: 'Dashboard',       Icone: LayoutDashboard },
  { id: 'preview',       label: 'Preview da Loja', Icone: Eye },
  { id: 'usuarios',      label: 'Usuários',         Icone: Users },
  { id: 'pedidos',       label: 'Pedidos',          Icone: ShoppingBag },
  { id: 'produtos',      label: 'Produtos',         Icone: Package },
  { id: 'estoque',       label: 'Estoque',          Icone: Archive },
  { id: 'configuracoes', label: 'Configurações',    Icone: Settings },
];

export default function Admin({ cupcakes, setCupcakes, setActiveTab, usuarioLogado, config, setConfig }) {
  const [secao,    setSecao]    = useState('dashboard');
  const [aberta,   setAberta]   = useState(true);
  // Lê usuários do localStorage (sem senha) para exibição
  const [usuarios, setUsuariosState] = useState(() =>
    getUsers().map(({ senha: _, ...u }) => u)
  );

  // Wrapper que sincroniza com localStorage ao atualizar usuários
  const setUsuarios = (fn) => {
    setUsuariosState((prev) => {
      const updated = typeof fn === 'function' ? fn(prev) : fn;
      // Preserva senhas ao salvar
      const withPasswords = updated.map((u) => {
        const existing = getUsers().find((g) => g.id === u.id);
        return existing ? { ...existing, ...u } : u;
      });
      saveUsers(withPasswords);
      return updated;
    });
  };

  const renderSecao = () => {
    switch (secao) {
      case 'dashboard':     return <Dashboard     cupcakes={cupcakes} usuarios={usuarios} />;
      case 'preview':       return <PreviewLoja   cupcakes={cupcakes} />;
      case 'usuarios':      return <Usuarios      usuarios={usuarios} setUsuarios={setUsuarios} />;
      case 'pedidos':       return <Pedidos />;
      case 'produtos':      return <Produtos      cupcakes={cupcakes} setCupcakes={setCupcakes} />;
      case 'estoque':       return <Estoque       cupcakes={cupcakes} setCupcakes={setCupcakes} />;
      case 'configuracoes': return <Configuracoes config={config}     setConfig={setConfig} />;
      default:              return <Dashboard     cupcakes={cupcakes} usuarios={usuarios} />;
    }
  };

  const tituloAtual = MENU.find((m) => m.id === secao)?.label ?? 'Dashboard';

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ── Sidebar ── */}
      <aside
        className={`${aberta ? 'w-64' : 'w-16'} bg-white border-r border-gray-200
          flex flex-col fixed inset-y-0 left-0 z-30 transition-all duration-300`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 p-4 border-b border-gray-100 ${!aberta && 'justify-center'}`}>
          {aberta ? (
            <>
              <span className="text-2xl">🧁</span>
              <div className="flex-1">
                <p className="font-bold text-pink-700 text-sm leading-tight">CupcakeStore</p>
                <p className="text-xs text-gray-400">Painel Admin</p>
              </div>
            </>
          ) : (
            <span className="text-2xl">🧁</span>
          )}
          <button
            onClick={() => setAberta(!aberta)}
            className="p-1.5 rounded-lg hover:bg-pink-50 text-gray-400 shrink-0"
          >
            {aberta ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {MENU.map(({ id, label, Icone }) => (
            <button
              key={id}
              onClick={() => setSecao(id)}
              title={!aberta ? label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${secao === id
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-pink-50 hover:text-pink-700'}
                ${!aberta && 'justify-center'}`}
            >
              <Icone size={18} className="shrink-0" />
              {aberta && <span>{label}</span>}
            </button>
          ))}
        </nav>

        {/* Sair */}
        <div className="p-2 border-t border-gray-100">
          <button
            onClick={() => setActiveTab('vitrine')}
            title={!aberta ? 'Voltar à loja' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all
              ${!aberta && 'justify-center'}`}
          >
            <LogOut size={18} className="shrink-0" />
            {aberta && <span>Voltar à loja</span>}
          </button>
        </div>
      </aside>

      {/* ── Conteúdo principal ── */}
      <main className={`flex-1 ${aberta ? 'ml-64' : 'ml-16'} transition-all duration-300 min-h-screen`}>
        {/* Topbar */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-2">
          <span className="text-xs text-gray-400">Admin</span>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-sm font-semibold text-gray-800">{tituloAtual}</span>
        </div>

        <div className="p-6">
          {renderSecao()}
        </div>
      </main>
    </div>
  );
}
