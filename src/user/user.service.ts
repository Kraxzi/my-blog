import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { LoginUserInput } from './dto/login-user.input';
import { LoggedUserOutput } from './dto/logged-user.output';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async login(loginUserInput: LoginUserInput): Promise<LoggedUserOutput> {
    const user = await this.authService.validateUser(
      loginUserInput.username,
      loginUserInput.password,
    );

    if (!user) {
      throw new BadRequestException(`Email or password are invalid`);
    } else {
      return this.authService.generateUserCredentials(user);
    }
  }

  async findOne(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });

    return user ? user : null;
  }

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    const password = createUserInput.password;

    createUserInput.password = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.create(createUserInput);

    return await this.userRepository.save(newUser);
  }

  async updateUser(updateUserInput: UpdateUserInput): Promise<User> {
    await this.userRepository.findOneByOrFail({ id: updateUserInput.id });

    const updatedUser = await this.userRepository.save(updateUserInput);

    return updatedUser;
  }

  async removeUser(id: number): Promise<User> {
    const removedUser = await this.userRepository.findOneByOrFail({ id });

    await this.userRepository.delete(id);

    return removedUser;
  }
}
