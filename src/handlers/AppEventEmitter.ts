import { EventEmitter } from 'events';

class AppEventEmitter extends EventEmitter {}

const appEventEmitter = new AppEventEmitter();

export { appEventEmitter };