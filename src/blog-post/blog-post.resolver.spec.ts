import { Test, TestingModule } from '@nestjs/testing';
import { BlogPostResolver } from './blog-post.resolver';
import { BlogPostService } from './blog-post.service';
import { SortOrder } from './enums/sort-order.enum';
import { UserRole } from '../user/enums/user-role.enum';

describe('BlogPostResolver', () => {
  let blogPostResolver: BlogPostResolver;
  let blogPostService: BlogPostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogPostResolver,
        {
          provide: BlogPostService,
          useValue: {
            findByBlogId: jest.fn(),
            findPostById: jest.fn(),
            createPost: jest.fn(),
            updatePost: jest.fn(),
            removePost: jest.fn(),
          },
        },
      ],
    }).compile();

    blogPostResolver = module.get<BlogPostResolver>(BlogPostResolver);
    blogPostService = module.get<BlogPostService>(BlogPostService);
  });

  describe('getPostsByBlog', () => {
    it('should return an array of blog posts', async () => {
      const mockBlogId = 1;
      const mockPaginateBlogPostsInput = {
        take: 10,
        skip: 0,
      };
      const mockFilterBlogPostsInput = {
        name: 'name',
      };
      const mockSortOrder = SortOrder.DESC;

      const mockPosts = {
        blogPosts: [
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
        ],
        total: 10,
      };
      jest.spyOn(blogPostService, 'findByBlogId').mockResolvedValue(mockPosts);

      const result = await blogPostResolver.getPostsByBlog(
        mockBlogId,
        mockPaginateBlogPostsInput,
        mockFilterBlogPostsInput,
        mockSortOrder,
      );

      expect(result).toEqual(mockPosts);
    });
  });

  describe('getPostById', () => {
    it('should return a blog post by id', async () => {
      const mockId = 1;

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
      jest.spyOn(blogPostService, 'findPostById').mockResolvedValue(mockPost);

      const result = await blogPostResolver.getPostById(mockId);

      expect(result).toEqual(mockPost);
    });
  });

  describe('createPost', () => {
    it('should create a new blog post', async () => {
      const mockCreateBlogPostInput = {
        name: 'name',
        content: 'content',
        blogId: 1,
      };
      const mockUserId = 1;

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

      jest.spyOn(blogPostService, 'createPost').mockResolvedValue(mockPost);

      const mockContext = {
        req: {
          user: {
            userId: mockUserId,
          },
        },
      };

      const result = await blogPostResolver.createPost(
        mockCreateBlogPostInput,
        mockContext,
      );

      expect(result).toEqual(mockPost);
    });
  });

  describe('updatePost', () => {
    it('should update an existing blog post', async () => {
      const mockUpdateBlogPostInput = {
        id: 1,
        name: 'name',
      };
      const mockUserId = 1;
      const mockUserRole = 'ADMIN';

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

      jest.spyOn(blogPostService, 'updatePost').mockResolvedValue(mockPost);

      const mockContext = {
        req: {
          user: {
            userId: mockUserId,
            payload: {
              role: mockUserRole,
            },
          },
        },
      };

      const result = await blogPostResolver.updatePost(
        mockUpdateBlogPostInput,
        mockContext,
      );

      expect(result).toEqual(mockPost);
    });
  });

  describe('removePost', () => {
    it('should remove an existing blog post', async () => {
      const mockId = 1;
      const mockUserId = 1;
      const mockUserRole = UserRole.WRITER;

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

      jest.spyOn(blogPostService, 'removePost').mockResolvedValue(mockPost);

      const mockContext = {
        req: {
          user: {
            userId: mockUserId,
            payload: {
              role: mockUserRole,
            },
          },
        },
      };

      const result = await blogPostResolver.removePost(mockId, mockContext);

      expect(result).toEqual(mockPost);
    });
  });
});
