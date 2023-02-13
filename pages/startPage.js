'use strict';

import BaseComponent from '../components/baseComponent.js';
import Button from '../components/button.js';


class StartPage extends BaseComponent {
    constructor() {
        super('.start', 'Start page');

        this.startLinkButton = new Button('.start__link', 'Start link', this);
    }

    async startGame() {
        await this.startLinkButton.click();
    }
}

export default new StartPage();
