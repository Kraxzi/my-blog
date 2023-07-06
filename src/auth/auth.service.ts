import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoggedUserOutput } from '../user/dto/logged-user.output';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtTokenService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findOne(username);

    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        delete user.password;
        return user;
      }
    }

    return null;
  }

  generateUserCredentials(user: User): LoggedUserOutput {
    const payload = {
      username: user.username,
      role: user.role,
      sub: user.id,
    };

    return {
      access_token: 'Bearer ' + this.jwtTokenService.sign(payload),
    };
  }
}
