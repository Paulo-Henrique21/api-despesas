# Mock API - Despesas

## Descrição
Este é um projeto de API simulada (mock) para o sistema de despesas.

## Pré-requisitos
- Node.js instalado
- NPM (Node Package Manager)

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
```

2. Navegue até o diretório do projeto:
```bash
cd mock-api
```

3. Instale as dependências:
```bash
npm install
```

## Como executar

1. Inicie o servidor:
```bash
npm start
```

2. O servidor estará rodando em `http://localhost:3000`

## Rotas disponíveis
- GET /despesas - Lista todas as despesas
- POST /despesas - Cria uma nova despesa
- PUT /despesas/:id - Atualiza uma despesa
- DELETE /despesas/:id - Remove uma despesa

## Contribuindo
Para contribuir com o projeto, por favor:
1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Faça commit das alterações
4. Push para a branch
5. Abra um Pull Request

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
PORT=8000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=link-do-seu-banco
JWT_SECRET=sua_chave_secreta_aqui
REGISTER_PASSWORD=admin123
DEMO_USER_EMAIL=demo@exemplo.com
DEMO_USER_PASSWORD=demo123
```

## Autenticação

### Registro de Usuário
Para registrar um novo usuário, é necessário fornecer uma senha de registro configurada na variável de ambiente `REGISTER_PASSWORD`. 

**Endpoint:** `POST /api/users/register`

**Body:**
```json
{
  "name": "Nome do Usuário",
  "email": "email@exemplo.com",
  "password": "senha_do_usuario",
  "registerPassword": "admin123"
}
```

### Login
**Endpoint:** `POST /api/users/login`

**Body:**
```json
{
  "email": "email@exemplo.com",
  "password": "senha_do_usuario"
}
```

## Usuário Demo

O sistema inclui um usuário de demonstração que é automaticamente criado e tem seus dados resetados todos os dias à meia-noite. Este usuário é útil para testes e demonstrações da aplicação.

### Características do Usuário Demo:
- **Email:** demo@exemplo.com (configurável via `DEMO_USER_EMAIL`)
- **Senha:** demo123 (configurável via `DEMO_USER_PASSWORD`)
- **Reset automático:** Todos os dias à meia-noite
- **Dados de exemplo:** Criados automaticamente após cada reset

### Endpoints do Demo:

#### Obter Credenciais do Demo
**Endpoint:** `GET /api/demo/credentials`

**Resposta:**
```json
{
  "message": "Credenciais do usuário demo",
  "credentials": {
    "email": "demo@exemplo.com",
    "password": "demo123"
  },
  "note": "Este usuário tem seus dados resetados diariamente à meia-noite"
}
```

#### Reset Manual do Demo
**Endpoint:** `POST /api/demo/reset`

**Resposta:**
```json
{
  "message": "Dados do usuário demo resetados com sucesso",
  "timestamp": "2025-08-18T14:30:00.000Z"
}
```

#### Inicializar Demo
**Endpoint:** `POST /api/demo/initialize`

**Resposta:**
```json
{
  "message": "Usuário demo inicializado com sucesso",
  "user": {
    "id": "...",
    "name": "Usuário Demo",
    "email": "demo@exemplo.com",
    "role": "user"
  }
}
```
