import { createParamDecorator } from '@nestjs/common';

export class QueryParams {
  
  page: number;

  pageSize: number;

  sort: string;

  filter: string;

  relation: string;

  partial: boolean

}

export const CustomQueryParams = createParamDecorator((data, request): QueryParams => {
  const queryParams = new QueryParams();
  const basePath = request?.args[0]?.query;

  queryParams.page = parseInt(basePath?.page) || 1;
  queryParams.pageSize = parseInt(basePath?.pageSize) || 10;
  queryParams.sort = basePath?.sort || '{}';
  queryParams.filter = basePath?.filter || '{}';
  queryParams.relation = basePath?.relation || undefined;
  queryParams.partial = basePath?.partial || false;

  return queryParams;
});