'use strict';

import axios from 'axios';
import R from 'ramda';
import * as parameters from '../../parameters.json';

class CloudService {

  public async createCustomerPurchase (shopping: any): Promise<any> {
    try {
      if (R.equals(parameters.cloudApi.host, undefined)) await this.authenticate();

      const response = await axios(parameters.cloudApi.host + '/customer-purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.TOKEN_CLOUD_API
        },
        data: shopping
      });

      if (R.equals(response.status, 201)) return 'OK';
    }
    catch (error) {
      if (R.equals(R.pathOr('', ['code'], error), 'ECONNREFUSED')) return;

      if (R.equals(R.pathOr(0, ['response', 'status'], error), 401)) await this.authenticate();

      return;
    }
  }

  private async authenticate (): Promise<any> {
    const response = await axios(parameters.cloudApi.host + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        email: parameters.cloudApi.user,
        password: parameters.cloudApi.password
      }
    });

    process.env.TOKEN_CLOUD_API = response.data.data;
  }

}

const cloudService = new CloudService();

export { cloudService };