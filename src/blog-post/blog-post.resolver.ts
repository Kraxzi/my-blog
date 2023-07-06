import { SortOrder } from './enums/sort-order.enum';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlogPost } from './entities/blog-post.entity';
import { BlogPostService } from './blog-post.service';
import { CreateBlogPostInput } from './dto/create-blog-post.input';
import { UpdateBlogPostInput } from './dto/update-blog-post.input';
import { PaginateBlogPostInput } from './dto/paginate-blog-post.input';
import { GetBlogPostsDto } from './dto/get-blog-posts.dto';
import { FilterBlogPostInput } from './dto/filter-blog-post.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver((of) => BlogPost)
export class BlogPostResolver {
  constructor(private blogPostService: BlogPostService) {}

  @Query((returns) => GetBlogPostsDto)
  async getPostsByBlog(
    @Args('id', { type: () => Int }) id: number,
    @Args('paginateBlogPostsInput')
    paginateBlogPostsInput: PaginateBlogPostInput,
    @Args('filterBlogPostsInput', { nullable: true })
    filterBlogPostsInput?: FilterBlogPostInput,
    @Args('sortOrder', { nullable: true, defaultValue: SortOrder.ASC })
    sortOrder?: SortOrder,
  ): Promise<GetBlogPostsDto> {
    const posts = await this.blogPostService.findByBlogId(
      id,
      paginateBlogPostsInput,
      filterBlogPostsInput,
      sortOrder,
    );

    return posts;
  }

  @Query((returns) => BlogPost)
  async getPostById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<BlogPost> {
    const post = await this.blogPostService.findPostById(id);

    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => BlogPost)
  async createPost(
    @Args('createBlogPostInput') createBlogPostInput: CreateBlogPostInput,
    @Context() context,
  ): Promise<BlogPost> {
    const post = await this.blogPostService.createPost(
      createBlogPostInput,
      context.req.user.userId,
    );

    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => BlogPost)
  async updatePost(
    @Args('updateBlogPostInput') updateBlogPostInput: UpdateBlogPostInput,
    @Context() context,
  ): Promise<BlogPost> {
    const post = await this.blogPostService.updatePost(
      updateBlogPostInput,
      context.req.user.userId,
      context.req.user.payload.role,
    );

    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => BlogPost)
  async removePost(
    @Args('id', { type: () => Int }) id: number,
    @Context() context,
  ): Promise<BlogPost> {
    const post = await this.blogPostService.removePost(
      id,
      context.req.user.userId,
      context.req.user.payload.role,
    );

    return post;
  }
}
