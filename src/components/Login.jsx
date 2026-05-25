import { useState } from 'react';
import { LogIn, Lock, Mail, Eye, EyeOff, UserPlus } from 'lucide-react';
import { login } from '../auth/auth';

export default function Login({ setActiveTab, setUsuarioLogado }) {
  const [email,      setEmail]      = useState('');
  const [senha,      setSenha]      = useState('');
  const [verSenha,   setVerSenha]   = useState(false);
  const [erro,       setErro]       = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setErro('');

    if (!email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }

    setCarregando(true);
    setTimeout(() => {
      const usuario = login(email, senha);
      setCarregando(false);

      if (!usuario) {
        setErro('E-mail ou senha incorretos, ou conta inativa.');
        return;
      }

      setUsuarioLogado(usuario);
      setActiveTab(usuario.tipo === 'admin' ? 'admin' : 'vitrine');
    }, 400);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-pink-100">

        <div className="text-center mb-8">
          <span className="text-5xl">🧁</span>
          <h1 className="text-2xl font-bold text-pink-700 mt-3">Acesso ao Sistema</h1>
          <p className="text-gray-400 text-sm mt-1">Entre com suas credenciais</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <div className="relative">
              <Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={verSenha ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
              />
              <button
                type="button"
                onClick={() => setVerSenha(!verSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {verSenha ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {erro && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors text-base"
          >
            {carregando ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            ) : (
              <LogIn size={18} />
            )}
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Contas de teste */}
        <div className="mt-5 p-3 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Contas de teste</p>
          <div className="space-y-1 text-xs text-gray-600">
            <p><span className="font-medium text-pink-600">Admin:</span> admin@cupcakestore.com / admin123</p>
            <p><span className="font-medium text-blue-600">Cliente:</span> ana@email.com / senha123</p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Não tem conta?{' '}
          <button
            onClick={() => setActiveTab('cadastro')}
            className="text-pink-600 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <UserPlus size={14} />
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
}
