import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { CollectMoneyService } from '../collects/collects.service';
import { CollectMoney } from '../collects/schemas/collect.schema';

describe('CollectsService', () => {
  let collectsService: CollectMoneyService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollectMoneyService,
        {
          provide: getModelToken(CollectMoney.name),
          useValue: {
            create: jest.fn()
          }
        },
        {
          provide: UsersService,
          useValue: {
            getByIdAsync: jest.fn(),
            saveAsync: jest.fn()
          }
        }
      ]
    }).compile();

    collectsService = module.get<CollectMoneyService>(CollectMoneyService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('Should be defined', () => {
    expect(collectsService).toBeDefined();
  });

  it('Should subtract cash amount from user', async () => {
    const usersServiceMock1 = jest
      .spyOn(usersService, 'getByIdAsync')
      .mockImplementation(() => Promise.resolve({
        cashMoneyAmount: 10,
        cardMoneyAmount: 15
      }));
    const usersServiceMock2 = jest
      .spyOn(usersService, 'saveAsync')
      .mockImplementation(() => Promise.resolve());

    const result = await collectsService.collectByTypeAsync('', 'cash', 5);
    const expectedResult = { cashMoneyAmount: 5, cardMoneyAmount: 15 };

    expect(usersServiceMock1).toBeCalledTimes(1);
    expect(usersServiceMock2).toBeCalledTimes(1);
    expect(result).toStrictEqual(expectedResult);
  });

  it('Should subtract card amount from user', async () => {
    const usersServiceMock1 = jest
      .spyOn(usersService, 'getByIdAsync')
      .mockImplementation(() => Promise.resolve({
        cashMoneyAmount: 10,
        cardMoneyAmount: 15
      }));
    const usersServiceMock2 = jest
      .spyOn(usersService, 'saveAsync')
      .mockImplementation(() => Promise.resolve());

    const result = await collectsService.collectByTypeAsync('', 'card', 15);
    const expectedResult = { cashMoneyAmount: 10, cardMoneyAmount: 0 };

    expect(usersServiceMock1).toBeCalledTimes(1);
    expect(usersServiceMock2).toBeCalledTimes(1);
    expect(result).toStrictEqual(expectedResult);
  });

  it('Should throw an exception if the quantity to take is greater than the accumulated', async () => {
    const usersServiceMock = jest
      .spyOn(usersService, 'getByIdAsync')
      .mockImplementation(() => Promise.resolve({
        cashMoneyAmount: 10,
        cardMoneyAmount: 15
      }));

    await expect(() => collectsService.collectByTypeAsync('', 'cash', 20)).rejects.toThrow();
    expect(usersServiceMock).toBeCalledTimes(1);
  })

  it('Should subtract all types of collects amount from user', async () => {
    const usersServiceMock1 = jest
      .spyOn(usersService, 'getByIdAsync')
      .mockImplementation(() => Promise.resolve({
        cashMoneyAmount: 10,
        cardMoneyAmount: 15
      }));

    const usersServiceMock2 = jest
      .spyOn(usersService, 'saveAsync')
      .mockImplementation(() => Promise.resolve());

    const result = await collectsService.collectAllAsync('');
    const expectedResult = { cashMoneyAmount: 0, cardMoneyAmount: 0 };

    expect(usersServiceMock1).toBeCalledTimes(1);
    expect(usersServiceMock2).toBeCalledTimes(1);
    expect(result).toStrictEqual(expectedResult);
  });
});