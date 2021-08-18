import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FirebaseService } from '../firebase.service';

@Injectable()
export class SaleClosedListener {

  constructor(private readonly firebaseService: FirebaseService) {}

  @OnEvent('sale.closed', { async: true })
  async handleSaleClosedEvent(sale: any, id: string): Promise<void> {
    await this.firebaseService
      .tryInsertChildAsync(`events/local/sales/${id}`, sale);
  }

}