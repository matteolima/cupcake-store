import { useState } from 'react';
import {
  MapPin, CreditCard, Banknote, Smartphone, ShoppingBag,
  CheckCircle, ChevronRight, Copy, Check, Truck, Store,
} from 'lucide-react';
import { addPedido, gerarIdPedido } from '../data/storage';

const PAGAMENTO_INFO = {
  pix:            { label: 'PIX',              emoji: '📱', desc: 'Aprovação instantânea' },
  cartao_credito: { label: 'Cartão de Crédito', emoji: '💳', desc: 'Débito em até 12x' },
  cartao_debito:  { label: 'Cartão de Débito',  emoji: '💳', desc: 'Débito à vista' },
  dinheiro:       { label: 'Dinheiro',           emoji: '💵', desc: 'Pague na entrega/retirada' },
};

function Secao({ numero, titulo, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50">
        <span className="w-7 h-7 rounded-full bg-pink-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
          {numero}
        </span>
        <h2 className="font-bold text-gray-800">{titulo}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function Checkout({ carrinho, setCarrinho, setActiveTab, usuarioLogado, config }) {
  const subtotal     = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0);
  const entregaAtiva = config?.entrega?.ativa ?? true;
  const taxaEntrega  = config?.entrega?.taxaFixa ?? 8;
  const gratis_acima = config?.entrega?.gratis_acima ?? 80;
  const pagamentos   = config?.pagamento ?? { pix: true, cartao_credito: true, cartao_debito: true, dinheiro: true };
  const pixInfo      = config?.pix ?? { chave: '', titular: '', tipo: 'email' };
  const metodos      = Object.entries(pagamentos).filter(([, v]) => v).map(([k]) => k);

  const [tipoEntrega,  setTipoEntrega]  = useState(entregaAtiva ? 'delivery' : 'retirada');
  const [pagamento,    setPagamento]    = useState(metodos[0] ?? 'pix');
  const [endereco,     setEndereco]     = useState({ nome: usuarioLogado?.nome ?? '', rua: '', cidade: '', cep: '', telefone: '' });
  const [troco,        setTroco]        = useState('');
  const [copiado,      setCopiado]      = useState(false);
  const [pedidoFeito,  setPedidoFeito]  = useState(null);
  const [erros,        setErros]        = useState({});

  const taxaAplicada = tipoEntrega === 'delivery' && subtotal < gratis_acima ? taxaEntrega : 0;
  const total        = subtotal + taxaAplicada;

  const upEnd = (campo, valor) => setEndereco((p) => ({ ...p, [campo]: valor }));

  const copiarPix = () => {
    navigator.clipboard.writeText(pixInfo.chave).catch(() => {});
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const validar = () => {
    const e = {};
    if (tipoEntrega === 'delivery') {
      if (!endereco.rua.trim())     e.rua      = 'Informe o endereço';
      if (!endereco.cidade.trim())  e.cidade   = 'Informe a cidade';
      if (!endereco.cep.trim())     e.cep      = 'Informe o CEP';
      if (!endereco.telefone.trim()) e.telefone = 'Informe o telefone';
    }
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const confirmar = () => {
    if (!validar()) return;
    const pedido = {
      id:          gerarIdPedido(),
      userId:      usuarioLogado?.id ?? null,
      cliente:     usuarioLogado?.nome ?? 'Visitante',
      email:       usuarioLogado?.email ?? '',
      itens:       carrinho.map(({ id, nome, preco, quantidade, emoji, cor }) => ({ id, nome, preco, quantidade, emoji, cor })),
      subtotal,
      taxaEntrega: taxaAplicada,
      total,
      pagamento,
      entrega:     tipoEntrega,
      endereco:    tipoEntrega === 'delivery' ? endereco : null,
      troco:       pagamento === 'dinheiro' ? troco : null,
      status:      'pendente',
      data:        new Date().toISOString().split('T')[0],
      hora:        new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    addPedido(pedido);
    setCarrinho([]);
    setPedidoFeito(pedido);
  };

  // ── Tela de sucesso ────────────────────────────────────────────────────────
  if (pedidoFeito) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 flex flex-col items-center text-center">
        <CheckCircle size={72} className="text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Pedido confirmado!</h2>
        <p className="text-gray-500 mb-1">Pedido <strong className="font-mono">{pedidoFeito.id}</strong></p>
        <p className="text-gray-400 text-sm mb-6">
          {pedidoFeito.entrega === 'delivery' ? 'Entrega em até 60 min.' : 'Pronto para retirada em breve.'}
        </p>

        {pagamento === 'pix' && (
          <div className="w-full bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 text-left">
            <p className="text-sm font-bold text-green-800 mb-3">Pague via PIX</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl shrink-0">🔑</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">{pixInfo.tipo.toUpperCase()}</p>
                <p className="font-bold text-gray-800 truncate">{pixInfo.chave}</p>
                <p className="text-xs text-gray-500">{pixInfo.titular}</p>
              </div>
              <button onClick={copiarPix}
                className="shrink-0 flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                {copiado ? <Check size={13} /> : <Copy size={13} />}
                {copiado ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <p className="text-xs text-green-700 mt-3 font-semibold">
              Valor: R$ {pedidoFeito.total.toFixed(2).replace('.', ',')}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          {usuarioLogado && (
            <button onClick={() => setActiveTab('perfil')}
              className="flex-1 border border-pink-600 text-pink-600 font-semibold py-3 rounded-xl hover:bg-pink-50 transition-colors">
              Ver meus pedidos
            </button>
          )}
          <button onClick={() => setActiveTab('vitrine')}
            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl transition-colors">
            Continuar comprando
          </button>
        </div>
      </div>
    );
  }

  // ── Formulário de checkout ─────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-pink-700">Finalizar Pedido</h1>
        <p className="text-gray-400 text-sm mt-1">Revise e confirme seu pedido</p>
      </div>

      {/* ── 1. Resumo ── */}
      <Secao numero="1" titulo="Resumo do pedido">
        <div className="space-y-3">
          {carrinho.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <span className={`${item.cor} w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0`}>
                {item.imagem
                  ? <img src={item.imagem} alt={item.nome} className="w-9 h-9 rounded-full object-cover" />
                  : item.emoji}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{item.nome}</p>
                <p className="text-xs text-gray-400">{item.quantidade}× R$ {item.preco.toFixed(2).replace('.', ',')}</p>
              </div>
              <p className="text-sm font-bold text-gray-800">
                R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
              </p>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-3 space-y-1">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            {tipoEntrega === 'delivery' && (
              <div className="flex justify-between text-sm text-gray-500">
                <span>Taxa de entrega</span>
                <span className={taxaAplicada === 0 ? 'text-green-600 font-semibold' : ''}>
                  {taxaAplicada === 0 ? 'Grátis 🎉' : `R$ ${taxaAplicada.toFixed(2).replace('.', ',')}`}
                </span>
              </div>
            )}
            {tipoEntrega === 'delivery' && subtotal < gratis_acima && (
              <p className="text-xs text-pink-500">
                Frete grátis em pedidos acima de R$ {gratis_acima.toFixed(2).replace('.', ',')}
              </p>
            )}
            <div className="flex justify-between font-bold text-gray-800 text-base pt-1">
              <span>Total</span>
              <span className="text-pink-600">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>
      </Secao>

      {/* ── 2. Entrega ── */}
      <Secao numero="2" titulo="Modo de recebimento">
        <div className="grid grid-cols-2 gap-3">
          {entregaAtiva && (
            <button onClick={() => setTipoEntrega('delivery')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                ${tipoEntrega === 'delivery' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-200'}`}>
              <Truck size={22} className={tipoEntrega === 'delivery' ? 'text-pink-600' : 'text-gray-400'} />
              <span className={`text-sm font-semibold ${tipoEntrega === 'delivery' ? 'text-pink-700' : 'text-gray-600'}`}>Delivery</span>
              <span className="text-xs text-gray-400">
                {taxaEntrega === 0 ? 'Grátis' : `R$ ${taxaEntrega.toFixed(2).replace('.', ',')}`}
              </span>
            </button>
          )}
          <button onClick={() => setTipoEntrega('retirada')}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
              ${tipoEntrega === 'retirada' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-200'}`}>
            <Store size={22} className={tipoEntrega === 'retirada' ? 'text-pink-600' : 'text-gray-400'} />
            <span className={`text-sm font-semibold ${tipoEntrega === 'retirada' ? 'text-pink-700' : 'text-gray-600'}`}>Retirada</span>
            <span className="text-xs text-gray-400">Na loja • Grátis</span>
          </button>
        </div>

        {tipoEntrega === 'delivery' && (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPin size={15} className="text-pink-500" /> Endereço de entrega
            </p>
            {[
              { campo: 'nome',     label: 'Nome do destinatário', placeholder: 'Quem vai receber?' },
              { campo: 'rua',      label: 'Rua e número *',       placeholder: 'Rua das Flores, 123 — Apto 4' },
              { campo: 'cidade',   label: 'Cidade *',             placeholder: 'São Paulo' },
              { campo: 'cep',      label: 'CEP *',                placeholder: '00000-000' },
              { campo: 'telefone', label: 'Telefone *',           placeholder: '(11) 99999-9999' },
            ].map(({ campo, label, placeholder }) => (
              <div key={campo}>
                <label className="text-xs font-medium text-gray-600">{label}</label>
                <input
                  value={endereco[campo]}
                  onChange={(e) => upEnd(campo, e.target.value)}
                  placeholder={placeholder}
                  className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400
                    ${erros[campo] ? 'border-red-300' : 'border-gray-200'}`}
                />
                {erros[campo] && <p className="text-xs text-red-500 mt-0.5">{erros[campo]}</p>}
              </div>
            ))}
          </div>
        )}

        {tipoEntrega === 'retirada' && config?.loja && (
          <div className="mt-3 p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
            <p className="font-semibold text-gray-700 mb-1">📍 Endereço da loja</p>
            <p>{config.loja.endereco}, {config.loja.cidade} — {config.loja.estado}</p>
            <p>{config.loja.telefone}</p>
          </div>
        )}
      </Secao>

      {/* ── 3. Pagamento ── */}
      <Secao numero="3" titulo="Forma de pagamento">
        {metodos.length === 0 ? (
          <p className="text-sm text-gray-400">Nenhum método de pagamento habilitado. Contate a loja.</p>
        ) : (
          <div className="space-y-2">
            {metodos.map((key) => {
              const info = PAGAMENTO_INFO[key];
              return (
                <button key={key} onClick={() => setPagamento(key)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left
                    ${pagamento === key ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-200'}`}>
                  <span className="text-xl shrink-0">{info.emoji}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${pagamento === key ? 'text-pink-700' : 'text-gray-700'}`}>
                      {info.label}
                    </p>
                    <p className="text-xs text-gray-400">{info.desc}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center
                    ${pagamento === key ? 'border-pink-500 bg-pink-500' : 'border-gray-300'}`}>
                    {pagamento === key && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* PIX: exibe a chave */}
        {pagamento === 'pix' && pixInfo.chave && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-xs font-semibold text-green-700 uppercase mb-2">Chave PIX</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">{pixInfo.tipo.toUpperCase()} • {pixInfo.titular}</p>
                <p className="font-bold text-gray-800 truncate">{pixInfo.chave}</p>
              </div>
              <button onClick={copiarPix}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0">
                {copiado ? <Check size={13} /> : <Copy size={13} />}
                {copiado ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <p className="text-xs text-green-600 mt-2">
              ⚠️ O pagamento deve ser enviado após confirmar o pedido.
            </p>
          </div>
        )}

        {/* Dinheiro: campo de troco */}
        {pagamento === 'dinheiro' && (
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">Precisa de troco para quanto?</label>
            <input
              type="number" value={troco}
              onChange={(e) => setTroco(e.target.value)}
              placeholder="Ex: 50,00 (deixe vazio se não precisar)"
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
        )}
      </Secao>

      {/* ── Botão confirmar ── */}
      <button onClick={confirmar}
        className="w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-2xl transition-colors text-lg shadow-lg">
        <ShoppingBag size={22} />
        Confirmar pedido · R$ {total.toFixed(2).replace('.', ',')}
      </button>

      <button onClick={() => setActiveTab('carrinho')}
        className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors py-1">
        ← Voltar ao carrinho
      </button>
    </div>
  );
}
