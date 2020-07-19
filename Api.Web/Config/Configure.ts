'use strict';
'use strict';

import container from './inversify.config';
import IDENTIFIERS from '../Constants/Identifiers';
import { IRepository } from '../../Api.Repository/Repositories/IRepository';
import { IUser } from '../../Api.Domain/Models/IUser';
import { UserController } from '../Controllers/UserController';

class Configure {

    public configureServices (): Array<any> {
        const controllers = [];

        const userRepository = container.get<IRepository<IUser>>(IDENTIFIERS.IUserRepository);

        const userController = new UserController(userRepository);

        controllers.push(userController);
        return controllers;
    }

}

const configure = new Configure();

export { configure };