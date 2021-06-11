import { ID } from './entity';
import { ObjectId } from 'mongodb';
import mongoose, { Model, isValidObjectId } from 'mongoose';
import { getModelForClass } from '@typegoose/typegoose';


export type ObjectIdOrString = ID | string;

export interface QueryOptions {
    filter?: any,
    page?: number,
    pageSize?: number,
    sort?: any
}

export interface CrudRepository<T> {

    findById (id: ObjectIdOrString): Promise<T>;
    find (options: QueryOptions): Promise<T[]>;
    findOne (filter: any): Promise<T | undefined>;
    save (entity: T): Promise<T>;
    deleteOne (filter: any): Promise<boolean>;
}

export class MongoRepository<T> {
    model: Model<any>;

    constructor (EntityClass: any, options: any) {
        this.model = getModelForClass(EntityClass, options);
    }

    private createQueryOptions (args: QueryOptions): mongoose.QueryFindOptions {
        const pageSize = args.pageSize || 10;
        const page = args.page || 1;
        return {
            skip: (page - 1) * pageSize,
            limit: pageSize,
            sort: args.sort
        };
    }

    async findById (id: ObjectIdOrString): Promise<T> {
        if (!isValidObjectId(id)) throw new Error('Invalid Object ID');

        const objectId = new ObjectId(id);
        const document = this.model.findById(objectId).exec() as Promise<T>;
        if (!document) throw new Error('Entity not found');
        return document;
    }

    find (options: QueryOptions): Promise<T[]> {
        const filter = options.filter || {};

        return this.model.find(
            filter, null, this.createQueryOptions(options)
        ).exec() as Promise<T[]>;
    }

    findOne (filter: any): Promise<T | undefined> {
        return this.model.findOne(filter || {}).exec() as Promise<T | undefined>;
    }

    async save (entity: T): Promise<T> {
        return this.model.create(entity) as Promise<T>;
    }

    async deleteOne (filter: any): Promise<boolean> {
        const result = await this.model.deleteOne(filter).exec()
        return (result?.deletedCount || 0) > 0;
    }
}