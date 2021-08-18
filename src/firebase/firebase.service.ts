import * as admin from 'firebase-admin';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskCreatedEvent } from './events/task-created.event';

const Queue = require('firebase-queue');

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly database: admin.database.Database;
  private readonly logger: Logger = new Logger(FirebaseService.name);

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2
  ) {
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

    this.database = admin.apps[0].database();
  }

  onModuleInit() {
    this.emitUsersEvent();
    this.emitProductsEvent();
    this.emitPaymentsEvent();
    this.emitStationsEvent();
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
    node: any
  ): Promise<void> {
    const resultSet = await this.database.ref(path).set(node);
    this.logger.log({
      datetime: new Date(),
      appId: '',
      event: 'insert_node_firebase',
      level: 'INFO',
      description: resultSet
    });
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
    const ref = `${this.configService.get<string>('PATH_TASKS')}/products/tasks`;
    this.emitBaseEventFirebase(ref);
  }

  /**
   * Emit an event for payment method collection
   * @returns {TaskCreatedEvent} Type of event to apply to payment method collection
   */
   private emitPaymentsEvent (): any {
    const ref = `${this.configService.get<string>('PATH_TASKS')}/payments/tasks`;
    this.emitBaseEventFirebase(ref);
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
    const ref = this.database.ref(path);

    new Queue(ref, (data: any, progress: any, resolve: any, reject: any) => {
      const message = new TaskCreatedEvent(data);
      this.eventEmitter.emit('task.created', message);
      resolve();
    });
  }

  /**
   * Emit an event to specific path
   * @param path String path
   * @returns Event emitted
   */
  private emitBaseEventFirebase(path: string): void {
    this.database.ref(path).orderByChild('Model/createdAt').on('child_added', snapshot => {
      const obj = snapshot.val();
      const message = new TaskCreatedEvent(obj);
      this.eventEmitter.emit('task.created', message);
    });
  }

}