import { ID } from '../core/entity';
import { MongoRepository, CrudRepository } from '../core/repository';
import { Event, EventType } from './event';
import { Like } from './like';

export class EventRepository extends MongoRepository<Event> implements CrudRepository<Event> {
    constructor () {
        super(Event, { schemaOptions: { timestamps: false } });
    }

    async findByUser(userId: ID): Promise<Event[]> {
        const likes = await super.find({ filter: { userId } });
        return likes;
    }

    async findByEventType(userId: ID, eventType: EventType, start?: Date, end?: Date): Promise<Event[]> {
        const filter: any = { userId, eventType };
        if (start) {
            filter['timestamp'] = { $gte: start };  
        }
        if (end) {
            filter['timestamp'] = filter['timestamp'] ? { ...filter['timestamp'], $lt: end } : { $lt: end };
        }

        const likes = await super.find({ filter, sort: { timestamp: 1 } });
        return likes;
    }
}

export class LikeRepository extends MongoRepository<Like> implements CrudRepository<Like> {
    constructor () {
        super(Like, { schemaOptions: { timestamps: true } });
    }

    async findByUser (userId: ID): Promise<Like[]> {
        const likes = await super.find({ filter: { userId } });
        return likes;
    }
}
