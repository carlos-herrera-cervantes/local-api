'use strict';

import { ResponseDto } from '../Models/Response';

function ErrorMiddleware(target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
  const original = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    try {
      return await original.apply(this, args);
    }
    catch (error) {
      const [_a, response, _b] = args;
      return ResponseDto.internalServerError(false, response, error.message);
    }
  }

  return descriptor;
}

export { ErrorMiddleware };