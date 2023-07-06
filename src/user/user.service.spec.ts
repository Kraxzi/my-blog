import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let userService: UserService;
  let authService: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            generateUserCredentials: jest.fn(),
          },
        },
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            findOneByOrFail: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('login', () => {
    it('should return logged user output if credentials are valid', async () => {
      const mockLoginUserInput = {
        username: 'username',
        password: 'password',
      };
      const mockUser = {
        id: 1,
        username: 'username',
        password: 'hashedpassword',
      };
      const mockToken = {
        access_token: 'token',
      };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
      jest
        .spyOn(authService, 'generateUserCredentials')
        .mockReturnValue(mockToken);

      const result = await userService.login(mockLoginUserInput);

      expect(result).toEqual(mockToken);
    });

    it('should throw BadRequestException if credentials are invalid', async () => {
      const mockLoginUserInput = {
        username: 'username',
        password: 'password',
      };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(userService.login(mockLoginUserInput)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user by username', async () => {
      const mockUsername = 'username';
      const mockUser = {
        id: 1,
        username: mockUsername,
        password: 'password',
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);

      const result = await userService.findOne(mockUsername);

      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      const mockUsername = 'username';

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      const result = await userService.findOne(mockUsername);

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockCreateUserInput = {
        username: 'username',
        password: 'password',
      };
      const mockUser = {
        id: 1,
        username: mockCreateUserInput.username,
        password: 'hashedpassword',
      };

      jest.spyOn(userRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => {
        return 'hashed';
      });

      const result = await userService.createUser(mockCreateUserInput);

      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const mockUpdateUserInput = {
        id: 1,
        username: 'username',
      };
      const mockUser = {
        id: 1,
        username: 'username',
        password: 'password',
      };

      jest.spyOn(userRepository, 'findOneByOrFail').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await userService.updateUser(mockUpdateUserInput);

      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user does not exist', async () => {
      const mockUpdateUserInput = {
        id: 1,
        username: 'username',
      };

      jest
        .spyOn(userRepository, 'findOneByOrFail')
        .mockRejectedValue(new Error());

      await expect(userService.updateUser(mockUpdateUserInput)).rejects.toThrow(
        Error,
      );
    });
  });

  describe('removeUser', () => {
    it('should remove an existing user', async () => {
      const mockUserId = 1;
      const mockUser = {
        id: mockUserId,
        username: 'username',
        password: 'password',
      };

      jest.spyOn(userRepository, 'findOneByOrFail').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'delete').mockResolvedValue(undefined);

      const result = await userService.removeUser(mockUserId);

      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user does not exist', async () => {
      const mockUserId = 1;

      jest
        .spyOn(userRepository, 'findOneByOrFail')
        .mockRejectedValue(new Error());

      await expect(userService.removeUser(mockUserId)).rejects.toThrow(Error);
    });
  });
});
