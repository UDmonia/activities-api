import { ID, ObjectId } from '../core/entity';
import { Event, EventType, NewCheckInEvent, NewActivityEvent } from './event';
import { Like, LikeType, NewLike } from './like';
import { EventRepository, LikeRepository } from './repository';

const eventRepository = new EventRepository();
const likeRepository = new LikeRepository();

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

export default {
    EventType,
    LikeType,
    addEvent,
    addLike,
    removeLike,
    findUserEvents,
    findUserLikes,
};