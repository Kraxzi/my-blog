import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateBlogPostInput {
  @Field((type) => Int)
  id: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  content?: string;
}
