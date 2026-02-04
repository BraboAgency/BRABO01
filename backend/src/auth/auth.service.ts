import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.issueTokens(user.id, user.role, user.name, user.email);
  }

  async refresh(refreshToken: string) {
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const tokens = await this.prisma.refreshToken.findMany({
      where: { expiresAt: { gt: new Date() } }
    });
    const stored = await Promise.all(
      tokens.map(async (token) => {
        const match = await bcrypt.compare(refreshToken, token.tokenHash);
        return match ? token : null;
      })
    );

    const tokenRecord = stored.find(Boolean);
    if (!tokenRecord) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const user = await this.prisma.user.findUnique({ where: { id: tokenRecord.userId } });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
    return this.issueTokens(user.id, user.role, user.name, user.email);
  }

  private async issueTokens(userId: string, role: string, name: string, email: string) {
    const accessToken = await this.jwtService.signAsync({ sub: userId, role, name, email });
    const refreshToken = randomUUID();
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
      }
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 1800
    };
  }
}
