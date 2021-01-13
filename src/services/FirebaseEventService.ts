import { Injectable, Inject } from '@tsed/di';
import { FirebaseConsumer } from '../backgrounds/FirebaseConsumer';
import { appEventEmitter } from '../handlers/AppEventEmitter';
import { FirebaseEmitter } from '../handlers/FirebaseEmitter';
import { FirebaseService } from '../services/FirebaseService';

@Injectable()
export class FirebaseEventService {

  @Inject()
  firebaseConsumer: FirebaseConsumer;

  $onInit() {
    appEventEmitter.on('FirebaseMessage', this.firebaseConsumer.executeTaskAsync());

    const emitter = new FirebaseEmitter(new FirebaseService());

    emitter.emitUsersEvent();
    emitter.emitProductsEvent();
    emitter.emitPaymentsEvent();
    emitter.emitStationsEvent();
  }

}