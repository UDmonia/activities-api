import { index, prop } from '@typegoose/typegoose';
import { ID, Entity, ObjectId, ObjectIdType } from '../core/entity';

export enum EventType {
    CheckIn = 'CheckIn',
    ActivityStart = 'ActivityStart',
    ActivityEnd = 'ActivityEnd'
}

export interface NewEvent {
    eventType: EventType;
    userId: ID;
    timestamp?: Date;
}

export interface NewCheckInEvent extends NewEvent {
    mood: string;
}

export interface NewActivityEvent extends NewEvent {
    activityName: string;
    score?: number;
}

@index({ userId: 1 })
@index({ createdAt: 1 })
export class Event implements Entity {
    @prop({ type: () => ObjectIdType })
    _id: ID;

    @prop({ enum: EventType })
    eventType: EventType;

    @prop({ type: () => ObjectIdType })
    userId: ID;

    @prop()
    mood?: string;

    @prop()
    activityName?: string;

    @prop()
    score?: number;

    @prop({ type: () => Date })
    timestamp: Date;

    constructor (args: NewCheckInEvent | NewActivityEvent) {
        this._id = new ObjectId();
        this.eventType = args.eventType;
        this.userId = args.userId;
        this.timestamp = args.timestamp || new Date();

        if (this.eventType == EventType.CheckIn) {
            const checkIn = args as NewCheckInEvent;
            this.mood = checkIn.mood;
        }
        
        if (this.eventType === EventType.ActivityStart
            || this.eventType === EventType.ActivityEnd)
        {
            const activity = args as NewActivityEvent;
            this.activityName = activity.activityName;
            this.score = activity.score;
        }
    }

    

}