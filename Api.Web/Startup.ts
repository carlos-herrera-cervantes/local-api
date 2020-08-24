'use strict';

import { Server } from '@overnightjs/core';
import { config } from 'dotenv';
import express from 'express';
import { connect, connection } from 'mongoose';
import { configure } from './Config/Configure';
import { serve, setup } from 'swagger-ui-express';
import { swaggerDocument } from './Config/SwaggerConfig';

class Startup extends Server {

    constructor () {
        super();
        config();
        this.app.use(express.json());
        this.setupDatabase();
        this.setupSwagger();
        super.addControllers(configure.mapRepositories());
    }

    /**
     * Starts the server
     * @returns {Void}
     */
    public listen = (): any =>
        this.app.listen(process.env.PORT, () => console.info(`Server running at port: ${process.env.PORT}`));

    /**
     * Connect with MongoDB server
     * @returns {Void}
     */
    private setupDatabase (): void {
        const URI = `mongodb://${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}`;
        connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
        connection.on('error', console.error.bind(console, 'MongoDB connection error'));
    }

    /**
     * Setup the documentation for endpoints
     * @returns {Void}
     */
    private setupSwagger = (): any => this.app.use('/api-docs', serve, setup(swaggerDocument));

}

export { Startup };