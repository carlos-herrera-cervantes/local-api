import { PlatformTest } from '@tsed/common';
import { CloudService } from '../../src/services/CloudService';
import { Credentials } from '../../src/models/Credentials';
import { expect } from 'chai';

const DUMMY_HOST = 'http://www.dummy-domain.com/api/v1';

describe('CloudService', () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it('Return a Json Web Token (string)', async () => {
    const cloudService = PlatformTest.get<CloudService>(CloudService);
    const httpClient = (url, payload) => new Promise((resolve, reject) => resolve({ data: { data: '<DUMMY-TOKEN>' } }));

    const result = await cloudService.authenticateAsync(DUMMY_HOST, new Credentials(), httpClient);

    expect(result).equal('<DUMMY-TOKEN>');
    expect(typeof result).equal('string');
  });

  it('Create a new sale using the Cloud API', async () => {
    const cloudService = PlatformTest.get<CloudService>(CloudService);
    const httpClient = (url, payload, token) => new Promise((resolve, reject) => resolve({ status: 201 }));

    const result = await cloudService.createSaleAsync(DUMMY_HOST, {}, '', httpClient);
    
    expect(result).equal(true);
    expect(typeof result).equal('boolean');
  });
});