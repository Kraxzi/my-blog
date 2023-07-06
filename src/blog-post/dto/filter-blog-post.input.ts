import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FilterBlogPostInput {
  @Field({ nullable: true })
  name?: string;
}
