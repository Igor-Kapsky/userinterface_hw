'use strict';

import { t } from 'testcafe';

class StartPage {
    constructor() {
        this.startLink = '.start__link';
    }

    async startGame() {
        await t.click(this.startLink);
    }

}

export default new StartPage();
