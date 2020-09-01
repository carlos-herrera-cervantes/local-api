'use strict';

import { UserController } from '../Controllers/UserController';
import { PositionController } from '../Controllers/PositionController';
import { ShiftController } from '../Controllers/ShiftController';
import { CollectController } from '../Controllers/CollectController';
import { TaxController } from '../Controllers/TaxController';
import { MeasurementUnitController } from '../Controllers/MeasurementUnitController';
import { ShoppingController } from '../Controllers/ShoppingController';
import { LoginController } from '../Controllers/LoginController';
import { resolveRepositories } from '../Config/Container';

class Configure {

    constructor () {}

    public mapRepositories (): Array<any> {
        const controllers = [];
        const repositories = resolveRepositories();

        const userController = new UserController(repositories.userRepository);
        const positionController = new PositionController(repositories.positionRepository);
        const shiftControllers = new ShiftController(repositories.shiftRepository);
        const collectController = new CollectController(repositories.collectRepository);
        const taxController = new TaxController(repositories.taxRepository);
        const measurementUnitController = new MeasurementUnitController(repositories.measurementUnitRepository);
        const shoppingController = new ShoppingController(repositories.shoppingRepository);
        const loginController = new LoginController(repositories.userRepository, repositories.tokenRepository);

        controllers.push(
            userController,
            positionController,
            shiftControllers,
            collectController,
            taxController,
            measurementUnitController,
            shoppingController,
            loginController
        );
        
        return controllers;
    }

}

const configure = new Configure();

export { configure };