import Config from './config';
import { connect } from './db';
import { startServer } from './api';

/* eslint-disable dot-notation */
const getAccessToken = async (ctx: any) => {
    const token = ctx.req.headers['x-access-token'] || ctx.req.headers['authorization'];
    return { access_token: token };
};

console.log('Starting...');

(async () => {

    await connect(Config.db);
    console.log('MongoDB connected');

    await startServer();
    console.log(`Express Server: ${Config.server.host}:${Config.server.port}`);

})();
