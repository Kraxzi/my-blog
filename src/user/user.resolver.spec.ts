import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

describe('UserResolver', () => {
  let userResolver: UserResolver;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
            login: jest.fn(),
            createUser: jest.fn(),
            updateUser: jest.fn(),
            removeUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userResolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
  });

  describe('findOne', () => {
    it('should return a user by username', async () => {
      const mockUsername = 'username';
      const mockUser = {
        id: 1,
        username: mockUsername,
        password: 'password',
      };

      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);

      const result = await userResolver.findOne(mockUsername);

      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      const mockUsername = 'username';

      jest.spyOn(userService, 'findOne').mockResolvedValue(null);

      const result = await userResolver.findOne(mockUsername);

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return a logged user output', async () => {
      const mockLoginUserInput = {
        username: 'username',
        password: 'password',
      };
      const mockToken = { access_token: 'token' };

      jest.spyOn(userService, 'login').mockResolvedValue(mockToken);

      const result = await userResolver.login(mockLoginUserInput);

      expect(result).toEqual(mockToken);
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
        password: 'password',
      };

      jest.spyOn(userService, 'createUser').mockResolvedValue(mockUser);

      const result = await userResolver.createUser(mockCreateUserInput);

      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const mockUpdateUserInput = {
        id: 1,
        username: 'username',
        password: 'password',
      };
      const mockUser = {
        id: mockUpdateUserInput.id,
        username: mockUpdateUserInput.username,
        password: 'password',
      };

      jest.spyOn(userService, 'updateUser').mockResolvedValue(mockUser);

      const result = await userResolver.updateUser(mockUpdateUserInput);

      expect(result).toEqual(mockUser);
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

      jest.spyOn(userService, 'removeUser').mockResolvedValue(mockUser);

      const result = await userResolver.removeUser(mockUserId);

      expect(result).toEqual(mockUser);
    });
  });
});
