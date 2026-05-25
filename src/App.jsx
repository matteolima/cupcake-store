import { useState } from 'react';
import Header from './components/Header';
import Vitrine from './components/Vitrine';
import Carrinho from './components/Carrinho';
import Login from './components/Login';
import Admin from './components/Admin';
import { cupcakes } from './data/cupcakes';

export default function App() {
  const [activeTab, setActiveTab] = useState('vitrine');
  const [carrinho, setCarrinho] = useState([]);

  const adicionarAoCarrinho = (cupcake) => {
    setCarrinho((prev) => {
      const existe = prev.find((item) => item.id === cupcake.id);
      if (existe) {
        return prev.map((item) =>
          item.id === cupcake.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...prev, { ...cupcake, quantidade: 1 }];
    });
  };

  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalItens={totalItens}
      />

      <main className="pb-12">
        {activeTab === 'vitrine' && (
          <Vitrine cupcakes={cupcakes} adicionarAoCarrinho={adicionarAoCarrinho} />
        )}
        {activeTab === 'carrinho' && (
          <Carrinho
            carrinho={carrinho}
            setCarrinho={setCarrinho}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'login' && (
          <Login setActiveTab={setActiveTab} />
        )}
        {activeTab === 'admin' && (
          <Admin cupcakes={cupcakes} />
        )}
      </main>

      <footer className="text-center text-xs text-gray-400 py-4 border-t border-gray-100">
        CupcakeStore © 2026 — Projeto Integrador Transdisciplinar | Autor: Cláudio Matteo Assunção Lima
      </footer>
    </div>
  );
}
