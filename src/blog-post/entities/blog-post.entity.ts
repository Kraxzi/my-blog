import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Blog } from '../../blog/entities/blog.entity';

@Entity()
@ObjectType()
export class BlogPost {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  content: string;

  @Column()
  @Field((type) => Int)
  blogId: number;

  @ManyToOne(() => Blog, (blog) => blog.posts, { onDelete: 'CASCADE' })
  @Field((type) => Blog)
  blog: Blog;
}
