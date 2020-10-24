'use strict';

import { Server } from '@overnightjs/core';
import express from 'express';
import { connect, connection } from 'mongoose';
import { configure } from './Config/Configure';
import { serve, setup } from 'swagger-ui-express';
import { swaggerDocument } from './Config/SwaggerConfig';
import { firebaseConsumer } from './Backgrounds/FirebaseConsumer';
import { firebaseEmitter } from './Handlers/FirebaseEmitter';
import { appEventEmitter } from './Handlers/AppEventEmitter';
import * as parameters from '../parameters.json';

class Startup extends Server {

  constructor() {
    super();
    this.app.use(express.json());
    this.setupDatabase();
    this.setupListeners();
    this.setupEmitters();
    this.setupSwagger();
    super.addControllers(configure.mapRepositories());
  }

  /**
   * Starts the server
   * @returns {Void}
   */
  public listen = (): any =>
    this.app.listen(parameters.app.port, () => console.info(`Server running at port: ${parameters.app.port}`));

  /**
   * Connect with MongoDB server
   * @returns {Void}
   */
  private setupDatabase(): void {
    const URI = `mongodb://${parameters.db.host}/${parameters.db.database}`;
    connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    connection.on('error', console.error.bind(console, 'MongoDB connection error'));
  }

  /**
   * Setup the documentation for endpoints
   * @returns {Void}
   */
  private setupSwagger = (): any => this.app.use('/api-docs', serve, setup(swaggerDocument));

  /**
   * Setup the subscribers to listen the Firebase events
   * @returns {Void}
   */
  private setupListeners = (): any =>
    appEventEmitter.on('FirebaseMessage', firebaseConsumer.executeTaskAsync());

  /**
   * Setup the emitters for Firebase
   * @returns {Void}
   */
  private setupEmitters = (): any => {
    firebaseEmitter.emitUsersEvent();
    firebaseEmitter.emitProductsEvent();
    firebaseEmitter.emitPaymentsEvent();
    firebaseEmitter.emitStationsEvent();
  }

}

export { Startup };