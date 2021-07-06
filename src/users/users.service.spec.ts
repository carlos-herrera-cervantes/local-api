import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './schemas/user.schema';
import { UsersService } from "./users.service";
import { HashingService } from '../hashing/hashing.service';
import { Role } from '../base/enums/role.enum';

const GLOBAL_USER = {
  email: 'user@example.com',
  firstName: 'User',
  lastName: 'Example',
  password: 'secret123',
  roles: [
    Role.Employee
  ]
};

describe('UsersService', () => {
  let usersService: UsersService;
  let hashingService: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn().mockImplementation(() => Promise.resolve(GLOBAL_USER))
          }
        },
        {
          provide: HashingService,
          useValue: {
            hashAsync: jest.fn()
          }
        }
      ]
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    hashingService = module.get<HashingService>(HashingService);
  });

  it('Should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('Should skip the password after create a user', async () => {
    const hashingServiceMock = jest
      .spyOn(hashingService, 'hashAsync')
      .mockImplementation(() => Promise.resolve('hashed-password'));

    const result = await usersService.createAsync(GLOBAL_USER);
    const expectedResult = {
      email: 'user@example.com',
      firstName: 'User',
      lastName: 'Example',
      roles: [
        Role.Employee
      ]
    };

    expect(hashingServiceMock).toBeCalledTimes(1);
    expect(result).toStrictEqual(expectedResult);
  });
});