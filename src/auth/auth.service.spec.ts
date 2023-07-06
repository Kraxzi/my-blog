import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../user/enums/user-role.enum';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: UserService,
          useFactory: () => ({
            findOne: jest.fn(),
          }),
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return null if user is not found', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);

      const result = await authService.validateUser('username', 'password');

      expect(result).toBeNull();
      expect(userService.findOne).toHaveBeenCalledWith('username');
    });

    it('should return null if password does not match', async () => {
      const user = {
        id: 1,
        username: 'username',
        password: 'hashed_password',
      };
      jest.spyOn(userService, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockReturnValue(false as never);

      const result = await authService.validateUser('username', 'password');

      expect(result).toBeNull();
      expect(userService.findOne).toHaveBeenCalledWith('username');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password',
        'hashed_password',
      );
    });

    it('should return the user if username and password match', async () => {
      const user = {
        id: 1,
        username: 'username',
        password: 'hashed_password',
      };
      jest.spyOn(userService, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockReturnValue(true as never);

      const result = await authService.validateUser('username', 'password');

      expect(result).toEqual(user);
      expect(userService.findOne).toHaveBeenCalledWith('username');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password',
        'hashed_password',
      );
    });
  });

  describe('generateUserCredentials', () => {
    it('should generate user credentials', () => {
      const user = {
        id: 1,
        username: 'username',
        password: 'hashed_password',
        role: UserRole.WRITER,
      };
      jest.spyOn(jwtService, 'sign').mockReturnValue('mocked_token');

      const result = authService.generateUserCredentials(user);

      expect(result.access_token).toBe('Bearer mocked_token');
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: user.username,
        role: user.role,
        sub: user.id,
      });
    });
  });
});
