import { Test, TestingModule } from '@nestjs/testing';
import { BlogPostService } from './blog-post.service';
import { BlogService } from '../blog/blog.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { Repository } from 'typeorm';
import { HttpStatus, HttpException } from '@nestjs/common';
import { UserRole } from '../user/enums/user-role.enum';
import { PaginateBlogPostInput } from './dto/paginate-blog-post.input';
import { FilterBlogPostInput } from './dto/filter-blog-post.input';
import { SortOrder } from './enums/sort-order.enum';

describe('BlogPostService', () => {
  let blogPostService: BlogPostService;
  let blogService: BlogService;
  let blogPostRepository: Repository<BlogPost>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogPostService,
        {
          provide: BlogService,
          useValue: {
            findOneById: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(BlogPost),
          useValue: {
            createQueryBuilder: jest.fn(),
            findOneByOrFail: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    blogPostService = module.get<BlogPostService>(BlogPostService);
    blogService = module.get<BlogService>(BlogService);
    blogPostRepository = module.get<Repository<BlogPost>>(
      getRepositoryToken(BlogPost),
    );
  });

  describe('findByBlogId', () => {
    it('should find blog posts by blog ID', async () => {
      const mockBlogId = 1;
      const mockPaginateBlogPostInput: PaginateBlogPostInput = {
        take: 10,
        skip: 0,
      };
      const mockFilterBlogPostInput: FilterBlogPostInput = {
        name: 'test',
      };
      const mockSortOrder = SortOrder.DESC;

      const mockBlogPosts = [
        {
          id: 1,
          name: 'name',
          content: 'content',
          blogId: 1,
          blog: {
            id: 1,
            name: 'name',
            description: 'description',
            userId: 1,
            user: { id: 1, username: 'username', password: 'password' },
          },
        },
      ];

      jest.spyOn(blogPostRepository, 'createQueryBuilder').mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockResolvedValue([mockBlogPosts, mockBlogPosts.length]),
      } as any);

      const result = await blogPostService.findByBlogId(
        mockBlogId,
        mockPaginateBlogPostInput,
        mockFilterBlogPostInput,
        mockSortOrder,
      );

      expect(result.blogPosts).toEqual(mockBlogPosts);
      expect(result.total).toBe(mockBlogPosts.length);
    });

    it('should find blog posts by blog ID without filter', async () => {
      const mockBlogId = 1;
      const mockPaginateBlogPostInput = {
        take: 10,
        skip: 0,
      };

      const mockBlogPosts = [
        {
          id: 1,
          name: 'name',
          content: 'content',
          blogId: 1,
          blog: {
            id: 1,
            name: 'name',
            description: 'description',
            userId: 1,
            user: { id: 1, username: 'username', password: 'password' },
          },
        },
      ];

      jest.spyOn(blogPostRepository, 'createQueryBuilder').mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockResolvedValue([mockBlogPosts, mockBlogPosts.length]),
      } as any);

      const result = await blogPostService.findByBlogId(
        mockBlogId,
        mockPaginateBlogPostInput,
      );

      expect(result.blogPosts).toEqual(mockBlogPosts);
      expect(result.total).toBe(mockBlogPosts.length);
    });
  });

  describe('findPostById', () => {
    it('should find a blog post by ID', async () => {
      const mockPostId = 1;
      const mockPost = {
        id: 1,
        name: 'name',
        content: 'content',
        blogId: 1,
        blog: {
          id: 1,
          name: 'name',
          description: 'description',
          userId: 1,
          user: { id: 1, username: 'username', password: 'password' },
        },
      };

      jest
        .spyOn(blogPostRepository, 'findOneByOrFail')
        .mockResolvedValue(mockPost);

      const result = await blogPostService.findPostById(mockPostId);

      expect(result).toEqual(mockPost);
    });

    it('should throw an exception if blog post is not found', async () => {
      const mockPostId = 1;

      jest
        .spyOn(blogPostRepository, 'findOneByOrFail')
        .mockRejectedValue(new Error());

      await expect(blogPostService.findPostById(mockPostId)).rejects.toThrow();
    });
  });

  describe('createPost', () => {
    it('should create a new blog post', async () => {
      const mockUserId = 1;
      const mockBlogId = 1;
      const mockCreateBlogPostInput = {
        name: 'name',
        content: 'content',
        blogId: mockBlogId,
      };

      const mockBlog = {
        id: 1,
        name: 'name',
        description: 'description',
        userId: 1,
        user: { id: 1, username: 'username', password: 'password' },
      };

      jest.spyOn(blogService, 'findOneById').mockResolvedValue(mockBlog);
      jest
        .spyOn(blogPostRepository, 'create')
        .mockReturnValue({ ...mockCreateBlogPostInput, id: 1, blog: mockBlog });
      jest.spyOn(blogPostRepository, 'save').mockResolvedValue({
        ...mockCreateBlogPostInput,
        id: 1,
        blog: mockBlog,
      });

      const result = await blogPostService.createPost(
        mockCreateBlogPostInput,
        mockUserId,
      );

      expect(result).toEqual({
        ...mockCreateBlogPostInput,
        id: 1,
        blog: mockBlog,
      });
    });

    it('should throw an exception if user does not have permission', async () => {
      const mockUserId = 1;
      const mockBlogId = 1;
      const mockCreateBlogPostInput = {
        name: 'name',
        content: 'content',
        blogId: mockBlogId,
      };

      const mockBlog = {
        id: 1,
        name: 'name',
        description: 'description',
        userId: 2,
        user: { id: 2, username: 'username', password: 'password' },
      };

      jest.spyOn(blogService, 'findOneById').mockResolvedValue(mockBlog);

      await expect(
        blogPostService.createPost(mockCreateBlogPostInput, mockUserId),
      ).rejects.toThrow(new HttpException('Forbidden', HttpStatus.FORBIDDEN));
    });
  });

  describe('updatePost', () => {
    it('should update an existing blog post', async () => {
      const mockUserId = 1;
      const mockPostId = 1;
      const mockUpdateBlogPostInput = {
        id: mockPostId,
        name: 'name',
        content: 'content',
      };

      const mockPost = {
        id: 1,
        name: 'name',
        content: 'content',
        blogId: 1,
        blog: {
          id: 1,
          name: 'name',
          description: 'description',
          userId: 1,
          user: { id: 1, username: 'username', password: 'password' },
        },
      };

      const mockBlog = {
        id: 1,
        name: 'name',
        description: 'description',
        userId: 1,
        user: { id: 1, username: 'username', password: 'password' },
      };

      jest
        .spyOn(blogPostRepository, 'findOneByOrFail')
        .mockResolvedValue(mockPost);
      jest.spyOn(blogService, 'findOneById').mockResolvedValue(mockBlog);
      jest
        .spyOn(blogPostRepository, 'save')
        .mockResolvedValue({ ...mockPost, ...mockUpdateBlogPostInput });

      const result = await blogPostService.updatePost(
        mockUpdateBlogPostInput,
        mockUserId,
        UserRole.MODERATOR,
      );

      expect(result).toEqual({ ...mockPost, ...mockUpdateBlogPostInput });
    });

    it('should throw an exception if user does not have permission', async () => {
      const mockUserId = 1;
      const mockPostId = 1;
      const mockUpdateBlogPostInput = {
        id: mockPostId,
        name: 'name',
        content: 'content',
      };

      const mockPost = {
        id: 1,
        name: 'name',
        content: 'content',
        blogId: 1,
        blog: {
          id: 1,
          name: 'name',
          description: 'description',
          userId: 1,
          user: { id: 1, username: 'username', password: 'password' },
        },
      };

      const mockBlog = {
        id: 1,
        name: 'name',
        description: 'description',
        userId: 2,
        user: { id: 2, username: 'username', password: 'password' },
      };
      jest
        .spyOn(blogPostRepository, 'findOneByOrFail')
        .mockResolvedValue(mockPost);
      jest.spyOn(blogService, 'findOneById').mockResolvedValue(mockBlog);

      await expect(
        blogPostService.updatePost(
          mockUpdateBlogPostInput,
          mockUserId,
          UserRole.WRITER,
        ),
      ).rejects.toThrow(new HttpException('Forbidden', HttpStatus.FORBIDDEN));
    });
  });

  describe('removePost', () => {
    it('should remove an existing blog post', async () => {
      const mockUserId = 1;
      const mockPostId = 1;

      const mockPost = {
        id: 1,
        name: 'name',
        content: 'content',
        blogId: 1,
        blog: {
          id: 1,
          name: 'name',
          description: 'description',
          userId: 1,
          user: { id: 1, username: 'username', password: 'password' },
        },
      };

      const mockBlog = {
        id: 1,
        name: 'name',
        description: 'description',
        userId: 1,
        user: { id: 1, username: 'username', password: 'password' },
      };

      jest
        .spyOn(blogPostRepository, 'findOneByOrFail')
        .mockResolvedValue(mockPost);
      jest.spyOn(blogService, 'findOneById').mockResolvedValue(mockBlog);
      jest.spyOn(blogPostRepository, 'delete').mockResolvedValue(undefined);

      const result = await blogPostService.removePost(
        mockPostId,
        mockUserId,
        UserRole.MODERATOR,
      );

      expect(result).toEqual(mockPost);
    });

    it('should throw an exception if user does not have permission', async () => {
      const mockUserId = 1;
      const mockPostId = 1;

      const mockPost = {
        id: 1,
        name: 'name',
        content: 'content',
        blogId: 1,
        blog: {
          id: 1,
          name: 'name',
          description: 'description',
          userId: 1,
          user: { id: 1, username: 'username', password: 'password' },
        },
      };

      const mockBlog = {
        id: 1,
        name: 'name',
        description: 'description',
        userId: 2,
        user: { id: 2, username: 'username', password: 'password' },
      };
      jest
        .spyOn(blogPostRepository, 'findOneByOrFail')
        .mockResolvedValue(mockPost);
      jest.spyOn(blogService, 'findOneById').mockResolvedValue(mockBlog);

      await expect(
        blogPostService.removePost(mockPostId, mockUserId, UserRole.WRITER),
      ).rejects.toThrow(new HttpException('Forbidden', HttpStatus.FORBIDDEN));
    });
  });
});
