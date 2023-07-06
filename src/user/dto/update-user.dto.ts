import { Field, InputType, Int } from '@nestjs/graphql';
import { UserRole } from '../enums/user-role.enum';

@InputType()
export class UpdateUserInput {
  @Field((type) => Int)
  id: number;

  @Field()
  username?: string;

  @Field()
  password?: string;

  @Field((type) => UserRole)
  role?: UserRole;
}
