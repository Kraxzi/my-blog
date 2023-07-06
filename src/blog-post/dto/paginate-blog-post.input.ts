import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PaginateBlogPostInput {
  @Field((type) => Int, { defaultValue: 0 })
  skip: number;

  @Field((type) => Int, { defaultValue: 10 })
  take: number;
}
