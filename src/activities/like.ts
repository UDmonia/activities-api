import { prop } from '@typegoose/typegoose';
import { ID, Entity, ObjectId, ObjectIdType } from '../core/entity';

export enum LikeType {
    Activity = 'Activity',
    Coach = 'Coach'
}

export interface NewLike {
    userId: ID;
    likeType: LikeType;
    name: string;
}

export class Like implements Entity {
    @prop({ type: () => ObjectIdType })
    _id: ID;

    @prop({ type: () => ObjectIdType })
    userId: ID;

    @prop({ enum: LikeType })
    likeType: LikeType;

    @prop()
    name: string;

    constructor (args: NewLike) {
        this._id = new ObjectId();

        this.userId = args.userId;
        this.likeType = args.likeType;
        this.name = args.name;
    }
}