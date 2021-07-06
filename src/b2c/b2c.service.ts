import { Logger } from '@nestjs/common';
import { HttpService, Injectable } from '@nestjs/common';

@Injectable()
export class B2CService {
  private readonly logger = new Logger(B2CService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Authenticates against B2C API
   * @param host
   * @param data
   * @example
   * { email: 'user@example.com', password: 'secret' }
   * @returns Json Web Token
   */
  async authAsync(host: string, data: any): Promise<string | boolean> {
    try {
      const response = await this.httpService.post(host, data).toPromise();
      return response?.data?.data;
    } catch (err) {
      this.logger.error({
        datetime: new Date(),
        appId: '',
        event: 'b2c_auth_fail',
        level: 'ERROR',
        description: 'Error trying to authenticate against B2C API: ' + err?.message,
      });

      return false;
    }
  }

  /**
   * Applies a get request
   * @param host 
   * @param requestConfig
   * @returns Http response
   */
  async getAsync(host: string, requestConfig?: any): Promise<any> {
    try {
      const response = await this.httpService.get(host, requestConfig).toPromise();
      return response?.data?.data;
    } catch (err) {
      this.logger.error({
        datetime: new Date(),
        appId: '',
        event: 'b2c_get_request_fail',
        level: 'ERROR',
        description: 'Error trying to get a resource against B2C API: ' + err?.message,
      });

      return false;
    }
  }

}