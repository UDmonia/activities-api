import { ObjectId } from '../src/core/entity';
import Activities from '../src/activities';

export default () => {

const userId = new ObjectId();

test('Add CheckIn Event', async () => {
    
    try {
        const resp = await Activities.addEvent({
            eventType: Activities.EventType.CheckIn,
            userId: userId,
            mood: "happy"
        });
        expect(resp).not.toBeNull();

        const userEvents = await Activities.findUserEvents(userId);
        
        expect(
            userEvents.find(e => e._id.equals(resp.event._id) && e.userId.equals(userId))
        ).toBeDefined();

    } catch (err) {
        console.log(err);
        expect(true).toBeFalsy();
    }
});

test('Add ActivityStart Event', async () => {
    try {
        const resp = await Activities.addEvent({
            eventType: Activities.EventType.ActivityStart,
            userId: userId,
            activityName: "Funny Game"
        });
        expect(resp).not.toBeNull();

        const userEvents = await Activities.findUserEvents(userId);
        
        expect(
            userEvents.find(e => e._id.equals(resp.event._id) && e.userId.equals(userId))
        ).toBeDefined();

    } catch (err) {
        console.log(err);
        expect(true).toBeFalsy();
    }
});

test('Add ActivityEnd Event', async () => {
    try {
        const resp = await Activities.addEvent({
            eventType: Activities.EventType.ActivityEnd,
            userId: userId,
            activityName: "Funny Game",
            score: 8.0
        });
        expect(resp).not.toBeNull();

        const userEvents = await Activities.findUserEvents(userId);
        
        expect(
            userEvents.find(e => e._id.equals(resp.event._id) && e.userId.equals(userId))
        ).toBeDefined();
                
    } catch (err) {
        console.log(err);
        expect(true).toBeFalsy();
    }
});

}