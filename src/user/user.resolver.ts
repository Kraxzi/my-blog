import { Args, Int, Mutation, Resolver, Query } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.dto';
import { LoggedUserOutput } from './dto/logged-user.output';
import { LoginUserInput } from './dto/login-user.input';

@Resolver((of) => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query((returns) => User, { nullable: true })
  async findOne(@Args('username') username: string): Promise<User | null> {
    const user = await this.userService.findOne(username);

    return user ? user : null;
  }

  @Mutation((returns) => LoggedUserOutput)
  async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
  ): Promise<LoggedUserOutput> {
    const token = await this.userService.login(loginUserInput);

    return token;
  }

  @Mutation((returns) => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    const user = await this.userService.createUser(createUserInput);

    return user;
  }

  @Mutation((returns) => User)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    const user = await this.userService.updateUser(updateUserInput);

    return user;
  }

  @Mutation((returns) => User)
  async removeUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
    const user = await this.userService.removeUser(id);

    return user;
  }
}
