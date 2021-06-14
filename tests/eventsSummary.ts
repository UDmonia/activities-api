import { ObjectId } from '../src/core/entity';
import Activities from '../src/activities';


function addDays (date: Date, days: number): Date {
    const dayMillis = 86400000;
    return new Date(date.getTime() + (dayMillis * days));
}

function addHours (date: Date, hours: number): Date {
    const hourMillis = 3600000;
    return new Date(date.getTime() + (hourMillis * hours));
}

function truncateTime (date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default () => {

test('Daily CheckIn Summary', async ()=> {
    const userId = new ObjectId();
    const now = new Date();
    const today = truncateTime(now);
    const yesterday = addDays(today, -1);

    for (let hr = 0; hr < 24; hr += 4) {

        const resp = await Activities.addEvent({
            eventType: Activities.EventType.CheckIn,
            userId: userId,
            mood: "happy",
            timestamp: addHours(yesterday, hr)
        });
        expect(resp).not.toBeNull();

        const resp2 = await Activities.addEvent({
            eventType: Activities.EventType.CheckIn,
            userId: userId,
            mood: "happy",
            timestamp: addHours(today, hr)
        });
        expect(resp2).not.toBeNull();
    }

    const [yesterdayEvents, todayEvents] = await Promise.all([
        Activities.findDailyEvents(userId, Activities.EventType.CheckIn, yesterday),
        Activities.findDailyEvents(userId, Activities.EventType.CheckIn, today)
    ]);

    expect(yesterdayEvents).not.toBeNull();
    expect(todayEvents).not.toBeNull();

    expect(yesterdayEvents.length).toBe(24 / 4);
    expect(todayEvents.length).toBe(24 / 4);
});

test('Monthly CheckIn Summary', async ()=> {
    const userId = new ObjectId();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonth = addDays(today, -5);

    const resp = await Activities.addEvent({
        eventType: Activities.EventType.CheckIn,
        userId: userId,
        mood: "happy",
        timestamp: prevMonth
    });

    const resp2 = await Activities.addEvent({
        eventType: Activities.EventType.CheckIn,
        userId: userId,
        mood: "happy",
        timestamp: today
    });
    expect(resp2).not.toBeNull();

    const [prevMonthEvents, thisMonthEvents] = await Promise.all([
        Activities.findMonthlyEvents(userId, Activities.EventType.CheckIn, prevMonth),
        Activities.findMonthlyEvents(userId, Activities.EventType.CheckIn, today)
    ]);

    expect(prevMonthEvents).not.toBeNull();
    expect(thisMonthEvents).not.toBeNull();

    expect(prevMonthEvents[Object.keys(prevMonthEvents)[0]].length).toBe(1);
    expect(thisMonthEvents[Object.keys(thisMonthEvents)[0]].length).toBe(1);

});

}