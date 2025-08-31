
# 🏦 API Despesas - Backend

API REST para controle de despesas recorrentes, desenvolvida com Node.js, Express e MongoDB. Possui autenticação JWT, testes automatizados e usuário demo para demonstração.

## 🚀 Tecnologias Utilizadas

### Core
- **Node.js**
```

## 🔐 Variáveis de Ambiente Obrigatórias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `PORT` | Porta do servidor | `8000` |
| `MONGODB_URI` | URI do MongoDB | `mongodb://localhost:27017/despesas_recorrentes` |
| `JWT_SECRET` | Chave secreta JWT | `chave-super-secreta` |
| `FRONTEND_URL` | URL do frontend | `http://localhost:3000` |
| `REGISTER_PASSWORD` | Senha para registro | `admin123` |
| `DEMO_USER_EMAIL` | Email do usuário demo | `demo@exemplo.com` |
| `DEMO_USER_PASSWORD` | Senha do usuário demo | `visitante@2025` |

## 🎯 Endpoints Principais

### Usuários
- `POST /api/users/register` — Cadastro de usuário
- `POST /api/users/login` — Login

### Despesas
- `GET /api/expenses` — Listar despesas
- `POST /api/expenses` — Criar despesa
- `PUT /api/expenses/:id` — Atualizar despesa
- `DELETE /api/expenses/:id` — Remover despesa

### Despesas Mensais
- `GET /api/monthly-expenses` — Listar despesas mensais
- `POST /api/monthly-expenses` — Criar despesa mensal
- `PUT /api/monthly-expenses/:id` — Atualizar
- `DELETE /api/monthly-expenses/:id` — Remover

### Pagamentos
- `GET /api/payments` — Listar pagamentos
- `POST /api/payments` — Criar pagamento
- `PUT /api/payments/:id` — Atualizar pagamento
- `DELETE /api/payments/:id` — Remover pagamento

### Variantes
- `GET /api/variants` — Listar variantes
- `POST /api/variants` — Criar variante
- `PUT /api/variants/:id` — Atualizar variante
- `DELETE /api/variants/:id` — Remover variante

### Usuário Demo
- `GET /api/demo/credentials` — Obter credenciais demo
- `POST /api/demo/reset` — Resetar dados demo
- `POST /api/demo/initialize` — Inicializar demo

## � Docker

```bash
# Build da imagem
  "registerPassword": "admin123"

# Executar com Docker Compose
}
```

## 🤝 Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/sua-feature`)
3. Commit suas mudanças (`git commit -m 'feat: minha feature'`)
4. Push para a branch (`git push origin feature/sua-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença ISC.

## 👨‍💻 Autor

Paulo Henrique - [@Paulo-Henrique21](https://github.com/Paulo-Henrique21)

---

⭐ Dê uma estrela se este projeto te ajudou!
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
