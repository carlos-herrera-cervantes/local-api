'use strict';

import { StatusCodes } from '../Constants/StatusCodes';
import { Response } from 'express';
import { StringExtensions } from '../Extensions/StringExtensions';
import { Paginate } from './Paginate';

class ResponseDto {

    public static ok = (status: boolean, data: any, response: Response, query: any = {}, totalDocuments?: number): any => {
        const { paginate } = query;
        
        if (StringExtensions.toBoolean(paginate)) {
            const paginate = Paginate.getPaginateObject(query, totalDocuments);
            return response.status(StatusCodes.Ok).send({ status, data, paginate });
        }

        return response.status(StatusCodes.Ok).send({ status, data });
    }

    public static created = (status: boolean, data: any, response: Response): any => response.status(StatusCodes.Created).send({ status, data });

    public static noContent = (status: boolean, response: Response): any => response.status(StatusCodes.NoContent).send({ status, data: {} });

    public static badRequest = (status: boolean, response: Response, key: string): any => response.status(StatusCodes.BadRequest).send({ status, message: response.__(key) });

    public static notFound = (status: boolean, response: Response, key: string): any => response.status(StatusCodes.NotFound).send({ status, message: response.__(key) });

    public static unauthorize = (status: boolean, response: Response, key: string): any => response.status(StatusCodes.Unauthorize).send({ status, message: response.__(key) });

    public static internalServerError = (status: boolean, response: Response, message: string): any => response.status(StatusCodes.IntervalServerError).send({ status, message: response.__(message) });

}

export { ResponseDto };