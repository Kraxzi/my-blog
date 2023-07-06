import { Test } from '@nestjs/testing';
import { BlogResolver } from './blog.resolver';
import { BlogService } from './blog.service';
import { Blog } from './entities/blog.entity';

describe('BlogResolver', () => {
  let blogResolver: BlogResolver;
  let blogService: BlogService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BlogResolver,
        {
          provide: BlogService,
          useValue: {
            findAll: jest.fn(),
            findOneById: jest.fn(),
            getBlogByUserId: jest.fn(),
            createBlog: jest.fn(),
            updateBlog: jest.fn(),
            removeBlog: jest.fn(),
          },
        },
      ],
    }).compile();

    blogResolver = moduleRef.get<BlogResolver>(BlogResolver);
    blogService = moduleRef.get<BlogService>(BlogService);
  });

  describe('blogs', () => {
    it('should return an array of blogs', async () => {
      const paginateBlogInput = { skip: 1, take: 10 };
      const expectedBlogs = {
        blogs: [
          {
            id: 1,
            name: 'name',
            description: 'description',
            userId: 1,
            user: { id: 1, username: 'username', password: 'password' },
          },
        ],
        total: 10,
      };

      jest.spyOn(blogService, 'findAll').mockResolvedValue(expectedBlogs);

      const result = await blogResolver.blogs(paginateBlogInput);

      expect(result).toEqual(expectedBlogs);
      expect(blogService.findAll).toHaveBeenCalledWith(paginateBlogInput);
    });
  });

  describe('getBlog', () => {
    it('should return a blog by ID', async () => {
      const blogId = 1;
      const expectedBlog = {
        id: 1,
        name: 'name',
        description: 'description',
        userId: 1,
        user: { id: 1, username: 'username', password: 'password' },
      };

      jest.spyOn(blogService, 'findOneById').mockResolvedValue(expectedBlog);

      const result = await blogResolver.getBlog(blogId);

      expect(result).toEqual(expectedBlog);
      expect(blogService.findOneById).toHaveBeenCalledWith(blogId);
    });
  });

  describe('getBlogByUserId', () => {
    it('should return a blog by user ID', async () => {
      const userId = 1;
      const expectedBlog = {
        id: 1,
        name: 'name',
        description: 'description',
        userId: 1,
        user: { id: 1, username: 'username', password: 'password' },
      };

      jest
        .spyOn(blogService, 'getBlogByUserId')
        .mockResolvedValue(expectedBlog);

      const result = await blogResolver.getBlogByUserId(userId);

      expect(result).toEqual(expectedBlog);
      expect(blogService.getBlogByUserId).toHaveBeenCalledWith(userId);
    });
  });

  describe('createBlog', () => {
    it('should create a new blog', async () => {
      const createBlogInput = {
        name: 'name',
        description: 'description',
      };
      const expectedBlog: Blog = {
        id: 1,
        name: 'name',
        description: 'description',
        userId: 1,
        user: { id: 1, username: 'username', password: 'password' },
      };
      const context = { req: { user: { userId: 1 } } };

      jest.spyOn(blogService, 'createBlog').mockResolvedValue(expectedBlog);

      const result = await blogResolver.createBlog(createBlogInput, context);

      expect(result).toEqual(expectedBlog);
      expect(blogService.createBlog).toHaveBeenCalledWith(
        createBlogInput,
        context.req.user.userId,
      );
    });
  });

  describe('updateBlog', () => {
    it('should update an existing blog', async () => {
      const updateBlogInput = {
        id: 1,
      };
      const expectedBlog = {
        id: 1,
        name: 'name',
        description: 'description',
        userId: 1,
        user: { id: 1, username: 'username', password: 'password' },
      };
      const context = {
        req: { user: { userId: 1, payload: { role: 'admin' } } },
      };

      jest.spyOn(blogService, 'updateBlog').mockResolvedValue(expectedBlog);

      const result = await blogResolver.updateBlog(updateBlogInput, context);

      expect(result).toEqual(expectedBlog);
      expect(blogService.updateBlog).toHaveBeenCalledWith(
        updateBlogInput,
        context.req.user.userId,
        context.req.user.payload.role,
      );
    });
  });

  describe('removeBlog', () => {
    it('should remove an existing blog', async () => {
      const blogId = 1;
      const expectedBlog = {
        id: 1,
        name: 'name',
        description: 'description',
        userId: 1,
        user: { id: 1, username: 'username', password: 'password' },
      };
      const context = {
        req: { user: { userId: 1, payload: { role: 'admin' } } },
      };

      jest.spyOn(blogService, 'removeBlog').mockResolvedValue(expectedBlog);

      const result = await blogResolver.removeBlog(blogId, context);

      expect(result).toEqual(expectedBlog);
      expect(blogService.removeBlog).toHaveBeenCalledWith(
        blogId,
        context.req.user.userId,
        context.req.user.payload.role,
      );
    });
  });
});
