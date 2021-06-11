import { ObjectId } from 'mongodb';
import Mongoose, { isValidObjectId } from 'mongoose';

export { ObjectId, isValidObjectId };

export type ID = ObjectId;
export const ObjectIdType = Mongoose.Schema.Types.ObjectId;

export interface Entity {
    _id?: ID;

}
