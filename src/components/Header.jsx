import { ShoppingCart, LogIn, LayoutDashboard, Store, LogOut, UserPlus } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, totalItens, usuarioLogado, onLogout }) {
  return (
    <header className="bg-pink-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer shrink-0"
          onClick={() => setActiveTab('vitrine')}
        >
          <span className="text-2xl">🧁</span>
          <span className="text-xl font-bold tracking-wide hidden sm:inline">CupcakeStore</span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1 flex-wrap justify-end">

          <button
            onClick={() => setActiveTab('vitrine')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === 'vitrine' ? 'bg-white text-pink-600' : 'hover:bg-pink-500'}`}
          >
            <Store size={16} />
            <span className="hidden sm:inline">Vitrine</span>
          </button>

          <button
            onClick={() => setActiveTab('carrinho')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all relative
              ${activeTab === 'carrinho' ? 'bg-white text-pink-600' : 'hover:bg-pink-500'}`}
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Carrinho</span>
            {totalItens > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-pink-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItens}
              </span>
            )}
          </button>

          {/* Admin (só para admin logado) */}
          {usuarioLogado?.tipo === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${activeTab === 'admin' ? 'bg-white text-pink-600' : 'hover:bg-pink-500'}`}
            >
              <LayoutDashboard size={16} />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* Usuário logado */}
          {usuarioLogado ? (
            <div className="flex items-center gap-2 ml-1">
              <div className="flex items-center gap-2 bg-pink-500 px-3 py-1.5 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-white text-pink-600 flex items-center justify-center text-xs font-bold shrink-0">
                  {usuarioLogado.nome.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden md:inline max-w-[120px] truncate">
                  {usuarioLogado.nome.split(' ')[0]}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Sair"
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium hover:bg-pink-500 transition-all"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 ml-1">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${activeTab === 'login' ? 'bg-white text-pink-600' : 'hover:bg-pink-500'}`}
              >
                <LogIn size={16} />
                <span className="hidden sm:inline">Entrar</span>
              </button>
              <button
                onClick={() => setActiveTab('cadastro')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${activeTab === 'cadastro' ? 'bg-white text-pink-600' : 'hover:bg-pink-500'}`}
              >
                <UserPlus size={16} />
                <span className="hidden sm:inline">Cadastrar</span>
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
