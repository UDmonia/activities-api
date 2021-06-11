import Utils from './utils';
import { ObjectId } from '../src/core/entity';
import Activities from '../src/activities';

beforeAll(Utils.beforeAll);
afterAll(Utils.afterAll);

const userId = new ObjectId();

test('Add Like to Coach', async () => {
    try {
        const resp = await Activities.addLike({
            likeType: Activities.LikeType.Coach,
            userId: userId,
            name: "Aurora"
        });
        expect(resp).not.toBeNull();

        const userLikes = await Activities.findUserLikes(userId);
        
        expect(
            userLikes.find(e => e._id.equals(resp.like._id) && e.userId.equals(userId))
        ).toBeDefined();

    } catch (err) {
        console.log(err);
        expect(true).toBeFalsy();
    }
});

test('Add Like to Activity', async () => {
    try {
        const resp = await Activities.addLike({
            likeType: Activities.LikeType.Activity,
            userId: userId,
            name: "Funny Game"
        });
        expect(resp).not.toBeNull();

        const userLikes = await Activities.findUserLikes(userId);

        expect(
            userLikes.find(e => e._id.equals(resp.like._id) && e.userId.equals(userId))
        ).toBeDefined();

    } catch (err) {
        console.log(err);
        expect(true).toBeFalsy();
    }
});

test('Remove Like from Activity', async () => {
    const gameName = "New Game";
    try {
        const resp = await Activities.addLike({
            likeType: Activities.LikeType.Activity,
            userId: userId,
            name: gameName
        });
        expect(resp).not.toBeNull();

        await Activities.removeLike({
            likeId: resp.like._id,
            userId: userId
        });

        const userLikes = await Activities.findUserLikes(userId);

        expect(
            userLikes.find(e => e._id.equals(resp.like._id))
        ).toBeUndefined();

    } catch (err) {
        console.log(err);
        expect(true).toBeFalsy();
    }
});
