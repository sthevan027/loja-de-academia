🏋️ Ritmoalpha | Loja de Academia
Loja virtual moderna focada no universo fitness, desenvolvida em React e integrada a banco de dados SQL. Projeto rápido, escalável e pensado para performance e facilidade de manutenção.

🚀 Tecnologias Utilizadas
Frontend: React + Vite + TypeScript + TailwindCSS

Backend: Node.js + Express

Banco de Dados: SQL (MySQL / PostgreSQL)

📦 Estrutura do Projeto
pgsql
Copiar
Editar
ritmoalpha/
├── frontend/        # Aplicação React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── backend/         # API Node.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   └── app.ts
│   ├── package.json
│   └── tsconfig.json
└── README.md
⚙️ Funcionalidades
Cadastro e login de usuários

Área administrativa para gerenciamento de produtos (opcional)

Listagem de produtos para compra

Integração com banco de dados SQL

Layout responsivo para mobile e desktop

Sistema de carrinho de compras (opcional)

🛠️ Como Rodar Localmente
Clone o repositório:

bash
Copiar
Editar
git clone https://github.com/seu-usuario/ritmoalpha.git
Instale as dependências:

bash
Copiar
Editar
cd frontend
npm install
cd ../backend
npm install
Configure o ambiente:

Crie o arquivo .env no backend com as credenciais do seu banco SQL.

Exemplo:

ini
Copiar
Editar
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=ritmoalpha
JWT_SECRET=sua_chave_secreta
Inicie o projeto:

bash
Copiar
Editar
# Em dois terminais diferentes
cd frontend
npm run dev

cd backend
npm run dev
Acesse:

Frontend: http://localhost:5173

Backend API: http://localhost:3000

📢 Créditos
Desenvolvido com ❤️ pela equipe da DevLoop.

#   e - c o m e c e  
 