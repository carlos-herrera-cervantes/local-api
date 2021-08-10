import { Logger } from '@nestjs/common';
import { HttpService, Injectable } from '@nestjs/common';

@Injectable()
export class B2CService {
  private readonly logger = new Logger(B2CService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Returns a list of user containing only the user that matches with the email
   * @param {String} customerEmail Customer email
   * @returns Http response
   */
  async getUserByEmail(customerEmail: string): Promise<any> {
    try {
      const response = await this.httpService.get('/clients', {
        params: {
          filter: `{"email":"${customerEmail}"}`,
        },
      }).toPromise();

      return response?.data?.data;
    } catch (err) {
      this.logger.error({
        datetime: new Date(),
        appId: '',
        event: 'b2c_get_user_by_email_fail',
        level: 'ERROR',
        description: 'Error trying to get a user against B2C API: ' + err?.message,
      });

      return false;
    }
  }

}