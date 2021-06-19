import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashingService {

  /**
   * Verifies if the plain text and the cipher text matches
   * @param plainText 
   * @param cipherText 
   * @returns If matches returns true
   */
  public async compareAsync(plainText: string, cipherText: string): Promise<boolean> {
    return await bcrypt.compare(plainText, cipherText);
  }

  /**
   * Ciphers a plain text
   * @param plainText 
   * @param salt 
   * @returns The cipher text
   */
  public async hashAsync(plainText: string, salt: number = 10): Promise<string> {
    return await bcrypt.hash(plainText, salt);
  }
}