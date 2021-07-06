import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { DateService } from "../dates/dates.service";
import { Shift } from "./schemas/shift.schema";
import { ShiftsService } from "./shifts.service";

const SHIFTS = [
  {
    name: 'Evening',
    order: 1,
    startTime: '12:00:00',
    endTime: '20:59:59',
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  },
  {
    name: 'Night',
    order: 2,
    startTime: '21:00:00',
    endTime: '23:59:59',
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  }
] as Shift[];

describe('ShiftsService', () => {
  let shiftsService: ShiftsService;
  let datesService: DateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShiftsService,
        {
          provide: getModelToken(Shift.name),
          useValue: {
            getPrevious: jest.fn(),
          }
        },
        {
          provide: DateService,
          useValue: {
            setLocalDate: jest.fn(),
            getLocalDate: jest.fn(),
          }
        }
      ]
    }).compile();

    shiftsService = module.get<ShiftsService>(ShiftsService);
    datesService = module.get<DateService>(DateService);
  });

  it('Should be defined', () => {
    expect(shiftsService).toBeDefined();
  });

  it('Should return the previous shift at the current shift', () => {
    const datesServiceMock1 = jest
      .spyOn(datesService, 'setLocalDate')
      .mockImplementation((time: string) => {
        const splitedTime = time.split(':');
        return {
          date: new Date(2021, 7, 22, parseInt(splitedTime[0]), parseInt(splitedTime[1]), parseInt(splitedTime[2]))
        };
      });

    const datesServiceMock2 = jest
      .spyOn(datesService, 'getLocalDate')
      .mockImplementation(() => ({ date: '2021-07-22T21:00:00' }));

    const result = shiftsService.getPrevious(SHIFTS, { date: new Date(2021, 7, 22, 21, 35, 0) });

    expect(datesServiceMock1).toBeCalledTimes(4);
    expect(datesServiceMock2).toBeCalledTimes(2);
    expect(result.name).toEqual('Evening');
  });
});
