'use strict'

import { Request, Response, NextFunction } from "express";
import { IClient } from "../../Api.Domain/Models/IClient"
import { IRepository } from "../../Api.Repository/Repositories/IRepository"
import { resolveRepositories } from "../Config/Container";
import { ResponseDto } from "../Models/Response";

class ClientMiddleware {

  private readonly _clientRepository: IRepository<IClient>;

  constructor (clientRepository: IRepository<IClient>) {
    this._clientRepository = clientRepository;
  }

  public existsById = async (request: Request, response: Response, next: NextFunction): Promise<any> => {
    const { body: { clientId } } = request;

    if (!clientId) return ResponseDto.badRequest(false, response, 'InvalidClientId');

    const user = await this._clientRepository.getByIdAsync(clientId, {});

    if (!user) return ResponseDto.notFound(false, response, 'ClientNotFound');

    next();
  }

}

const clientMiddleware = new ClientMiddleware(resolveRepositories().clientRepository);

export { clientMiddleware };