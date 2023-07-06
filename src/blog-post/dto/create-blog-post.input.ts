import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateBlogPostInput {
  @Field()
  name: string;

  @Field()
  content: string;

  @Field((type) => Int)
  blogId: number;
}
