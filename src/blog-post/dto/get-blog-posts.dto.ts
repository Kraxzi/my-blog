import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BlogPost } from '../entities/blog-post.entity';

@ObjectType()
export class GetBlogPostsDto {
  @Field((type) => [BlogPost])
  blogPosts: BlogPost[];

  @Field((type) => Int)
  total: number;
}
