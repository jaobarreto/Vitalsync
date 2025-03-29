import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async signUp(signUpDto: SignUpDto): Promise<{ accessToken: string }> {
    const newUser = await this.usersService.createUser(signUpDto);

    const payload = { sub: newUser.id, email: newUser.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
