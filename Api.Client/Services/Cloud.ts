'use strict';

import axios from 'axios';
import R from 'ramda';

class CloudService {

  public async createCustomerPurchase (shopping: any): Promise<any> {
    try {
      if (R.equals(process.env.TOKEN_CLOUD_API, undefined)) await this.authenticate();

      const response = await axios(process.env.HOST_CLOUD_API + '/customer-purchases', {
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
      if (R.equals(error.response.status, 401)) await this.authenticate();
    }
  }

  private async authenticate (): Promise<any> {
    const response = await axios(process.env.HOST_CLOUD_API + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        email: process.env.USER_CLOUD_API,
        password: process.env.PASS_CLOUD_API
      }
    });

    process.env.TOKEN_CLOUD_API = response.data.data;
  }

}

const cloudService = new CloudService();

export { cloudService };