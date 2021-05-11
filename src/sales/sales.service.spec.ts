import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { StationsService } from '../stations/stations.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { CollectMoneyService } from '../collects/collects.service';
import { Sale } from './schemas/sale.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('SalesService', () => {
  let salesService: SalesService;
  let stationsService: StationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        {
          provide: getModelToken(Sale.name),
          useValue: {
            find: jest.fn(),
            lean: jest.fn(),
            skip: jest.fn(),
            limit: jest.fn(),
            sort: jest.fn(),
          }
        },
        {
          provide: StationsService,
          useValue: {
            getOneAsync: jest.fn().mockResolvedValue('fake_saved_station')
          }
        },
        {
          provide: UsersService,
          useValue: {
            getAllAsync: jest.fn()
          }
        },
        {
          provide: ProductsService,
          useValue: {
            getAllAsync: jest.fn()
          }
        },
        {
          provide: CollectMoneyService,
          useValue: {
            getAllAsync: jest.fn()
          }
        }
      ]
    }).compile();

    salesService = module.get<SalesService>(SalesService);
    stationsService = module.get<StationsService>(StationsService);
  });

  it('Should be defined', () => {
    expect(salesService).toBeDefined();
  });

  it('Should return the skeleton of a sale', async () => {
    const stationsServiceMock1 = jest
      .spyOn(stationsService, 'getOneAsync')
      .mockImplementation(() => Promise.resolve({ _id: 'station1' }));

    const result = await salesService.initializeSaleObject('customer1', 'position1', 'user1');
    const mocked = {
      customer: 'customer1',
      position: 'position1',
      user: 'user1',
      folio: result?.folio,
      consecutive: 1,
      station: 'station1'
    };

    expect(stationsServiceMock1).toBeCalledTimes(1);
    expect(result).toStrictEqual(mocked);
  });
});