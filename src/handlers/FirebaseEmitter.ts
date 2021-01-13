const Queue = require('firebase-queue');
import { CollectionEventReceived } from '../models/CollectionEventReceived';
import { appEventEmitter } from './AppEventEmitter';
import { FirebaseService } from '../services/FirebaseService';
import * as parameters from '../../parameters.json';

export class FirebaseEmitter {

  constructor(private readonly firebaseService: FirebaseService) { }

  /**
   * Emits an event for users collection
   * @returns {CollectionEventReceived} Type of event to apply to users collection
   */
  public emitUsersEvent (): any {
    const ref = `${parameters.firebase.pathTasks}/stations/${parameters.app.stationId}/users`;
    return this.emitBaseEvent(ref);
  }

  /**
   * Emits an event for products collection
   * @returns {CollectionEventReceived} Type of event to apply to products collection
   */
  public emitProductsEvent (): any {
    const ref = `${parameters.firebase.pathTasks}/products`;
    return this.emitBaseEvent(ref);
  }

  /**
   * Emit an event for payment method collection
   * @returns {CollectionEventReceived} Type of event to apply to payment method collection
   */
  public emitPaymentsEvent (): any {
    const ref = `${parameters.firebase.pathTasks}/payments`;
    return this.emitBaseEvent(ref);
  }

  /**
   * Emit an event for stations collection
   * @returns {CollectionEventReceived} Type of event to apply to stations collection
   */
  public emitStationsEvent (): any {
    const ref = `${parameters.firebase.pathTasks}/stations/${parameters.app.stationId}`;
    return this.emitBaseEvent(ref);
  }

  /**
   * Emit an event to specific path
   * @param path String path
   * @returns Event emitted
   */
  private emitBaseEvent(path: string): any {
    const database = this.firebaseService.initializeFirebaseApp();
    const ref = database.ref(path);

    new Queue(ref, (data: any, progress: any, resolve: any, reject: any) => {
      const message = new CollectionEventReceived(data);
      appEventEmitter.emit('FirebaseMessage', message);
      resolve();
    });
  }

}