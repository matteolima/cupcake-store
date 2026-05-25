import { useState } from 'react';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';
import { register } from '../auth/auth';

export default function Cadastro({ setActiveTab, setUsuarioLogado }) {
  const [nome,           setNome]           = useState('');
  const [email,          setEmail]          = useState('');
  const [senha,          setSenha]          = useState('');
  const [confirmar,      setConfirmar]      = useState('');
  const [tipo,           setTipo]           = useState('cliente');
  const [codigoAdmin,    setCodigoAdmin]    = useState('');
  const [verSenha,       setVerSenha]       = useState(false);
  const [erro,           setErro]           = useState('');
  const [sucesso,        setSucesso]        = useState(false);
  const [carregando,     setCarregando]     = useState(false);

  const forca = (() => {
    let pts = 0;
    if (senha.length >= 6)                              pts++;
    if (senha.length >= 10)                             pts++;
    if (/[A-Z]/.test(senha))                            pts++;
    if (/[0-9]/.test(senha))                            pts++;
    if (/[^A-Za-z0-9]/.test(senha))                    pts++;
    return pts;
  })();

  const forcaLabel = ['', 'Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'][forca];
  const forcaCor   = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-blue-500', 'bg-green-500'][forca];

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro('');

    if (!nome.trim() || !email.trim() || !senha || !confirmar) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (senha !== confirmar) {
      setErro('As senhas não coincidem.');
      return;
    }

    setCarregando(true);
    // Simula um pequeno delay de processamento
    setTimeout(() => {
      const resultado = register({ nome, email, senha, tipo, codigoAdmin });
      setCarregando(false);

      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }

      setSucesso(true);
      setUsuarioLogado(resultado);
      setTimeout(() => {
        setActiveTab(resultado.tipo === 'admin' ? 'admin' : 'vitrine');
      }, 1800);
    }, 600);
  };

  if (sucesso) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-pink-100 text-center">
          <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Cadastro realizado!</h2>
          <p className="text-gray-500 text-sm">
            Bem-vindo(a), <strong>{nome}</strong>! Redirecionando...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-pink-100">

        {/* Cabeçalho */}
        <div className="text-center mb-7">
          <span className="text-5xl">🧁</span>
          <h1 className="text-2xl font-bold text-pink-700 mt-3">Criar conta</h1>
          <p className="text-gray-400 text-sm mt-1">Junte-se à CupcakeStore</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Tipo de conta */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { valor: 'cliente', label: 'Cliente',       emoji: '🛍️' },
              { valor: 'admin',   label: 'Administrador', emoji: '🔧' },
            ].map(({ valor, label, emoji }) => (
              <button
                key={valor}
                type="button"
                onClick={() => { setTipo(valor); setCodigoAdmin(''); }}
                className={`flex flex-col items-center gap-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all
                  ${tipo === valor
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 text-gray-600 hover:border-pink-300'}`}
              >
                <span className="text-xl">{emoji}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
            <div className="relative">
              <User size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <div className="relative">
              <Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={verSenha ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <button
                type="button"
                onClick={() => setVerSenha(!verSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {verSenha ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Força da senha */}
            {senha.length > 0 && (
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${forcaCor}`}
                    style={{ width: `${(forca / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{forcaLabel}</span>
              </div>
            )}
          </div>

          {/* Confirmar senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar senha</label>
            <div className="relative">
              <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={verSenha ? 'text' : 'password'}
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                placeholder="Repita a senha"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400
                  ${confirmar && confirmar !== senha ? 'border-red-300' : 'border-gray-200'}`}
              />
              {confirmar && confirmar === senha && (
                <CheckCircle size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
              )}
            </div>
          </div>

          {/* Código admin (somente se tipo=admin) */}
          {tipo === 'admin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de Administrador
                <span className="ml-1 text-xs text-gray-400 font-normal">(obrigatório)</span>
              </label>
              <div className="relative">
                <Shield size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={codigoAdmin}
                  onChange={(e) => setCodigoAdmin(e.target.value)}
                  placeholder="Código fornecido pelo gestor"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
            </div>
          )}

          {/* Erro */}
          {erro && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {erro}
            </p>
          )}

          {/* Botão */}
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
              <UserPlus size={18} />
            )}
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        {/* Link para login */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Já tem conta?{' '}
          <button
            onClick={() => setActiveTab('login')}
            className="text-pink-600 font-semibold hover:underline"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
}
