import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/schemas/user.schema';
import { IMongoDBFilter } from '../base/entities/mongodb-filter.entity';
import { HashingService } from 'src/hashing/hashing.service';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private hashingService: HashingService
  ) {}

  /**
   * Validates user credentials
   * @param {IAuthCredentials} credentials 
   * @returns If credentials are correct returns the user otherwise returns null
   */
  async validateUser(email: string, password: string): Promise<any> {
    const filter = { criteria: { email } } as IMongoDBFilter;
    const user = await this.usersService.getOneAsync(filter) as User;
    const isValidPassword = await this.hashingService.compareAsync(password, user?.password)
      .catch(_ => {
        throw new Error('InvalidCredentials');
      });

    if (isValidPassword) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  /**
   * Returns a bearer token
   * @param {User} user
   * @returns Bearer token
   */
  async login(user: any): Promise<string> {
    const payload = { email: user.email, sub: user._id, roles: user?.roles };
    return await this.jwtService.signAsync(payload);
  }

  /**
   * Returns the payload used to sign the token
   * @param {String} token
   * @returns Payload used to sign the token
   */
  async getPayload(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token);
  }

}