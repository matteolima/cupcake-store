import { useState } from 'react';
import { Save, MapPin, Truck, CreditCard, QrCode } from 'lucide-react';
import { saveConfig } from '../../data/storage';

const ABAS = [
  { id: 'loja',      label: 'Endereço',  Icone: MapPin },
  { id: 'entrega',   label: 'Entrega',   Icone: Truck },
  { id: 'pagamento', label: 'Pagamento', Icone: CreditCard },
  { id: 'pix',       label: 'PIX',       Icone: QrCode },
];

function Toggle({ ativo, onChange }) {
  return (
    <button onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${ativo ? 'bg-pink-600' : 'bg-gray-300'}`}>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${ativo ? 'left-7' : 'left-1'}`} />
    </button>
  );
}

function Campo({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
    </div>
  );
}

export default function Configuracoes({ config, setConfig }) {
  const [aba,   setAba]   = useState('loja');
  const [salvo, setSalvo] = useState(false);

  const up = (secao, campo, valor) =>
    setConfig((prev) => ({ ...prev, [secao]: { ...prev[secao], [campo]: valor } }));

  const salvar = () => { saveConfig(config); setSalvo(true); setTimeout(() => setSalvo(false), 2500); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Configurações da Loja</h1>
          <p className="text-gray-400 text-sm mt-1">Gerencie endereço, entrega, pagamento e PIX</p>
        </div>
        <button onClick={salvar}
          className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all ${salvo ? 'bg-green-500 text-white' : 'bg-pink-600 hover:bg-pink-700 text-white'}`}>
          <Save size={16} />
          {salvo ? 'Salvo!' : 'Salvar alterações'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Abas */}
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {ABAS.map(({ id, label, Icone }) => (
            <button key={id} onClick={() => setAba(id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                ${aba === id ? 'border-pink-600 text-pink-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              <Icone size={15} />{label}
            </button>
          ))}
        </div>

        <div className="p-6 max-w-lg">
          {/* ── Endereço ── */}
          {aba === 'loja' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 mb-1">Informações da Loja</h3>
              {[
                { label: 'Nome da Loja', campo: 'nome' },
                { label: 'Endereço',     campo: 'endereco' },
                { label: 'Cidade',       campo: 'cidade' },
                { label: 'Estado',       campo: 'estado' },
                { label: 'CEP',          campo: 'cep' },
                { label: 'Telefone',     campo: 'telefone' },
                { label: 'E-mail',       campo: 'email' },
              ].map(({ label, campo }) => (
                <Campo key={campo} label={label} value={config.loja[campo]}
                  onChange={(e) => up('loja', campo, e.target.value)} />
              ))}
            </div>
          )}

          {/* ── Entrega ── */}
          {aba === 'entrega' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 mb-1">Configurações de Entrega</h3>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-800">Entrega habilitada</p>
                  <p className="text-xs text-gray-400">Permite pedidos de delivery</p>
                </div>
                <Toggle ativo={config.entrega.ativa} onChange={() => up('entrega', 'ativa', !config.entrega.ativa)} />
              </div>
              <Campo label="Taxa de entrega (R$)" type="number" value={config.entrega.taxaFixa}
                onChange={(e) => up('entrega', 'taxaFixa', parseFloat(e.target.value))} />
              <Campo label="Frete grátis acima de (R$)" type="number" value={config.entrega.gratis_acima}
                onChange={(e) => up('entrega', 'gratis_acima', parseFloat(e.target.value))} />
              <Campo label="Raio de entrega (km)" type="number" value={config.entrega.raio_km}
                onChange={(e) => up('entrega', 'raio_km', parseInt(e.target.value))} />
            </div>
          )}

          {/* ── Pagamento ── */}
          {aba === 'pagamento' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 mb-1">Métodos de Pagamento</h3>
              {[
                { campo: 'pix',            label: 'PIX',              desc: 'Pagamento instantâneo' },
                { campo: 'cartao_credito', label: 'Cartão de Crédito', desc: 'Visa, Mastercard, etc.' },
                { campo: 'cartao_debito',  label: 'Cartão de Débito',  desc: 'Débito à vista' },
                { campo: 'dinheiro',       label: 'Dinheiro',           desc: 'Pagamento em espécie' },
              ].map(({ campo, label, desc }) => (
                <div key={campo} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{label}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                  <Toggle ativo={config.pagamento[campo]}
                    onChange={() => up('pagamento', campo, !config.pagamento[campo])} />
                </div>
              ))}
            </div>
          )}

          {/* ── PIX ── */}
          {aba === 'pix' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 mb-1">Configuração do PIX</h3>
              <div>
                <label className="text-sm font-medium text-gray-700">Tipo de Chave</label>
                <select value={config.pix.tipo} onChange={(e) => up('pix', 'tipo', e.target.value)}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
                  <option value="email">E-mail</option>
                  <option value="cpf">CPF</option>
                  <option value="cnpj">CNPJ</option>
                  <option value="telefone">Telefone</option>
                  <option value="aleatoria">Chave Aleatória</option>
                </select>
              </div>
              <Campo label="Chave PIX" value={config.pix.chave} placeholder="Sua chave PIX"
                onChange={(e) => up('pix', 'chave', e.target.value)} />
              <Campo label="Nome do Titular" value={config.pix.titular} placeholder="Nome como aparece no PIX"
                onChange={(e) => up('pix', 'titular', e.target.value)} />

              {/* Preview */}
              <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <p className="text-xs text-gray-400 uppercase font-semibold mb-3">Preview</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                    🔑
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{config.pix.titular || '—'}</p>
                    <p className="text-xs text-gray-600">{config.pix.chave || '—'}</p>
                    <span className="text-xs text-gray-400 uppercase font-semibold">{config.pix.tipo}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
