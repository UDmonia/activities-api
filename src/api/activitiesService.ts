import { Request, Response } from 'express';
import Config from '../config';
import Service from '../core/service';
import Activities from '../activities';
import { ObjectId } from 'bson';
import jwt, { VerifyErrors } from 'jsonwebtoken';


export interface Token {
    userId: string
}

export function verifyToken (accessToken: string): Promise<Token> {
    return new Promise((resolve, reject) => {
        const cb = (err: VerifyErrors | null, decoded: object | undefined): void => {
            if (err || !decoded) reject(err);
            else {
                const payload = decoded as any;
                resolve(payload as Token);
            }
        };

        jwt.verify(accessToken, Config.jwt.secret, cb);
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getToken (req: Request): Token | null {
    if ('token' in req) { 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (req as any).token; 
    }
    return null;
}

function getUserId (req: Request): ObjectId | null {
    if ('token' in req) {
        const token = (req as any).token as Token;
        if (token?.userId) return new ObjectId(token.userId);
    }
    return null;
}

export class ActivitiesService extends Service {

    async addEvent (req: Request, resp: Response): Promise<void> {
        const userId = getUserId(req);
        if (!userId) return super.responseUnauthorizedError(resp);

        try {
            const result = await Activities.addEvent({
                ...req.body,
                userId
            });
            super.responseOk(resp, result);
        } catch (error) {
            super.responseInputError(resp, error);
        }
    }

    async addLike (req: Request, resp: Response): Promise<void> {
        const userId = getUserId(req);
        if (!userId) return super.responseUnauthorizedError(resp);

        try {
            const result = await Activities.addLike({
                ...req.body,
                userId
            });
            super.responseOk(resp, result);
        } catch (error) {
            super.responseInputError(resp, error);
        }
    }

    async removeLike (req: Request, resp: Response): Promise<void> {
        const userId = getUserId(req);
        if (!userId) return super.responseUnauthorizedError(resp);

        try {
            const result = await Activities.removeLike({
                ...req.body,
                userId
            });
            super.responseOk(resp, result);
        } catch (error) {
            super.responseInputError(resp, error);
        }
    }

    async userEvents (req: Request, resp: Response): Promise<void> {
        const userId: unknown = getUserId(req);
        if (!userId) return super.responseUnauthorizedError(resp);

        const result = await Activities.findUserEvents(userId as ObjectId);
        super.responseOk(resp, result);
    }

    async userLikes (req: Request, resp: Response): Promise<void> {
        const userId: unknown = getUserId(req);
        if (!userId) return super.responseUnauthorizedError(resp);

        const result = await Activities.findUserLikes(userId as ObjectId);
        super.responseOk(resp, result);
    }
}