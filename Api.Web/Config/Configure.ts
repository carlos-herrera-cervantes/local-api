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

        controllers.push(userController, positionController);
        return controllers;
    }

    public resolveRepositories (): any {
        return {
            userRepository: this.container.get<IRepository<IUser>>(IDENTIFIERS.IUserRepository),
            positionRepository: this.container.get<IRepository<IPosition>>(IDENTIFIERS.IPositionRepository),
        };
    }

    private bindRepositories (): void {
        this.container = new Container();
        this.container.bind<IRepository<IUser>>(IDENTIFIERS.IUserRepository).to(UserRepository);
        this.container.bind<IRepository<IPosition>>(IDENTIFIERS.IPositionRepository).to(PositionRepository);
    }

}

const configure = new Configure();

export { configure };