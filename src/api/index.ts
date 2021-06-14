import Express, { RequestHandler, Request, Response } from 'express';
import Config from '../config';
import cors from 'cors';

import { ActivitiesService, verifyToken } from './activitiesService';

const activitiesService = new ActivitiesService();

function routes () {
    const endpoints = Express.Router();

    endpoints.post('/events', activitiesService.addEvent);
    endpoints.get('/events', activitiesService.userEvents);

    endpoints.get('/events/daily', activitiesService.dailyEvents);
    endpoints.get('/events/monthly', activitiesService.monthlyEvents);

    endpoints.post('/likes', activitiesService.addLike);
    endpoints.get('/likes', activitiesService.userLikes);
    endpoints.delete('/likes', activitiesService.removeLike);

    return endpoints;
}


const getAccessToken: RequestHandler = async (req, res, next) => {
    const accessToken = req?.headers?.authorization || req?.headers['x-access-token'];
    try {
        if (accessToken) {
            const ctx = req as any;
            ctx.token = await verifyToken(accessToken as string);
        }
    } catch (error) { 
        /* ignore invalid tokens */
    }
    next();
};

function healthCheck (req: Request, resp: Response) {
    resp.status(200).send({
        ok: true,
        error: null
    });
}

export async function startServer() {

    const express = Express();
    express.use(Express.json());
    express.use(cors());

    express.use(getAccessToken);
    express.use('/health', healthCheck);
    express.use(Config.api.baseUri, routes());

    const server = express.listen(Config.server.port, Config.server.host);

    return server;
}