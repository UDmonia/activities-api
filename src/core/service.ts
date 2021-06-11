import { Request, Response } from 'express';
import { Entity } from './entity';

export default class Service {
    constructor () {}

    responseOk (resp: Response, data: any) {
        resp.status(200).send({
            ok: true,
            error: null,
            data: data
        });
    }

    responseInputError (resp: Response, error?: Error) {
        resp.status(400).send({
            ok: false,
            error: (error && error.message) || 'User Input error',
            data: null
        });
    }

    responseNotFound (resp: Response, error?: Error) {
        resp.status(404).send({
            ok: false,
            error: (error && error.message) || 'Record not found',
            data: null
        });
    }

    responseUnauthorizedError (resp: Response, error?: Error) {
        resp.status(401).send({
            ok: false,
            error: (error && error.message) || 'Unauthorized error',
            data: null
        });
    }

    responseInternalError (resp: Response, error?: Error) {
        resp.status(500).send({
            ok: false,
            error: (error && error.message) || 'User Input error',
            data: null
        });
    }
}