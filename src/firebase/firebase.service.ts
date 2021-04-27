import * as admin from 'firebase-admin';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskCreatedEvent } from './events/task-created.event';

const Queue = require('firebase-queue');

@Injectable()
export class FirebaseService implements OnModuleInit {

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2
  ) {}

  onModuleInit() {
    this.emitUsersEvent();
    this.emitProductsEvent();
    this.emitPaymentsEvent();
    this.emitStationsEvent();
  }

  /**
   * Initializes a new Firebase client
   * @returns Firebase client
   */
  initializeApp(): admin.database.Database {
    const isEmptyApps = !admin.apps.length;

    if (isEmptyApps) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
          privateKey: this.configService.get<string>('FIREBASE_PRIVATE_KEY'),
          clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL')
        }),
        databaseURL: this.configService.get<string>('FIREBASE_HOST')
      }, 'Synchronizer');
    }

    return admin.apps.pop()?.database();
  }

  /**
   * Inserts a node into the provided path
   * @param {String} path
   * @param {Object} node Object
   * @param {admin.database.Database} database Firebase database
   * @returns If successful it returns true otherwise false
   */
  async tryInsertChildAsync(
    path: string,
    node: any,
    database: admin.database.Database
  ): Promise<boolean> {
    try {
      await database.ref(path).set(node);
      return true;
    }
    catch (err) {
      return false;
    }
  }

  /**
   * Emits an event for users collection
   * @returns {TaskCreatedEvent} Type of event to apply to users collection
   */
   private emitUsersEvent (): any {
     const paths = [
       this.configService.get<string>('PATH_TASKS'),
       'stations',
       this.configService.get<string>('STATION_ID'),
       'users'
     ];
    const ref = paths.join('/');
    return this.emitBaseEvent(ref);
  }

  /**
   * Emits an event for products collection
   * @returns {TaskCreatedEvent} Type of event to apply to products collection
   */
   private emitProductsEvent (): any {
    const ref = `${this.configService.get<string>('PATH_TASKS')}/products`;
    return this.emitBaseEvent(ref);
  }

  /**
   * Emit an event for payment method collection
   * @returns {TaskCreatedEvent} Type of event to apply to payment method collection
   */
   private emitPaymentsEvent (): any {
    const ref = `${this.configService.get<string>('PATH_TASKS')}/payments`;
    return this.emitBaseEvent(ref);
  }

  /**
   * Emit an event for stations collection
   * @returns {TaskCreatedEvent} Type of event to apply to stations collection
   */
   private emitStationsEvent (): void {
     const paths = [
       this.configService.get<string>('PATH_TASKS'),
       'stations',
       this.configService.get<string>('STATION_ID')
     ];
    const ref = paths.join('/');
    return this.emitBaseEvent(ref);
  }

  /**
   * Emit an event to specific path
   * @param path String path
   * @returns Event emitted
   */
  private emitBaseEvent(path: string): void {
    const database = this.initializeApp();
    const ref = database.ref(path);

    new Queue(ref, (data: any, progress: any, resolve: any, reject: any) => {
      const message = new TaskCreatedEvent(data);
      this.eventEmitter.emit('task.created', message);
      resolve();
    });
  }

}