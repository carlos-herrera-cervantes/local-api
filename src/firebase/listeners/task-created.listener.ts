import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskCreatedEvent } from '../events/task-created.event';
import { ProductsService } from '../../products/products.service';
import { UsersService } from '../../users/users.service';
import { PaymentMethodService } from '../../paymentMethods/paymentMethods.service';
import { StationsService } from '../../stations/stations.service';
import { EventType } from '../../base/enums/event-type.enum';
import { Station } from '../../stations/schemas/station.schema';
import { PaymentMethod } from '../../paymentMethods/schemas/paymentMethod.schema';
import { Product } from '../../products/schemas/product.schema';
import { User } from '../../users/schemas/user.schema';

@Injectable()
export class TaskCreatedListener {

  constructor(
    private productsService: ProductsService,
    private usersService: UsersService,
    private paymentMethodService: PaymentMethodService,
    private stationsService: StationsService
  ) { }

  @OnEvent('task.created')
  async handleTaskCreatedEvent(event: TaskCreatedEvent): Promise<void> {
    const operation = this.selectQueryByModel(event);
    await operation;
  }

  /**
   * Select the specific function to build query depending of collection is passed
   * @param {TaskCreatedEvent} message 
   * @returns {Function} The function to execute the specific query
   */
   private selectQueryByModel(message: TaskCreatedEvent): any {
    const { model: { Type, Id, Model, Collection } } = message;

    switch (Collection) {
      case 'users': return this.buildQueryUsers(Type, Id, Model);
      case 'products': return this.buildQueryProducts(Type, Id, Model);
      case 'payments': return this.buildQueryPayments(Type, Id, Model);
      case 'stations': return this.buildQueryStations(Type, Id, Model);
    }
  }

  /**
   * Build the queries for users collection
   * @param {String} typeOperation
   * @param {String} id
   * @param {User} user
   * @returns {Function} The function to execute the specific query
   */
  private buildQueryUsers(typeOperation: string, id: string, user: User): any {
    switch (typeOperation) {
      case EventType.Create: return this.usersService.createAsync(user);
      case EventType.Update: return this.usersService.updateOneByIdAsync(id, user);
      case EventType.Delete: return this.usersService.deleteOneByIdAsync(id);
    }
  }

  /**
   * Build the queries for products collection
   * @param {String} typeOperation
   * @param {String} id
   * @param {Product} product
   * @returns {Function} The function to execute the specific query
   */
  private buildQueryProducts(typeOperation: string, id: string, product: Product): any {
    switch (typeOperation) {
      case EventType.Create: return this.productsService.createAsync(product);
      case EventType.Update: return this.productsService.updateOneByIdAsync(id, product);
      case EventType.Delete: return this.productsService.deleteOneByIdAsync(id);
    }
  }

  /**
   * Build the queries for payment method collection
   * @param {String} typeOperation
   * @param {String} id
   * @param {PaymentMethod} payment
   * @returns {Function} The function to execute the specific query
   */
  private buildQueryPayments(typeOperation: string, id: string, payment: PaymentMethod): any {
    switch (typeOperation) {
      case EventType.Create: return this.paymentMethodService.createAsync(payment);
      case EventType.Update: return this.paymentMethodService.updateOneByIdAsync(id, payment);
      case EventType.Delete: return this.paymentMethodService.deleteOneByIdAsync(id);
    }
  }

  /**
   * Build the queries for stations collection
   * @param {String} typeOperation
   * @param {String} id
   * @param {Station} station
   * @returns {Function} The function to execute the specific query
   */
  private buildQueryStations(typeOperation: string, id: string, station: Station): any {
    switch (typeOperation) {
      case EventType.Create: return this.stationsService.createAsync(station);
      case EventType.Update: return this.stationsService.updateOneByIdAsync(id, station);
      case EventType.Delete: return this.stationsService.deleteOneByIdAsync(id);
    }
  }

}