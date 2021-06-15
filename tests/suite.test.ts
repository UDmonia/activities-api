import Utils from './utils';
import EventsSummary from './eventsSummary';
import Events from './events';
import Likes from './likes';


beforeAll(Utils.beforeAll);
afterAll(Utils.afterAll);

describe('Events Summary', () => {
    EventsSummary();
});

describe('Events', () => {
    Events();
});

describe('Likes', () => {
    Likes();
});
