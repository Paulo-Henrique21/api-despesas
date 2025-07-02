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
```
