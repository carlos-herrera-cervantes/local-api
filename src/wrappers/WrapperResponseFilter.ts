import { ResponseFilter, Context, ResponseFilterMethods } from '@tsed/common';

@ResponseFilter('application/json')
export class WrapperResponseFilter implements ResponseFilterMethods {
  transform(data: any, ctx: Context) {
    return { status: true, data };
  }
}