import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Blog } from '../entities/blog.entity';

@ObjectType()
export class GetBlogsDto {
  @Field((type) => [Blog])
  blogs: Blog[];

  @Field((type) => Int)
  total: number;
}
