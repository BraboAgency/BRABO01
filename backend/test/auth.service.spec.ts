import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { AuthService } from '../src/auth/auth.service';

const prisma = {
  user: { findUnique: jest.fn() },
  refreshToken: { create: jest.fn(), findMany: jest.fn(), delete: jest.fn() }
};

describe('AuthService', () => {
  it('should issue tokens on valid login', async () => {
    const passwordHash = await bcrypt.hash('secret123', 10);
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      passwordHash,
      role: 'MANAGER',
      name: 'Test User'
    });
    prisma.refreshToken.create.mockResolvedValue({ id: 'token' });

    const authService = new AuthService(prisma as any, new JwtService({ secret: 'test' }));
    const result = await authService.login('test@example.com', 'secret123');

    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });
});
