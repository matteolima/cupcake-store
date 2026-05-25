# 🧁 CupcakeStore — Loja Virtual de Cupcakes

Protótipo funcional de uma loja virtual de cupcakes desenvolvido como **Projeto Integrador Transdisciplinar 2026-1**.

**Autor:** Cláudio Matteo Assunção Lima

---

## 🚀 Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + Vite |
| Estilização | Tailwind CSS |
| Ícones | Lucide React |
| Dados | Mock (useState) |

---

## 📦 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior
- npm (incluso com o Node.js)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/cupcake-store.git

# 2. Entre na pasta do projeto
cd cupcake-store

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em: **http://localhost:5173**

---

## 🗂️ Estrutura do Projeto

```
cupcake-store/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx      # Menu de navegação fixo
│   │   ├── Vitrine.jsx     # Grid de produtos
│   │   ├── Carrinho.jsx    # Sacola de compras
│   │   ├── Login.jsx       # Tela de autenticação
│   │   └── Admin.jsx       # Painel administrativo
│   ├── data/
│   │   └── cupcakes.js     # Dados mockados dos produtos
│   ├── App.jsx             # Componente raiz com estado global
│   ├── main.jsx            # Ponto de entrada React
│   └── index.css           # Estilos globais + Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## ✨ Funcionalidades

- **Vitrine:** Grid de cupcakes com botão "Adicionar ao Carrinho"
- **Carrinho:** Gerenciamento de itens com quantidade e total
- **Login:** Autenticação simulada com redirecionamento para o Admin
- **Painel Admin:** Dashboard com cards de resumo e tabela de estoque

---

## 📄 Licença

Este projeto é de uso acadêmico — Cruzeiro do Sul, 2026.
