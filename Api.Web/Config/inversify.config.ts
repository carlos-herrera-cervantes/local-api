'use strict';

import 'reflect-metadata';
import { Container } from 'inversify';
import IDENTIFIERS from '../Constants/Identifiers';
import { IRepository } from '../../Api.Repository/Repositories/IRepository';
import { IUser } from '../../Api.Domain/Models/IUser';
import { UserRepository } from '../../Api.Repository/Repositories/UserRepository';

let container = new Container();

container.bind<IRepository<IUser>>(IDENTIFIERS.IUserRepository).to(UserRepository);

export default container;