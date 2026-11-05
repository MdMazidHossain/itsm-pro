import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // চেক করুন subdomain আগে থেকেই আছে কিনা
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { subdomain: dto.subdomain },
    });
    if (existingTenant) {
      throw new ConflictException('Subdomain already exists');
    }

    // পাসওয়ার্ড হ্যাশ করুন
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // ট্রানজেকশনে Tenant এবং User তৈরি করুন
    const result = await this.prisma.$transaction(async (prisma) => {
      const tenant = await prisma.tenant.create({
        data: {
          name: dto.companyName,
          subdomain: dto.subdomain,
          status: 'TRIAL',
        },
      });

      const user = await prisma.user.create({
        data: {
          tenantId: tenant.id,
          email: dto.email,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          role: 'COMPANY_ADMIN',
          status: 'ACTIVE',
        },
      });

      return { tenant, user };
    });

    // JWT তৈরি করুন
    const token = this.generateToken(result.user.id, result.tenant.id, result.user.role);

    return {
      message: 'Registration successful',
      tenant: { id: result.tenant.id, name: result.tenant.name, subdomain: result.tenant.subdomain },
      user: { id: result.user.id, email: result.user.email, role: result.user.role },
      accessToken: token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email },
      include: { tenant: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // আপডেট lastLoginAt
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = this.generateToken(user.id, user.tenantId, user.role);

    return {
      message: 'Login successful',
      tenant: { id: user.tenant.id, name: user.tenant.name, subdomain: user.tenant.subdomain },
      user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
      accessToken: token,
    };
  }

  private generateToken(userId: string, tenantId: string, role: string): string {
    const payload = { sub: userId, tenantId, role };
    return this.jwtService.sign(payload);
  }
}