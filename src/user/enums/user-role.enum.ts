import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  WRITER = 'writer',
  MODERATOR = 'moderator',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'user roles',
});
