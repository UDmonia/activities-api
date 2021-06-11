import Config from '../src/config';
import { connect, disconnect } from '../src/db';

let db: any;

const beforeAll = async (/*done: jest.DoneCallback*/) => {
    db = await connect(Config.db);
    for (const name of ['events', 'likes']) {
        //try { await db.connection.db.dropCollection(name); }
        try { await db.connection.db.collection(name).deleteMany({}); }
        catch (err) { }
    }
    //done();
    return;
}

const afterAll = async (/*done: jest.DoneCallback*/) => {
    await disconnect();
    //done();
    return;
}

export default {
    beforeAll, afterAll
}