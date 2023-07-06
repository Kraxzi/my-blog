import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Blog } from './entities/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlogInput } from './dto/create-blog.input';
import { UpdateBlogInput } from './dto/update-blog.input';
import { PaginateBlogInput } from './dto/paginate-blog.input';
import { GetBlogsDto } from './dto/get-blogs.dto';
import { UserRole } from '../user/enums/user-role.enum';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
  ) {}

  async findAll(paginateBlogInput: PaginateBlogInput): Promise<GetBlogsDto> {
    const [blogs, total] = await this.blogRepository.findAndCount({
      take: paginateBlogInput.take,
      skip: paginateBlogInput.skip,
    });

    return { blogs, total };
  }

  async findOneById(id: number): Promise<Blog> {
    const blog = await this.blogRepository.findOneByOrFail({ id });

    return blog;
  }

  async getBlogByUserId(id: number): Promise<Blog> {
    const blog = await this.blogRepository.findOneByOrFail({ userId: id });

    return blog;
  }

  async createBlog(
    createBlogInput: CreateBlogInput,
    userId: number,
  ): Promise<Blog> {
    const newBlog = await this.blogRepository.create(createBlogInput);

    newBlog.userId = userId;

    return await this.blogRepository.save(newBlog);
  }

  async updateBlog(
    updateBlogInput: UpdateBlogInput,
    userId: number,
    userRole: UserRole,
  ): Promise<Blog> {
    const blog = await this.blogRepository.findOneByOrFail({
      id: updateBlogInput.id,
    });

    if (userRole !== UserRole.MODERATOR && userId !== blog.userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const updatedBlog = await this.blogRepository.save(updateBlogInput);

    return updatedBlog;
  }

  async removeBlog(
    id: number,
    userId: number,
    userRole: UserRole,
  ): Promise<Blog> {
    const blog = await this.blogRepository.findOneByOrFail({
      id,
    });

    if (userRole !== UserRole.MODERATOR && userId !== blog.userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    await this.blogRepository.delete(id);

    return blog;
  }
}
