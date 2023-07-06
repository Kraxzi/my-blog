import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BlogPost } from '../../blog-post/entities/blog-post.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
@ObjectType()
export class Blog {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  description: string;

  @Column()
  @Field((type) => Int)
  userId: number;

  @OneToMany(() => BlogPost, (post) => post.blog)
  @Field((type) => [BlogPost], { nullable: true })
  posts?: BlogPost[];

  @ManyToOne(() => User, (user) => user.blogs, { onDelete: 'CASCADE' })
  @Field((type) => User)
  user: User;
}
