'use strict';

import { EventType } from "../../Api.Domain/Constants/EventType";
import { IPaymentMethod } from "../../Api.Domain/Models/IPaymentMethod";
import { IProduct } from "../../Api.Domain/Models/IProduct";
import { IStation } from "../../Api.Domain/Models/IStation";
import { IUser } from "../../Api.Domain/Models/IUser";
import { IRepository } from "../../Api.Repository/Repositories/IRepository";
import { resolveRepositories } from "../Config/Container";
import { CollectionEventReceived } from "../Models/CollectionEventReceived";

class FirebaseConsumer {

  private readonly _userRepository: IRepository<IUser>;
  private readonly _productRepository: IRepository<IProduct>;
  private readonly _paymentRepository: IRepository<IPaymentMethod>;
  private readonly _stationRepository: IRepository<IStation>;

  constructor (
    userRepository: IRepository<IUser>,
    productRepository: IRepository<IProduct>,
    paymentMethodRepository: IRepository<IPaymentMethod>,
    stationRepository: IRepository<IStation>
  ) {
    this._userRepository = userRepository;
    this._productRepository = productRepository;
    this._paymentRepository = paymentMethodRepository;
    this._stationRepository = stationRepository;
  }

  /**
   * Run task when an event is received
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
  private selectQueryByModel = (message: CollectionEventReceived): any => {
    const { model } = message;

    switch (model.Collection) {
      case 'users': return this.buildQueryUsers(model.Type, model.Id, model.Model as IUser);
      case 'products': return this.buildQueryProducts(model.Type, model.Id, model.Model as IProduct);
      case 'payments': return this.buildQueryPayments(model.Type, model.Id, model.Model as IPaymentMethod);
      case 'stations': return this.buildQueryStations(model.Type, model.Id, model.Model as IStation);
    }
  }

  /**
   * Build the queries for users collection
   * @param {String} typeOperation
   * @param {String} id
   * @param {IUser} user
   * @returns {Function} The function to execute the specific query
   */
  private buildQueryUsers = (typeOperation: string, id: string, user: IUser): Promise<Function> => {
    switch (typeOperation) {
      case EventType.Create: return this._userRepository.createAsync(user);
      case EventType.Update: return this._userRepository.updateByIdAsync(id, user);
      case EventType.Delete: return this._userRepository.deleteByIdAsync(id);
    }
  }

  /**
   * Build the queries for products collection
   * @param {String} typeOperation
   * @param {String} id
   * @param {IProduct} product
   * @returns {Function} The function to execute the specific query
   */
  private buildQueryProducts = (typeOperation: string, id: string, product: IProduct): Promise<Function> => {
    switch (typeOperation) {
      case EventType.Create: return this._productRepository.createAsync(product);
      case EventType.Update: return this._productRepository.updateByIdAsync(id, product);
      case EventType.Delete: return this._productRepository.deleteByIdAsync(id);
    }
  }

  /**
   * Build the queries for payment method collection
   * @param {String} typeOperation
   * @param {String} id
   * @param {IPaymentMethod} payment
   * @returns {Function} The function to execute the specific query
   */
  private buildQueryPayments = (typeOperation: string, id: string, payment: IPaymentMethod): Promise<Function> => {
    switch (typeOperation) {
      case EventType.Create: return this._paymentRepository.createAsync(payment);
      case EventType.Update: return this._paymentRepository.updateByIdAsync(id, payment);
      case EventType.Delete: return this._paymentRepository.deleteByIdAsync(id);
    }
  }

  /**
   * Build the queries for stations collection
   * @param {String} typeOperation
   * @param {String} id
   * @param {IStation} station
   * @returns {Function} The function to execute the specific query
   */
  private buildQueryStations = (typeOperation: string, id: string, station: IStation): Promise<Function> => {
    switch (typeOperation) {
      case EventType.Create: return this._stationRepository.createAsync(station);
      case EventType.Update: return this._stationRepository.updateByIdAsync(id, station);
      case EventType.Delete: return this._stationRepository.deleteByIdAsync(id);
    }
  }

}

const firebaseConsumer = new FirebaseConsumer(
  resolveRepositories().userRepository,
  resolveRepositories().productRepository,
  resolveRepositories().paymentMethodRepository,
  resolveRepositories().stationRepository
);

export { firebaseConsumer };