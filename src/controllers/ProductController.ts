import { Controller, Get, Patch, BodyParams, PathParams, UseBefore, QueryParams } from "@tsed/common";
import { Summary, Status } from '@tsed/schema';
import { ValidatorRole, ValidatorProductExists } from '../decorators/ValidatorDecorator';
import { AuthorizeMiddleware } from '../middlewares/AuthorizeMiddleware';
import { ValidatePaginationMiddleware } from '../middlewares/ValidatorMiddleware';
import { ErrorMiddleware } from '../middlewares/ErrorMiddleware';
import { ProductService } from '../services/ProductService';
import { Filter } from '../models/Filter';
import { Parameters } from '../models/Paramameters';
import { Paginator } from '../models/Paginator';
import { Roles } from '../constants/Roles';
import { Product } from '../models/Product';
import { 
  listDataResponseExample, 
  singleDataResponseExample, 
  badRequest, 
  internalServerError, 
  productObjectExample
} from '../swagger/Examples';

@Controller('/products')
@UseBefore(AuthorizeMiddleware)
@UseBefore(ErrorMiddleware)
export class ProductController {

  constructor(private readonly productService: ProductService) { }
  
  @Get()
  @Summary('Return a list of products')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ listDataResponseExample([ productObjectExample ]) ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin)
  @UseBefore(ValidatePaginationMiddleware)
  async getAllAsync(@QueryParams() queryParams: Parameters): Promise<Paginator<Product>> {
    const filter = new Filter(queryParams)
      .setCriteria()
      .setPagination()
      .setSort()
      .setRelation()
      .build();

    const [products, totalDocs] = await Promise.all([
      this.productService.getAllAsync(filter),
      this.productService.countDocuments(filter)
    ]);

    return new Paginator<Product>(products, queryParams, totalDocs).pager();
  }

  @Get('/:id')
  @Summary('Return a specific product')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(productObjectExample) ])
  @(Status(404).Description('Product not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorRole(Roles.Employee, Roles.StationAdmin, Roles.SuperAdmin)
  @ValidatorProductExists('_id')
  async getByIdAsync(@PathParams('id') id: string): Promise<Product> {
    return await this.productService.getByIdAsync(id);
  }

  @Patch('/:id')
  @Summary('Updates existing product')
  @(Status(200).Description('Success'))
    .ContentType('application/json')
    .Examples([ singleDataResponseExample(productObjectExample) ])
  @(Status(404).Description('Product not found'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(400).Description('Invalid product'))
    .ContentType('application/json')
    .Examples([ badRequest ])
  @(Status(500).Description('Internal Server Error'))
    .ContentType('application/json')
    .Examples([ internalServerError ])
  @ValidatorProductExists('_id')
  async updateOneByIdAsync(@PathParams('id') id: string, @BodyParams() product: any): Promise<Product> {
    return await this.productService.updateOneByIdAsync(id, product);
  }
}