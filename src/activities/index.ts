import _ from 'lodash';
import { ID, ObjectId } from '../core/entity';
import { Event, EventType as _EventType, NewCheckInEvent, NewActivityEvent } from './event';
import { Like, LikeType, NewLike } from './like';
import { EventRepository, LikeRepository } from './repository';

const eventRepository = new EventRepository();
const likeRepository = new LikeRepository();

export type EventType = _EventType;

export type AddEventRequest = NewCheckInEvent | NewActivityEvent;

export interface AddEventResponse {
    event: Event
}

export interface AddLikeRequest extends NewLike {
}

export interface AddLikeResponse {
    like: Like
}

export interface RemoveLikeRequest {
    likeId: ID,
    userId: ID
}

const DayOfWeek: Record<number, string> = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat'
};

async function addEvent (request: AddEventRequest): Promise<AddEventResponse> {
    const event = new Event(request);
    await eventRepository.save(event);
    return { event };
}

async function addLike (request: AddLikeRequest): Promise<AddLikeResponse> {
    const like = new Like(request);
    await likeRepository.save(like);
    return { like };
}

async function removeLike (request: RemoveLikeRequest): Promise<void> {
    await likeRepository.deleteOne({ _id: request.likeId, userId: request.userId });
    return;
}

async function findUserEvents (userId: ObjectId): Promise<Event[]> {
    const events = await eventRepository.findByUser(userId);
    return events;
}

async function findUserLikes (userId: ObjectId): Promise<Like[]> {
    const likes = await likeRepository.findByUser(userId);
    return likes;
}

async function findDailyEvents (userId: ObjectId, eventType: EventType, date: Date): Promise<Event[]> {
    const dayMillis = 86400000;
    const endDate = new Date(date.getTime() + dayMillis);
    const events = await eventRepository.findByEventType(userId, eventType, date, endDate);

    return events;
}

async function findMonthlyEvents (userId: ObjectId, eventType: EventType, date: Date): Promise<Record<string, Event[]>> {
    //const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const startDate = new Date(date.getTime())
    startDate.setDate(1);

    const endDate = new Date(startDate.getTime());
    // endDate will filter as < endDate (lt)
    endDate.setMonth( endDate.getMonth()+1 );
    const events = await eventRepository.findByEventType(userId, eventType, startDate, endDate);

    const dayOfMonthKey = (event: Event) =>
        `${event.timestamp.getDate()} ${DayOfWeek[event.timestamp.getDay()]}`;
    return _.groupBy(events, dayOfMonthKey);
}

export default {
    EventType: _EventType,
    LikeType,
    addEvent,
    addLike,
    removeLike,
    findUserEvents,
    findUserLikes,
    findDailyEvents,
    findMonthlyEvents
};