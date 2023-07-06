import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBlogInput {
  @Field()
  name: string;

  @Field()
  description: string;
}
