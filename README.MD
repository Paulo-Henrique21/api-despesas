# 🏦 API Despesas - Backend

Uma API REST robusta para gerenciamento de despesas recorrentes, desenvolvida com Node.js, Express e MongoDB. Inclui autenticação JWT, testes automatizados e usuário demo para demonstrações.

## 🚀 Tecnologias Utilizadas

### Core
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB

### Autenticação & Segurança
- **JWT (jsonwebtoken)** - Autenticação via tokens
- **bcryptjs** - Criptografia de senhas
- **CORS** - Controle de acesso entre origens

### Utilitários
- **dotenv** - Gerenciamento de variáveis de ambiente
- **cookie-parser** - Manipulação de cookies
- **dayjs** - Manipulação de datas

### Testes
- **Jest** - Framework de testes
- **Supertest** - Testes de API
- **MongoDB Memory Server** - MongoDB em memória para testes

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- MongoDB (local ou remoto)

## ⚙️ Configuração

### 1. Clone e instale dependências

```bash
# Clone o projeto
git clone <url-do-repositorio>
cd despesas-recorrentes/api-despesas

# Instale as dependências
npm install
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Servidor
PORT=8000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:3000

# Banco de dados
MONGODB_URI=mongodb://localhost:27017/despesas_recorrentes

# Autenticação
JWT_SECRET=sua_chave_secreta_super_forte_aqui

# Registro
REGISTER_PASSWORD=admin123

# Usuário Demo
DEMO_USER_EMAIL=demo@exemplo.com
DEMO_USER_PASSWORD=visitante@2025
```

### 3. Execute o projeto

```bash
# Desenvolvimento
npm run dev

# Testes
npm test
npm run test:watch
npm run test:coverage
```

A API estará disponível em [http://localhost:8000](http://localhost:8000)

## 🏗️ Estrutura do Projeto

```
api-despesas/
├── src/
│   ├── config/           # Configurações (banco, etc)
│   ├── controllers/      # Controladores das rotas
│   ├── middlewares/      # Middlewares customizados
│   ├── models/          # Modelos do MongoDB
│   ├── routes/          # Definição das rotas
│   ├── services/        # Lógica de negócio
│   ├── tests/           # Testes automatizados
│   └── utils/           # Utilitários
├── mongo-init.js        # Script de inicialização do MongoDB
└── server.js           # Ponto de entrada da aplicação
```

## 🔐 Autenticação

### Registro de Usuário
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "minhasenha123",
  "registerPassword": "admin123"
}
```

### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "joao@exemplo.com",
  "password": "minhasenha123"
}
```

## 🎯 Endpoints Principais

### Despesas
```http
GET    /api/expenses          # Listar despesas
POST   /api/expenses          # Criar despesa
PUT    /api/expenses/:id      # Atualizar despesa
DELETE /api/expenses/:id      # Remover despesa
```

### Despesas Mensais
```http
GET    /api/monthly-expenses  # Listar despesas mensais
POST   /api/monthly-expenses  # Criar despesa mensal
PUT    /api/monthly-expenses/:id  # Atualizar
DELETE /api/monthly-expenses/:id  # Remover
```

### Pagamentos
```http
GET    /api/payments          # Listar pagamentos
POST   /api/payments          # Criar pagamento
PUT    /api/payments/:id      # Atualizar pagamento
DELETE /api/payments/:id      # Remover pagamento
```

### Variantes
```http
GET    /api/variants          # Listar variantes
POST   /api/variants          # Criar variante
PUT    /api/variants/:id      # Atualizar variante
DELETE /api/variants/:id      # Remover variante
```

## 🎪 Usuário Demo

O sistema inclui um usuário de demonstração com dados resetados automaticamente à meia-noite todos os dias.

### Credenciais Demo
```http
GET /api/demo/credentials
```

**Resposta:**
```json
{
  "message": "Credenciais do usuário demo",
  "credentials": {
    "email": "demo@exemplo.com",
    "password": "visitante@2025"
  },
  "note": "Dados resetados diariamente à meia-noite"
}
```

### Reset Manual
```http
POST /api/demo/reset
```

### Inicializar Demo
```http
POST /api/demo/initialize
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Modo watch (desenvolvimento)
npm run test:watch

# Cobertura de código
npm run test:coverage

# Testes verbosos
npm run test:verbose
```

## 🐳 Docker

```bash
# Build da imagem
docker build -t api-despesas .

# Executar com Docker Compose
docker-compose up -d
```

## 🔐 Variáveis de Ambiente Obrigatórias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `PORT` | Porta do servidor | `8000` |
| `MONGODB_URI` | URI do MongoDB | `mongodb://localhost:27017/despesas` |
| `JWT_SECRET` | Chave secreta JWT | `chave-super-secreta` |
| `FRONTEND_URL` | URL do frontend | `http://localhost:3000` |
| `REGISTER_PASSWORD` | Senha para registro | `admin123` |
| `DEMO_USER_EMAIL` | Email do usuário demo | `demo@exemplo.com` |
| `DEMO_USER_PASSWORD` | Senha do usuário demo | `visitante@2025` |

## 📊 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento com nodemon
npm test             # Executar testes
npm run test:watch   # Testes em modo watch
npm run test:coverage # Cobertura de testes
```

## 🤝 Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença ISC.

## 👨‍💻 Autor

Paulo Henrique - [@Paulo-Henrique21](https://github.com/Paulo-Henrique21)

---

⭐ Dê uma estrela se este projeto te ajudou!
