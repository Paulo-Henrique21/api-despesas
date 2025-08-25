# Guia de Testes com Jest

Este projeto utiliza Jest para testes automatizados, proporcionando uma forma eficaz de prevenir erros e garantir a qualidade do código.

## 🚀 Scripts de Teste Disponíveis

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (re-executa quando arquivos mudam)
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage

# Executar testes com saída detalhada
npm run test:verbose
```

## 📁 Estrutura dos Testes

```
src/tests/
├── setup.js                           # Configuração global dos testes
├── testUtils.js                       # Utilitários para testes
├── userController.test.js              # Testes do controller de usuários
├── userModel.test.js                  # Testes do modelo User
├── userRoutes.integration.test.js     # Testes de integração das rotas
├── authMiddleware.test.js             # Testes do middleware de autenticação
└── expenseController.test.js          # Testes do controller de despesas
```

## 🛠️ Tipos de Teste Implementados

### 1. **Testes Unitários**
- Testam funções e componentes isoladamente
- Exemplos: controllers, middlewares, models

### 2. **Testes de Integração**
- Testam a integração entre diferentes partes do sistema
- Exemplos: rotas completas, fluxos de autenticação

### 3. **Testes de Modelo**
- Validam as regras de negócio dos modelos
- Verificam validações, constraints, etc.

## 🔧 Configuração

### Jest (jest.config.js)
- **Ambiente**: Node.js
- **Cobertura**: Arquivos em `src/` exceto testes
- **Setup**: MongoDB em memória para testes isolados

### Babel (babel.config.js)
- Suporte a ES Modules
- Transpilação para versão atual do Node.js

## 📊 Relatórios de Cobertura

Execute `npm run test:coverage` para gerar relatórios detalhados:
- **Terminal**: Resumo da cobertura
- **HTML**: Relatório detalhado em `coverage/lcov-report/index.html`

## 🎯 Boas Práticas Implementadas

### 1. **Isolamento de Testes**
- Cada teste é executado em ambiente limpo
- MongoDB em memória evita conflitos
- Limpeza automática entre testes

### 2. **Utilitários de Teste**
- Funções helper para criar dados de teste
- Mocks padronizados para requisições/respostas
- Geração automática de tokens de autenticação

### 3. **Testes Abrangentes**
- Casos de sucesso e erro
- Validação de dados
- Comportamentos edge cases

## 📝 Exemplos de Uso

### Testando um Controller

```javascript
describe('User Controller', () => {
  it('should register a new user successfully', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      registerPassword: process.env.REGISTER_PASSWORD
    };

    const response = await request(app)
      .post('/register')
      .send(userData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(userData.name);
  });
});
```

### Testando um Middleware

```javascript
describe('Auth Middleware', () => {
  it('should authenticate valid token', () => {
    const token = jwt.sign({ userId: '123' }, process.env.JWT_SECRET);
    req.cookies.token = token;

    authenticateToken(req, res, next);

    expect(req.user.userId).toBe('123');
    expect(next).toHaveBeenCalled();
  });
});
```

## 🔍 Debugging de Testes

### Executar Teste Específico
```bash
npm test -- --testNamePattern="should register a new user"
```

### Executar Arquivo Específico
```bash
npm test userController.test.js
```

### Modo Debug
```bash
npm test -- --verbose --detectOpenHandles
```

## 🚨 Prevenção de Erros

Os testes ajudam a prevenir erros através de:

1. **Validação de Entradas**: Verificam se dados inválidos são rejeitados
2. **Autenticação**: Garantem que rotas protegidas funcionem corretamente
3. **Regras de Negócio**: Validam lógica específica da aplicação
4. **Integração**: Testam comunicação entre componentes
5. **Regressões**: Detectam problemas introduzidos em mudanças

## 📈 Métricas de Qualidade

Execute os testes regularmente para manter:
- **Cobertura de código** > 80%
- **Todos os testes passando**
- **Tempo de execução** otimizado
- **Zero warnings** no console

## 🤝 Contribuindo com Testes

Ao adicionar novas funcionalidades:

1. **Escreva testes primeiro** (TDD)
2. **Cubra casos de erro**
3. **Use dados realistas**
4. **Mantenha testes simples e legíveis**
5. **Execute toda a suíte antes do commit**

---

**Lembre-se**: Testes são uma forma de documentar o comportamento esperado do código e garantir que mudanças futuras não quebrem funcionalidades existentes!
