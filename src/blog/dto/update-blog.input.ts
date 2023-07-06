import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateBlogInput {
  @Field((type) => Int)
  id: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;
}
