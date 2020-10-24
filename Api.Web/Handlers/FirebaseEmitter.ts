'use strict';

import Queue from 'firebase-queue';
import { CollectionEventReceived } from '../Models/CollectionEventReceived';
import { appEventEmitter } from './AppEventEmitter';
import { initializeFirebaseApp } from '../Config/Container';
import * as parameters from '../../parameters.json';

class FirebaseEmitter {

  private firebaseApp: any = initializeFirebaseApp();

  constructor () {}

  /**
   * Emits an event for users collection
   * @returns {CollectionEventReceived} Type of event to apply to users collection
   */
  public emitUsersEvent (): any {
    const database = this.firebaseApp;
    const ref = database.ref(`${parameters.firebase.pathTasks}/stations/${parameters.app.stationId}/users`);
    
    new Queue(ref, (data, progress, resolve, reject) => {
      const message = new CollectionEventReceived(data);
      appEventEmitter.emit('FirebaseMessage', message);
      resolve();
    });
  }

  /**
   * Emits an event for products collection
   * @returns {CollectionEventReceived} Type of event to apply to products collection
   */
  public emitProductsEvent (): any {
    const database = this.firebaseApp;
    const ref = database.ref(`${parameters.firebase.pathTasks}/products`);

    new Queue(ref, (data, progress, resolve, reject) => {
      const message = new CollectionEventReceived(data);
      appEventEmitter.emit('FirebaseMessage', message);
      resolve();
    });
  }

  /**
   * Emit an event for payment method collection
   * @returns {CollectionEventReceived} Type of event to apply to payment method collection
   */
  public emitPaymentsEvent (): any {
    const database = this.firebaseApp;
    const ref = database.ref(`${parameters.firebase.pathTasks}/payments`);

    new Queue(ref, (data, progress, resolve, reject) => {
      const message = new CollectionEventReceived(data);
      appEventEmitter.emit('FirebaseMessage', message);
      resolve();
    });
  }

  /**
   * Emit an event for stations collection
   * @returns {CollectionEventReceived} Type of event to apply to stations collection
   */
  public emitStationsEvent (): any {
    const database = this.firebaseApp;
    const ref = database.ref(`${parameters.firebase.pathTasks}/stations/${parameters.app.stationId}`);

    new Queue(ref, (data, progress, resolve, reject) => {
      const message = new CollectionEventReceived(data);
      appEventEmitter.emit('FirebaseMessage', message);
      resolve();
    });
  }

}

const firebaseEmitter = new FirebaseEmitter();

export { firebaseEmitter };