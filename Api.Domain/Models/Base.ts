'use strict';

import moment from 'moment';

const setTimestamps = () => moment().format('YYYY-MM-DDTHH:mm:ss');

export { setTimestamps };