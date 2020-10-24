'use strict';

import 'reflect-metadata';
import * as admin from 'firebase-admin';
import * as parameters from '../../parameters.json';
import R from 'ramda';
import { Container } from 'inversify';
import IDENTIFIERS from '../Constants/Identifiers';
import { IRepository } from '../../Api.Repository/Repositories/IRepository';

import { IUser } from '../../Api.Domain/Models/IUser';
import { UserRepository } from '../../Api.Repository/Repositories/UserRepository';

import { IPosition } from '../../Api.Domain/Models/IPosition';
import { PositionRepository } from '../../Api.Repository/Repositories/PositionRepository';

import { IShift } from '../../Api.Domain/Models/IShift';
import { ShiftRepository } from '../../Api.Repository/Repositories/ShiftRepository';

import { IClient } from '../../Api.Domain/Models/IClient';
import { ClientRepository } from '../../Api.Repository/Repositories/ClientRepository';

import { ICollectMoney } from '../../Api.Domain/Models/ICollectMoney'
import { CollectRepository } from '../../Api.Repository/Repositories/CollectRepository';

import { ITax } from '../../Api.Domain/Models/ITax';
import { TaxRepository } from '../../Api.Repository/Repositories/TaxRepository';

import { IMeasurementUnit } from '../../Api.Domain/Models/IMeasurementUnit';
import { MeasurementUnitRepository } from '../../Api.Repository/Repositories/MeasurementUnitRepository';

import { IPaymentTransaction } from '../../Api.Domain/Models/IPaymentTransaction';
import { PaymentTransactionRepository } from '../../Api.Repository/Repositories/PaymentTransactionRepository';

import { IShopping } from '../../Api.Domain/Models/IShopping';
import { ShoppingRepository } from '../../Api.Repository/Repositories/ShoppingRepository';

import { IToken } from '../../Api.Domain/Models/IToken';
import { TokenRepository } from '../../Api.Repository/Repositories/TokenRepository';

import { IProduct } from '../../Api.Domain/Models/IProduct';
import { ProductRepository } from '../../Api.Repository/Repositories/ProductRepository';

import { IPaymentMethod } from '../../Api.Domain/Models/IPaymentMethod';
import { PaymentMethodRepository } from '../../Api.Repository/Repositories/PaymentMethodRepository';

import { IStation } from '../../Api.Domain/Models/IStation';
import { StationRepository } from '../../Api.Repository/Repositories/StationRepository';

let container = new Container();

container.bind<IRepository<IUser>>(IDENTIFIERS.IUserRepository).to(UserRepository);
container.bind<IRepository<IPosition>>(IDENTIFIERS.IPositionRepository).to(PositionRepository);
container.bind<IRepository<IShift>>(IDENTIFIERS.IShiftRepository).to(ShiftRepository);
container.bind<IRepository<IClient>>(IDENTIFIERS.IClientRepository).to(ClientRepository);
container.bind<IRepository<ICollectMoney>>(IDENTIFIERS.ICollectRepository).to(CollectRepository);
container.bind<IRepository<ITax>>(IDENTIFIERS.ITaxRepository).to(TaxRepository);
container.bind<IRepository<IMeasurementUnit>>(IDENTIFIERS.IMeasurementUnitRepository).to(MeasurementUnitRepository);
container.bind<IRepository<IPaymentTransaction>>(IDENTIFIERS.IPaymentTransactionRepository).to(PaymentTransactionRepository);
container.bind<IRepository<IShopping>>(IDENTIFIERS.IShoppingRepository).to(ShoppingRepository);
container.bind<IRepository<IToken>>(IDENTIFIERS.ITokenRepository).to(TokenRepository);
container.bind<IRepository<IProduct>>(IDENTIFIERS.IProductRepository).to(ProductRepository);
container.bind<IRepository<IPaymentMethod>>(IDENTIFIERS.IPaymentMethodRepository).to(PaymentMethodRepository);
container.bind<IRepository<IStation>>(IDENTIFIERS.IStationRepository).to(StationRepository);

const resolveRepositories = () => (
  {
    userRepository: container.get<IRepository<IUser>>(IDENTIFIERS.IUserRepository),
    positionRepository: container.get<IRepository<IPosition>>(IDENTIFIERS.IPositionRepository),
    shiftRepository: container.get<IRepository<IShift>>(IDENTIFIERS.IShiftRepository),
    clientRepository: container.get<IRepository<IClient>>(IDENTIFIERS.IClientRepository),
    collectRepository: container.get<IRepository<ICollectMoney>>(IDENTIFIERS.ICollectRepository),
    taxRepository: container.get<IRepository<ITax>>(IDENTIFIERS.ITaxRepository),
    measurementUnitRepository: container.get<IRepository<IMeasurementUnit>>(IDENTIFIERS.IMeasurementUnitRepository),
    paymentTransactionRepository: container.get<IRepository<IPaymentTransaction>>(IDENTIFIERS.IPaymentTransactionRepository),
    shoppingRepository: container.get<IRepository<IShopping>>(IDENTIFIERS.IShoppingRepository),
    tokenRepository: container.get<IRepository<IToken>>(IDENTIFIERS.ITokenRepository),
    productRepository: container.get<IRepository<IProduct>>(IDENTIFIERS.IProductRepository),
    paymentMethodRepository: container.get<IRepository<IPaymentMethod>>(IDENTIFIERS.IPaymentMethodRepository),
    stationRepository: container.get<IRepository<IStation>>(IDENTIFIERS.IStationRepository)
  }
);

const initializeFirebaseApp = () => {
  const emptyApps = R.not(admin.apps.length);

  if (emptyApps) {
    admin.initializeApp(
      {
        credential: admin.credential.cert({
          projectId: parameters.firebase.credentials.project_id,
          privateKey: parameters.firebase.credentials.private_key,
          clientEmail: parameters.firebase.credentials.client_email
        }),
        databaseURL: parameters.firebase.databaseURL
      }, 
      'Synchronizer'
    )
  }

  const database = admin.apps.pop().database();
  return database;
}

export { resolveRepositories, initializeFirebaseApp };