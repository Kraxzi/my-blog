import { PaginateBlogInput } from './dto/paginate-blog.input';
import { CreateBlogInput } from './dto/create-blog.input';
import { Blog } from './entities/blog.entity';
import { BlogService } from './blog.service';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdateBlogInput } from './dto/update-blog.input';
import { GetBlogsDto } from './dto/get-blogs.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver((of) => Blog)
export class BlogResolver {
  constructor(private blogService: BlogService) {}

  @Query((returns) => GetBlogsDto)
  async blogs(
    @Args('paginateBlogInput') paginateBlogInput: PaginateBlogInput,
  ): Promise<GetBlogsDto> {
    const blogs = await this.blogService.findAll(paginateBlogInput);

    return blogs;
  }

  @Query((returns) => Blog)
  async getBlog(@Args('id', { type: () => Int }) id: number): Promise<Blog> {
    const blog = await this.blogService.findOneById(id);

    return blog;
  }

  @Query((returns) => Blog)
  async getBlogByUserId(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Blog> {
    const blog = await this.blogService.getBlogByUserId(id);

    return blog;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Blog)
  async createBlog(
    @Args('createBlogInput') createBlogInput: CreateBlogInput,
    @Context() context,
  ): Promise<Blog> {
    const blog = await this.blogService.createBlog(
      createBlogInput,
      context.req.user.userId,
    );

    return blog;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Blog)
  async updateBlog(
    @Args('updateBlogInput') updateBlogInput: UpdateBlogInput,
    @Context() context,
  ): Promise<Blog> {
    const blog = await this.blogService.updateBlog(
      updateBlogInput,
      context.req.user.userId,
      context.req.user.payload.role,
    );

    return blog;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Blog)
  async removeBlog(
    @Args('id', { type: () => Int }) id: number,
    @Context() context,
  ): Promise<Blog> {
    const blog = await this.blogService.removeBlog(
      id,
      context.req.user.userId,
      context.req.user.payload.role,
    );

    return blog;
  }
}
