import { useState, useEffect } from 'react';
import Header    from './components/Header';
import Vitrine   from './components/Vitrine';
import Carrinho  from './components/Carrinho';
import Login     from './components/Login';
import Cadastro  from './components/Cadastro';
import Checkout  from './components/Checkout';
import Perfil    from './components/Perfil';
import Admin     from './components/Admin';
import { cupcakes as cupcakesIniciais } from './data/cupcakes';
import { initAuth, getSession, clearSession } from './auth/auth';
import { getConfig } from './data/storage';

initAuth();

export default function App() {
  const [activeTab,     setActiveTab]     = useState('vitrine');
  const [carrinho,      setCarrinho]      = useState([]);
  const [cupcakes,      setCupcakes]      = useState(cupcakesIniciais);
  const [usuarioLogado, setUsuarioLogado] = useState(() => getSession());
  const [config,        setConfig]        = useState(() => getConfig());

  useEffect(() => { if (!usuarioLogado) clearSession(); }, [usuarioLogado]);

  const adicionarAoCarrinho = (cupcake) => {
    setCarrinho((prev) => {
      const existe = prev.find((i) => i.id === cupcake.id);
      if (existe) return prev.map((i) => i.id === cupcake.id ? { ...i, quantidade: i.quantidade + 1 } : i);
      return [...prev, { ...cupcake, quantidade: 1 }];
    });
  };

  const handleLogout = () => { clearSession(); setUsuarioLogado(null); setActiveTab('vitrine'); };

  const totalItens     = carrinho.reduce((s, i) => s + i.quantidade, 0);
  const cupcakesAtivos = cupcakes.filter((c) => c.ativo);

  if (activeTab === 'admin') {
    if (!usuarioLogado || usuarioLogado.tipo !== 'admin') { setActiveTab('login'); return null; }
    return (
      <Admin
        cupcakes={cupcakes} setCupcakes={setCupcakes}
        setActiveTab={setActiveTab} usuarioLogado={usuarioLogado}
        config={config} setConfig={setConfig}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeTab={activeTab} setActiveTab={setActiveTab}
        totalItens={totalItens} usuarioLogado={usuarioLogado}
        onLogout={handleLogout}
      />
      <main className="pb-12">
        {activeTab === 'vitrine'   && <Vitrine   cupcakes={cupcakesAtivos} adicionarAoCarrinho={adicionarAoCarrinho} />}
        {activeTab === 'carrinho'  && <Carrinho  carrinho={carrinho} setCarrinho={setCarrinho} setActiveTab={setActiveTab} />}
        {activeTab === 'checkout'  && <Checkout  carrinho={carrinho} setCarrinho={setCarrinho} setActiveTab={setActiveTab} usuarioLogado={usuarioLogado} config={config} />}
        {activeTab === 'login'     && <Login     setActiveTab={setActiveTab} setUsuarioLogado={setUsuarioLogado} />}
        {activeTab === 'cadastro'  && <Cadastro  setActiveTab={setActiveTab} setUsuarioLogado={setUsuarioLogado} />}
        {activeTab === 'perfil'    && usuarioLogado && <Perfil usuarioLogado={usuarioLogado} setUsuarioLogado={setUsuarioLogado} />}
      </main>
      <footer className="text-center text-xs text-gray-400 py-4 border-t border-gray-100">
        CupcakeStore © 2026 — Projeto Integrador Transdisciplinar | Autor: Cláudio Matteo Assunção Lima
      </footer>
    </div>
  );
}
