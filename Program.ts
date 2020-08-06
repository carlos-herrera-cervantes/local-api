'use strict';

import { Startup } from './Api.Web/Startup';

class Program {

    public createHostBuilder (): void {
        const app = new Startup();
        app.listen();
    }

}

new Program().createHostBuilder();