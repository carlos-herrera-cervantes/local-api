import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { StationsService } from '../stations/stations.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { CollectMoneyService } from '../collects/collects.service';
import { Sale } from './schemas/sale.schema';
import { getModelToken } from '@nestjs/mongoose';

const GLOBAL_SALE_MOCKED = {
  _id: 'mockId1',
  folio: 'folio1',
  consecutive: 1,
  vat: 5,
  subtotal: 10,
  total: 15,
  totalLetters: 'QUINCE PESOS',
  user: 'userId1',
  station: 'station1',
  products: [
    {
      product: {
        _id: 'productId1',
        name: 'name1',
        description: 'description1',
        pricePublic: 15,
        measurementUnit: {
          short: 'LITRO',
          keySat: 'LTR'
        },
        taxes: [
          {
            percentage: 0.16,
            name: 'IVA',
            _id: 'taxId1'
          }
        ]
      },
      quantity: 1
    }
  ],
  paymentTransaction: [
    {
      quantity: 15,
      paymentMethod: {
        key: '01',
        name: 'EFECTIVO',
        description: 'PAGO EN EFECTIVO',
        _id: 'paymentId1'
      }
    }
  ],
  customer: {
    email: 'mock.email@example.com',
    _id: 'customerId1'
  }
};

describe('SalesService', () => {
  let salesService: SalesService;
  let stationsService: StationsService;
  let productsService: ProductsService;
  let usersService: UsersService;
  let collectsService: CollectMoneyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        {
          provide: getModelToken(Sale.name),
          useValue: {
            find: jest.fn().mockImplementation(() => Promise.resolve([GLOBAL_SALE_MOCKED])),
            findById: jest.fn().mockImplementation(() => Promise.resolve(GLOBAL_SALE_MOCKED)),
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
            getAllAsync: jest.fn(),
            getByIdAsync: jest.fn(),
            saveAsync: jest.fn()
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
    productsService = module.get<ProductsService>(ProductsService);
    usersService = module.get<UsersService>(UsersService);
    collectsService = module.get<CollectMoneyService>(CollectMoneyService);
  });

  it('Should be defined', () => {
    expect(salesService).toBeDefined();
  });

  it('Should return the skeleton of a sale to put in the messaging queue', async () => {
    const result = await salesService.createCloudStructure('mockId1');
    const mocked = {
      _id: 'mockId1',
      folio: 'folio1',
      vat: 5,
      subtotal: 10,
      total: 15,
      totalLetters: 'QUINCE PESOS',
      userId: 'userId1',
      station: 'station1',
      products: [
        {
          _id: 'productId1',
          name: 'name1',
          description: 'description1',
          quantity: 1,
          priceUnit: 15,
          price: 15,
          measurementUnit: 'LITRO',
          measurementUnitSat: 'LTR',
          taxes: [
            {
              percentage: 0.16,
              name: 'IVA',
              _id: 'taxId1'
            }
          ]
        }
      ],
      payments: [
        {
          quantity: 15,
          key: '01',
          description: 'PAGO EN EFECTIVO',
          _id: 'paymentId1'
        }
      ],
      client: {
        email: 'mock.email@example.com',
        _id: 'customerId1'
      }
    };

    expect(result).toStrictEqual(mocked);
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
      consecutive: 2,
      station: 'station1'
    };

    expect(stationsServiceMock1).toBeCalledTimes(1);
    expect(result).toStrictEqual(mocked);
  });

  it('Should calculate the total of a sale', async () => {
    const mockedProducts = [
      {
        _id: '5fffcd7ad52e31421f10dc8e',
        name: 'Test product',
        price: 10,
        pricePublic: 18,
        type: 'fuel',
        taxes: [
          {
            percentage: 0.5508,
            name: 'IEPS'
          },
          {
            percentage: 0.16,
            name: 'IVA'
          }
        ]
      }
    ];

    const productsServiceMock1 = jest
      .spyOn(productsService, 'getAllAsync')
      .mockImplementation(() => Promise.resolve(mockedProducts));

    const mockedSale = new Sale();
    mockedSale.products = [
      {
        product: '5fffcd7ad52e31421f10dc8e' as any,
        quantity: 1
      }
    ];

    const result = await salesService.calculateTotalAsync(mockedSale);
    const TOTAL = 18;
    const VAT = 3;
    const SUBTOTAL = 15;

    expect(productsServiceMock1).toBeCalledTimes(1);
    expect(result.total).toEqual(TOTAL);
    expect(result.vat).toEqual(VAT);
    expect(result.subtotal).toEqual(SUBTOTAL);
  });

  it('Should charge the amount of money to the user', async () => {
    const mockedUser = {
      cashMoneyAmount: 0,
      cardMoneyAmount: 0,
    };

    const usersServiceMock1 = jest
      .spyOn(usersService, 'getByIdAsync')
      .mockImplementation(() => Promise.resolve(mockedUser));

    const mockedSale = {
      payments: [
        {
          quantity: 15,
          key: '01'
        }
      ]
    };
    const result = await salesService.chargeMoneyToUser('', mockedSale);
    const CHARGED_QUANTITY = 15;

    expect(usersServiceMock1).toBeCalledTimes(1);
    expect(result.cashMoneyAmount).toEqual(CHARGED_QUANTITY);
    expect(result.cardMoneyAmount).toEqual(0);
  });

  it('Should return the details of cut turn', async () => {
    const mockedCollects = [
      {
        type: 'cash',
        amount: 15,
        user: 'userId1'
      }
    ];

    const collectsServiceMock1 = jest
      .spyOn(collectsService, 'getAllAsync')
      .mockImplementation(() => Promise.resolve(mockedCollects));

    const result = await salesService.doReportAsync({ start: '', end: '' }, '');
    const expectedResult = {
      products: [
        {
          label: 'name1',
          amount: 15
        }
      ],
      payments: [
        {
          label: 'EFECTIVO',
          amount: 15
        }
      ],
      collectsCash: mockedCollects,
      collectsCards: []
    };

    expect(collectsServiceMock1).toBeCalledTimes(1);
    expect(result).toStrictEqual(expectedResult);
  });
});