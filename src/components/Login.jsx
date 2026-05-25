import { useState } from 'react';
import { LogIn, Lock, Mail } from 'lucide-react';

export default function Login({ setActiveTab }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }
    // Login simulado — qualquer e-mail e senha são aceitos
    setErro('');
    setActiveTab('admin');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-pink-100">
        <div className="text-center mb-8">
          <span className="text-5xl">🧁</span>
          <h1 className="text-2xl font-bold text-pink-700 mt-3">Acesso ao Sistema</h1>
          <p className="text-gray-400 text-sm mt-1">Entre com suas credenciais para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cupcakestore.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
              />
            </div>
          </div>

          {erro && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {erro}
            </p>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg transition-colors text-base"
          >
            <LogIn size={18} />
            Acessar
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Protótipo simulado — qualquer credencial é aceita.
        </p>
      </div>
    </div>
  );
}
