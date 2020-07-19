'use strict';

import { Startup } from './Api.Web/Startup';
import { ppid } from 'process';

class Program {

    public createHostBuilder (): void {
        const app = new Startup();
        app.listen();
    }

}

new Program().createHostBuilder();