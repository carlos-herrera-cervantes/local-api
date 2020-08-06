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

class Configure {

    private container: Container;

    constructor () {
        this.bindRepositories();
    }

    public mapRepositories (): Array<any> {
        const controllers = [];
        const reporitories = this.resolveRepositories();

        const userController = new UserController(reporitories.userRepository);
        const positionController = new PositionController(reporitories.positionRepository);
        const shiftControllers = new ShiftController(reporitories.shiftRepository);
        const collectController = new CollectController(reporitories.collectRepository);

        controllers.push(
            userController,
            positionController,
            shiftControllers,
            collectController
        );
        
        return controllers;
    }

    public resolveRepositories (): any {
        return {
            userRepository: this.container.get<IRepository<IUser>>(IDENTIFIERS.IUserRepository),
            positionRepository: this.container.get<IRepository<IPosition>>(IDENTIFIERS.IPositionRepository),
            shiftRepository: this.container.get<IRepository<IShift>>(IDENTIFIERS.IShiftRepository),
            clientRepository: this.container.get<IRepository<IClient>>(IDENTIFIERS.IClientRepository),
            collectRepository: this.container.get<IRepository<ICollectMoney>>(IDENTIFIERS.ICollectRepository)
        };
    }

    private bindRepositories (): void {
        this.container = new Container();
        this.container.bind<IRepository<IUser>>(IDENTIFIERS.IUserRepository).to(UserRepository);
        this.container.bind<IRepository<IPosition>>(IDENTIFIERS.IPositionRepository).to(PositionRepository);
        this.container.bind<IRepository<IShift>>(IDENTIFIERS.IShiftRepository).to(ShiftRepository);
        this.container.bind<IRepository<IClient>>(IDENTIFIERS.IClientRepository).to(ClientRepository);
        this.container.bind<IRepository<ICollectMoney>>(IDENTIFIERS.ICollectRepository).to(CollectRepository);
    }

}

const configure = new Configure();

export { configure };