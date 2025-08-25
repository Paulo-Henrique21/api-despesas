import User from '../models/User.js';

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedpassword123'
      };

      const user = await User.create(userData);

      expect(user).toBeTruthy();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.password).toBe(userData.password);
      expect(user._id).toBeTruthy();
      expect(user.createdAt).toBeTruthy();
      expect(user.updatedAt).toBeTruthy();
    });

    it('should not create a user without required fields', async () => {
      const invalidUserData = {
        email: 'john@example.com'
        // name e password estão faltando
      };

      await expect(User.create(invalidUserData)).rejects.toThrow();
    });

    it('should not create users with duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedpassword123'
      };

      // Criar primeiro usuário
      await User.create(userData);

      // Tentar criar segundo usuário com mesmo email
      const duplicateUserData = {
        name: 'Jane Doe',
        email: 'john@example.com', // mesmo email
        password: 'anotherpassword'
      };

      await expect(User.create(duplicateUserData)).rejects.toThrow();
    });
  });

  describe('User Queries', () => {
    beforeEach(async () => {
      // Criar alguns usuários para teste
      await User.create([
        {
          name: 'User 1',
          email: 'user1@example.com',
          password: 'password1'
        },
        {
          name: 'User 2',
          email: 'user2@example.com',
          password: 'password2'
        }
      ]);
    });

    it('should find user by email', async () => {
      const user = await User.findOne({ email: 'user1@example.com' });
      
      expect(user).toBeTruthy();
      expect(user.name).toBe('User 1');
      expect(user.email).toBe('user1@example.com');
    });

    it('should return null for non-existent email', async () => {
      const user = await User.findOne({ email: 'nonexistent@example.com' });
      
      expect(user).toBeNull();
    });

    it('should find all users', async () => {
      const users = await User.find({});
      
      expect(users).toHaveLength(2);
      
      const emails = users.map(user => user.email);
      expect(emails).toContain('user1@example.com');
      expect(emails).toContain('user2@example.com');
    });
  });
});
