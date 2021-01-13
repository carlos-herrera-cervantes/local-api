import { Service, $log } from '@tsed/common';
import * as R from 'ramda';
import { Credentials } from '../models/Credentials';
import axios from 'axios';

@Service()
export class CloudService {

  /**
   * Authenticate to get a json web token
   * @param url
   * @param credentials
   * @param httpClient Custom http client to unit test
   * @returns Json Web Token
   */
  async authenticateAsync(url: string, credentials: Credentials, httpClient?: any): Promise<string | boolean | undefined> {
    try {
      const response = httpClient ? 
        await httpClient(url, credentials) : 
        await axios(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          email: credentials.email,
          password: credentials.password
        }
      });

      return R.pathOr(false, ['data', 'data'], response);
    }
    catch (err) {
      $log.error('An error has ocurred when trying to get a token from the Cloud API: ', err?.message);
      return false;
    }
  }

  /**
   * Creates a new sale using the Cloud API
   * @param url
   * @param payload
   * @param token
   * @param httpClient Custom http client to unit test
   * @returns If success return true otherwise false
   */
  async createSaleAsync(url: string, payload: any, token: string, httpClient?: any): Promise<any> {
    try {
      const response = httpClient ?
        await httpClient(url, payload, token) :
        await axios(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        data: payload
      });

      if (R.equals(response.status, 201)) return true;

      return false;
    }
    catch (err) {
      $log.error('An error has ocurred when trying to create a sale in Cloud API: ', err?.message);
      return false;
    }
  }

  /**
   * Returns the user info
   * @param url 
   * @param token 
   * @param httpClient Custom http client to unit test
   * @returns If success returns user info otherwise returns false
   */
  async tryConsultClientAsync(url: string, token: string, httpClient?: any): Promise<any> {
    try {
      const response = httpClient ?
        await httpClient(url, token):
        await axios(url, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });

      if (response?.status == 200) return response?.data?.data;

      return false;
    }
    catch(err) {
      $log.error('An error has ocurred when trying to get the client info in B2C API: ', err?.message);
      return false;
    }
  }

}