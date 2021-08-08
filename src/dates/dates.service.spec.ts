import { Test, TestingModule } from "@nestjs/testing";
import { DateService } from "./dates.service";

describe('DatesService', () => {
  let datesService: DateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DateService]
    }).compile();

    datesService = module.get<DateService>(DateService);
  });

  it('Should be defined', () => {
    expect(datesService).toBeDefined();
  });

  it('Should create a Date using array of numbers', () => {
    const numbers = [2021, 22, 7, 20, 0, 0];
    const expectedResult = new Date(2021, 22, 7, 20, 0, 0);

    const result = datesService.createDateByArray(numbers);

    expect(result).toEqual(expectedResult);
  });

  it('Should returns array of numbers', () => {
    const stringDate = '2021-22-07T21:00:00';
    const expectedResult = [2021, 22, 7, 21, 0, 0];

    const result = datesService.splitByString(stringDate);

    expect(result).toEqual(expectedResult);
  });

  it('Should returns object with dates', () => {
    const date = new Date(2021, 7, 23, 10, 50, 0);
    const expectedResult = {
      stringLongDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` +
        'T' +
        `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
      stringShortDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      stringTime: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
      date
    };

    const result = datesService.formatLocalStringDate(date);

    expect(result).toStrictEqual(expectedResult);
  });
});