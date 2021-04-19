import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tax, TaxDocument } from './schemas/tax.schema';
import { BaseService } from '../base/base.service';

@Injectable()
export class TaxesService extends BaseService {
  
  constructor(@InjectModel(Tax.name) private taxModel: Model<TaxDocument>) {
    super(taxModel);
  }

}