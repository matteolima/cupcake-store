import { ShoppingCart, LogIn, LayoutDashboard, Store } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, totalItens }) {
  const navItems = [
    { id: 'vitrine', label: 'Vitrine', icon: <Store size={16} /> },
    { id: 'carrinho', label: 'Carrinho', icon: <ShoppingCart size={16} />, badge: totalItens },
    { id: 'login', label: 'Login', icon: <LogIn size={16} /> },
    { id: 'admin', label: 'Admin', icon: <LayoutDashboard size={16} /> },
  ];

  return (
    <header className="bg-pink-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('vitrine')}>
          <span className="text-2xl">🧁</span>
          <span className="text-xl font-bold tracking-wide">CupcakeStore</span>
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all relative
                ${activeTab === item.id
                  ? 'bg-white text-pink-600'
                  : 'hover:bg-pink-500 text-white'
                }`}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-pink-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
