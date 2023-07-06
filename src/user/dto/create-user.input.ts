import { Field, InputType } from '@nestjs/graphql';
import { UserRole } from '../enums/user-role.enum';

@InputType()
export class CreateUserInput {
  @Field()
  username: string;

  @Field()
  password: string;

  @Field((type) => UserRole, { nullable: true })
  role?: UserRole;
}
