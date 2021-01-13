import { EventType } from '../constants/EventType';
import { CollectionEventReceived } from '../models/CollectionEventReceived';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { PaymentMethod } from '../models/PaymentMethod';
import { Station } from '../models/Station';
import { ProductService } from '../services/ProductService';
import { UserService } from '../services/UserService';
import { PaymentMethodService } from '../services/PaymentMethodService';
import { StationService } from '../services/StationService';
import { Inject } from '@tsed/di';

export class FirebaseConsumer {

  @Inject()
  private readonly productService: ProductService;

  @Inject()
  private readonly userService: UserService;

  @Inject()
  private readonly paymentService: PaymentMethodService;

  @Inject()
  private readonly stationService: StationService;

  /**
   * Run task when an event is received
   * @param {CollectionEventReceived} collectionEventReceived Event to apply to collection
   * @returns {Promise} The operation to apply to collection
   */
  public executeTaskAsync = () => async (collectionEventReceived: CollectionEventReceived): Promise<any> => {
    const operation = this.selectQueryByModel(collectionEventReceived);
    return await operation;
  }

  /**
   * Select the specific function to build query depending of collection is passed
   * @param {CollectionEventReceived} message 
   * @returns {Function} The function to execute the specific query
   */
  private selectQueryByModel(message: CollectionEventReceived): any {
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
    switch(typeOperation) {
      case EventType.Create: return this.userService.createAsync(user);
      case EventType.Update: return this.userService.updateOneByIdAsync(id, user);
      case EventType.Delete: return this.userService.deleteOneByIdAsync(id);
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
    switch(typeOperation) {
      case EventType.Create: return this.productService.createAsync(product);
      case EventType.Update: return this.productService.updateOneByIdAsync(id, product);
      case EventType.Delete: return this.productService.deleteOneByIdAsync(id);
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
    switch(typeOperation) {
      case EventType.Create: return this.paymentService.createAsync(payment);
      case EventType.Update: return this.paymentService.updateOneByIdAsync(id, payment);
      case EventType.Delete: return this.paymentService.deleteOneByIdAsync(id);
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
    switch(typeOperation) {
      case EventType.Create: return this.stationService.createAsync(station);
      case EventType.Update: return this.stationService.updateOneByIdAsync(id, station);
      case EventType.Delete: return this.stationService.deleteOneByIdAsync(id);
    }
  }

}