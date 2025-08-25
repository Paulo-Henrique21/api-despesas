describe('Configuração básica do Jest', () => {
  it('deve executar um teste simples', () => {
    expect(1 + 1).toBe(2);
  });

  it('deve ter acesso às variáveis de ambiente', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.JWT_SECRET).toBe('test-jwt-secret-for-testing');
  });
});
