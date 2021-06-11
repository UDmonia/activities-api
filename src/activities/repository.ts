import { ID } from '../core/entity';
import { MongoRepository, CrudRepository } from '../core/repository';
import { Event } from './event';
import { Like } from './like';

export class EventRepository extends MongoRepository<Event> implements CrudRepository<Event> {
    constructor () {
        super(Event, { schemaOptions: { timestamps: true } });
    }

    async findByUser(userId: ID): Promise<Event[]> {
        const likes = await super.find({ filter: { userId } });
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
