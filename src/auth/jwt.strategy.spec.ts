import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../user/enums/user-role.enum';
import * as Chance from 'chance';

const chance = new Chance();

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => {
              return chance.string({ length: 15 });
            }),
          },
        },
      ],
    }).compile();

    jwtStrategy = moduleRef.get<JwtStrategy>(JwtStrategy);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  describe('validate', () => {
    it('should return the payload and userId', async () => {
      const payload = {
        username: 'username',
        role: UserRole.WRITER,
        sub: 1,
      };

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({ payload, userId: 1 });
    });
  });
});
