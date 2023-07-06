import { Test } from '@nestjs/testing';
import { BlogService } from './blog.service';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRole } from '../user/enums/user-role.enum';
import { HttpException } from '@nestjs/common';

describe('BlogService', () => {
  let blogService: BlogService;
  let blogRepository: Repository<Blog>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BlogService,
        {
          provide: getRepositoryToken(Blog),
          useValue: {
            findOneByOrFail: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
      ],
    }).compile();

    blogService = moduleRef.get<BlogService>(BlogService);
    blogRepository = moduleRef.get<Repository<Blog>>(getRepositoryToken(Blog));
  });

  describe('findAll', () => {
    it('should return an array of blogs', async () => {
      const mockBlogs: Blog[] = [
        {
          id: 1,
          name: 'name',
          description: 'description',
          userId: 1,
          user: { id: 1, username: 'username', password: 'password' },
        },
      ];

      jest
        .spyOn(blogRepository, 'findAndCount')
        .mockResolvedValue([mockBlogs, mockBlogs.length]);

      const mockPaginateBlogInput = {
        skip: 1,
        take: 10,
      };

      const result = await blogService.findAll(mockPaginateBlogInput);

      expect(result.blogs).toEqual(mockBlogs);
      expect(result.total).toEqual(mockBlogs.length);
    });
  });

  describe('findOneById', () => {
    it('should return a blog by id', async () => {
      const mockBlog = {
        id: 1,
        name: 'name',
        description: 'description',
        userId: 1,
        user: { id: 1, username: 'username', password: 'password' },
      };

      jest.spyOn(blogRepository, 'findOneByOrFail').mockResolvedValue(mockBlog);

      const result = await blogService.findOneById(1);

      expect(result).toEqual(mockBlog);
    });
  });

  describe('getBlogByUserId', () => {
    it('should return a blog by userId', async () => {
      const mockBlog = {
        id: 1,
        name: 'name',
        description: 'description',
        userId: 1,
        user: { id: 1, username: 'username', password: 'password' },
      };

      jest.spyOn(blogRepository, 'findOneByOrFail').mockResolvedValue(mockBlog);

      const result = await blogService.getBlogByUserId(1);

      expect(result).toEqual(mockBlog);
    });
  });

  describe('createBlog', () => {
    it('should create a new blog', async () => {
      const mockCreateBlogInput = {
        name: 'name',
        description: 'description',
      };

      const mockUserId = 1;

      const mockNewBlog = {
        id: 1,
        name: 'name',
        description: 'description',
        userId: 1,
        user: { id: 1, username: 'username', password: 'password' },
      };

      jest.spyOn(blogRepository, 'create').mockReturnValue(mockNewBlog);
      jest.spyOn(blogRepository, 'save').mockResolvedValue(mockNewBlog);

      const result = await blogService.createBlog(
        mockCreateBlogInput,
        mockUserId,
      );

      expect(result).toEqual(mockNewBlog);
    });
  });

  describe('updateBlog', () => {
    it('should update a blog', async () => {
      const mockUpdateBlogInput = {
        id: 1,
      };

      const mockUserId = 1;
      const mockUserRole = UserRole.WRITER;

      const mockBlog: Blog = {
        id: 1,
        name: 'name',
        description: 'description',
        userId: 1,
        user: { id: 1, username: 'username', password: 'password' },
      };

      jest.spyOn(blogRepository, 'findOneByOrFail').mockResolvedValue(mockBlog);
      jest.spyOn(blogRepository, 'save').mockResolvedValue(mockBlog);

      const result = await blogService.updateBlog(
        mockUpdateBlogInput,
        mockUserId,
        mockUserRole,
      );

      expect(result).toEqual(mockBlog);
    });

    it('should throw an exception if user does not have permission', async () => {
      const mockUpdateBlogInput = {
        id: 1,
      };

      const mockUserId = 1;
      const mockUserRole = UserRole.WRITER;

      const mockBlog = {
        id: 1,
        name: 'name',
        description: 'description',
        userId: 2,
        user: { id: 2, username: 'username', password: 'password' },
      };

      jest.spyOn(blogRepository, 'findOneByOrFail').mockResolvedValue(mockBlog);

      await expect(
        blogService.updateBlog(mockUpdateBlogInput, mockUserId, mockUserRole),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('removeBlog', () => {
    it('should remove a blog', async () => {
      const mockBlogId = 1;

      const mockUserId = 1;
      const mockUserRole = UserRole.WRITER;

      const mockBlog = {
        id: 1,
        name: 'name',
        description: 'description',
        userId: 1,
        user: { id: 1, username: 'username', password: 'password' },
      };

      jest.spyOn(blogRepository, 'findOneByOrFail').mockResolvedValue(mockBlog);
      jest
        .spyOn(blogRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: 1 });

      const result = await blogService.removeBlog(
        mockBlogId,
        mockUserId,
        mockUserRole,
      );

      expect(result).toEqual(mockBlog);
    });

    it('should throw an exception if user does not have permission', async () => {
      const mockBlogId = 1;

      const mockUserId = 1;
      const mockUserRole = UserRole.WRITER;

      const mockBlog = {
        id: 1,
        name: 'name',
        description: 'description',
        userId: 2,
        user: { id: 2, username: 'username', password: 'password' },
      };

      jest.spyOn(blogRepository, 'findOneByOrFail').mockResolvedValue(mockBlog);

      await expect(
        blogService.removeBlog(mockBlogId, mockUserId, mockUserRole),
      ).rejects.toThrow(HttpException);
    });
  });
});
