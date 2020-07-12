'use strict';

interface IRepository<T> {
    getAllAsync (mongoFilter: any): Promise<any>;

    getByIdAsync (id: string, mongoFilter: any): Promise<any>;

    getOneAsync (mongoFilter: any): Promise<any>;

    createAsync (instance: T): Promise<any>;

    updateByIdAsync (id: string, instance: T): Promise<any>;

    deleteByIdAsync (id: string): Promise<any>;

    deleteManyAsync (mongoFilter: any): Promise<any>;

    countAsync (mongoFilter: any): Promise<any>;
}

export { IRepository };