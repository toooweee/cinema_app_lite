import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { AuthDto } from '@auth/dto';
import { UsersService } from '@users/users.service';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { RolesService } from '@roles/roles.service';
import * as uuid from 'uuid';
import Roles from '@roles/types/roles.enum';
import { JwtPayload } from '@tokens/types';
import { TokensService } from '@tokens/tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly rolesService: RolesService,
    private readonly tokensService: TokensService,
  ) {}

  async register(registerDto: AuthDto) {
    const { email, password } = registerDto;

    const existingUser = await this.usersService.findOne({ email });

    if (existingUser) {
      throw new ConflictException(`User with email ${email} already exists`);
    }

    const hashedPassword = await argon.hash(password);
    const activationLink =
      this.configService.get<string>('API_URL') + `/${uuid.v4()}`;
    const role = await this.rolesService.findOne({
      name: Roles.CLIENT,
    });

    const user = await this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        activationLink,
        client: {
          create: {
            roleId: role.id,
          },
        },
      },
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const tokens = await this.tokensService.generateTokens(payload);
    await this.tokensService.saveTokenToDatabase(tokens.refreshToken, user.id);

    return tokens;
  }

  async login(loginDto: AuthDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findOne({ email });

    if (!user || !(await this.comparePassword(user.password, password))) {
      throw new ForbiddenException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const tokens = await this.tokensService.generateTokens(payload);
    await this.tokensService.saveTokenToDatabase(tokens.refreshToken, user.id);

    return tokens;
  }

  async refreshTokens(token: string) {
    return await this.tokensService.refreshTokens(token);
  }

  async logout(token: string) {
    return await this.tokensService.delete(token);
  }

  private comparePassword(hashedPassword: string, password: string) {
    return argon.verify(hashedPassword, password);
  }
}
