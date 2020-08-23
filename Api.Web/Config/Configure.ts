'use strict';

import 'reflect-metadata';
import { Container } from 'inversify';
import IDENTIFIERS from '../Constants/Identifiers';
import { IRepository } from '../../Api.Repository/Repositories/IRepository';

import { IUser } from '../../Api.Domain/Models/IUser';
import { UserRepository } from '../../Api.Repository/Repositories/UserRepository';
import { UserController } from '../Controllers/UserController';

import { IPosition } from '../../Api.Domain/Models/IPosition';
import { PositionRepository } from '../../Api.Repository/Repositories/PositionRepository';
import { PositionController } from '../Controllers/PositionController';

import { IShift } from '../../Api.Domain/Models/IShift';
import { ShiftRepository } from '../../Api.Repository/Repositories/ShiftRepository';
import { ShiftController } from '../Controllers/ShiftController';

import { IClient } from '../../Api.Domain/Models/IClient';
import { ClientRepository } from '../../Api.Repository/Repositories/ClientRepository';

import { ICollectMoney } from '../../Api.Domain/Models/ICollectMoney'
import { CollectRepository } from '../../Api.Repository/Repositories/CollectRepository';
import { CollectController } from '../Controllers/CollectController';

import { ITax } from '../../Api.Domain/Models/ITax';
import { TaxRepository } from '../../Api.Repository/Repositories/TaxRepository';
import { TaxController } from '../Controllers/TaxController';

import { IMeasurementUnit } from '../../Api.Domain/Models/IMeasurementUnit';
import { MeasurementUnitRepository } from '../../Api.Repository/Repositories/MeasurementUnitRepository';
import { MeasurementUnitController } from '../Controllers/MeasurementUnitController';

import { IPaymentTransaction } from '../../Api.Domain/Models/IPaymentTransaction';
import { PaymentTransactionRepository } from '../../Api.Repository/Repositories/PaymentTransactionRepository';

import { IShopping } from '../../Api.Domain/Models/IShopping';
import { ShoppingRepository } from '../../Api.Repository/Repositories/ShoppingRepository';
import { ShoppingController } from '../Controllers/ShoppingController';

import { IToken } from '../../Api.Domain/Models/IToken';
import { TokenRepository } from '../../Api.Repository/Repositories/TokenRepository';

class Configure {

    private container: Container;

    constructor () {
        this.bindRepositories();
    }

    public mapRepositories (): Array<any> {
        const controllers = [];
        const repositories = this.resolveRepositories();

        const userController = new UserController(repositories.userRepository);
        const positionController = new PositionController(repositories.positionRepository);
        const shiftControllers = new ShiftController(repositories.shiftRepository);
        const collectController = new CollectController(repositories.collectRepository);
        const taxController = new TaxController(repositories.taxRepository);
        const measurementUnitController = new MeasurementUnitController(repositories.measurementUnitRepository);
        const shoppingController = new ShoppingController(repositories.shoppingRepository);

        controllers.push(
            userController,
            positionController,
            shiftControllers,
            collectController,
            taxController,
            measurementUnitController,
            shoppingController
        );
        
        return controllers;
    }

    public resolveRepositories (): any {
        return {
            userRepository: this.container.get<IRepository<IUser>>(IDENTIFIERS.IUserRepository),
            positionRepository: this.container.get<IRepository<IPosition>>(IDENTIFIERS.IPositionRepository),
            shiftRepository: this.container.get<IRepository<IShift>>(IDENTIFIERS.IShiftRepository),
            clientRepository: this.container.get<IRepository<IClient>>(IDENTIFIERS.IClientRepository),
            collectRepository: this.container.get<IRepository<ICollectMoney>>(IDENTIFIERS.ICollectRepository),
            taxRepository: this.container.get<IRepository<ITax>>(IDENTIFIERS.ITaxRepository),
            measurementUnitRepository: this.container.get<IRepository<IMeasurementUnit>>(IDENTIFIERS.IMeasurementUnitRepository),
            paymentTransactionRepository: this.container.get<IRepository<IPaymentTransaction>>(IDENTIFIERS.IPaymentTransactionRepository),
            shoppingRepository: this.container.get<IRepository<IShopping>>(IDENTIFIERS.IShoppingRepository),
            tokenRepository: this.container.get<IRepository<IToken>>(IDENTIFIERS.ITokenRepository)
        };
    }

    private bindRepositories (): void {
        this.container = new Container();
        this.container.bind<IRepository<IUser>>(IDENTIFIERS.IUserRepository).to(UserRepository);
        this.container.bind<IRepository<IPosition>>(IDENTIFIERS.IPositionRepository).to(PositionRepository);
        this.container.bind<IRepository<IShift>>(IDENTIFIERS.IShiftRepository).to(ShiftRepository);
        this.container.bind<IRepository<IClient>>(IDENTIFIERS.IClientRepository).to(ClientRepository);
        this.container.bind<IRepository<ICollectMoney>>(IDENTIFIERS.ICollectRepository).to(CollectRepository);
        this.container.bind<IRepository<ITax>>(IDENTIFIERS.ITaxRepository).to(TaxRepository);
        this.container.bind<IRepository<IMeasurementUnit>>(IDENTIFIERS.IMeasurementUnitRepository).to(MeasurementUnitRepository);
        this.container.bind<IRepository<IPaymentTransaction>>(IDENTIFIERS.IPaymentTransactionRepository).to(PaymentTransactionRepository);
        this.container.bind<IRepository<IShopping>>(IDENTIFIERS.IShoppingRepository).to(ShoppingRepository);
        this.container.bind<IRepository<IToken>>(IDENTIFIERS.ITokenRepository).to(TokenRepository);
    }

}

const configure = new Configure();

export { configure };