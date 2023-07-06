import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserRole } from '../enums/user-role.enum';
import { Blog } from '../../blog/entities/blog.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  username: string;

  @Column()
  @Field()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.WRITER,
  })
  @Field((type) => UserRole, { nullable: true })
  role?: UserRole;

  @OneToMany(() => Blog, (blog) => blog.user)
  @Field((type) => [Blog], { nullable: true })
  blogs?: Blog[];
}
