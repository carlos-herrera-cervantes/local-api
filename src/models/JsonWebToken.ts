import { verify, sign } from 'jsonwebtoken';
import * as parameters from '../../parameters.json';
import * as R from 'ramda';

export class JsonWebToken {

  /**
   * Extract the string token
   * @param headers HTTP headers
   * @returns String token 
   */
  static extractToken(headers: object): string {
    const authorization = R.pathOr('', ['authorization'], headers);
    return R.last(authorization.split(' ')) as string;
  }

  /**
   * Returns the values used to sign the token
   * @param token String token
   * @returns Object with fields used to sign
   */
  static Deconstruct(token: string): any {
    return verify(token, parameters.jwt.secret);
  }

  /**
   * Returns the string token
   * @param payload Values used to sign the token
   * @returns String token
   */
  static Construct(payload: object): string {
    return sign(payload, parameters.jwt.secret, { expiresIn: '120h' });
  }
}