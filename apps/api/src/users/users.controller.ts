import { Controller, Get, Post, Body, Req, UseGuards, ConflictException } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../auth/tenant.guard';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Controller('users')
@UseGuards(JwtAuthGuard, TenantGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  findAll(@Req() req: Request & { user: any }) {
    return this.usersService.findAll(req.user.tenantId);
  }

  @Post()
  async create(@Req() req: Request & { user: any }, @Body() data: any) {
    // Check if email already exists
    const existing = await this.prisma.user.findFirst({
      where: { tenantId: req.user.tenantId, email: data.email },
    });
    if (existing) throw new ConflictException('Email already exists');

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        tenantId: req.user.tenantId,
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || 'EMPLOYEE',
        status: 'ACTIVE',
      },
      select: {
        id: true, email: true, firstName: true, lastName: true, role: true, status: true,
      },
    });

    return user;
  }
}
