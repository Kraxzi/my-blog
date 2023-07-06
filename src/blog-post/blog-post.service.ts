import { FilterBlogPostInput } from './dto/filter-blog-post.input';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BlogPost } from './entities/blog-post.entity';
import { Repository } from 'typeorm';
import { CreateBlogPostInput } from './dto/create-blog-post.input';
import { UpdateBlogPostInput } from './dto/update-blog-post.input';
import { PaginateBlogPostInput } from './dto/paginate-blog-post.input';
import { GetBlogPostsDto } from './dto/get-blog-posts.dto';
import { SortOrder } from './enums/sort-order.enum';
import { BlogService } from '../blog/blog.service';
import { UserRole } from '../user/enums/user-role.enum';

@Injectable()
export class BlogPostService {
  constructor(
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,
    private blogService: BlogService,
  ) {}

  async findByBlogId(
    id: number,
    paginateBlogPostInput: PaginateBlogPostInput,
    filterBlogPostInput?: FilterBlogPostInput,
    sortOrder: SortOrder = SortOrder.ASC,
  ): Promise<GetBlogPostsDto> {
    const query = this.blogPostRepository.createQueryBuilder('post');

    query.andWhere('post.blogId = :blogId', { blogId: id });

    if (filterBlogPostInput?.name) {
      query.andWhere('post.name = :name', { name: filterBlogPostInput.name });
    }

    query.take(paginateBlogPostInput.take);

    query.skip(paginateBlogPostInput.skip);

    query.orderBy('post.name', sortOrder);

    const [blogPosts, total] = await query.getManyAndCount();

    return { blogPosts, total };
  }

  async findPostById(id: number): Promise<BlogPost> {
    const post = await this.blogPostRepository.findOneByOrFail({ id });

    return post;
  }

  async createPost(
    createBlogPostInput: CreateBlogPostInput,
    userId: number,
  ): Promise<BlogPost> {
    const blog = await this.blogService.findOneById(createBlogPostInput.blogId);

    if (userId !== blog.userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const newPost = await this.blogPostRepository.create(createBlogPostInput);

    return await this.blogPostRepository.save(newPost);
  }

  async updatePost(
    updateBlogPostInput: UpdateBlogPostInput,
    userId: number,
    userRole: UserRole,
  ): Promise<BlogPost> {
    const post = await this.blogPostRepository.findOneByOrFail({
      id: updateBlogPostInput.id,
    });

    const blog = await this.blogService.findOneById(post.blogId);

    if (userRole !== UserRole.MODERATOR && userId !== blog.userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const updatedPost = await this.blogPostRepository.save(updateBlogPostInput);

    return updatedPost;
  }

  async removePost(
    id: number,
    userId: number,
    userRole: UserRole,
  ): Promise<BlogPost> {
    const post = await this.blogPostRepository.findOneByOrFail({ id });

    const blog = await this.blogService.findOneById(post.blogId);

    if (userRole !== UserRole.MODERATOR && userId !== blog.userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    await this.blogPostRepository.delete(id);

    return post;
  }
}
