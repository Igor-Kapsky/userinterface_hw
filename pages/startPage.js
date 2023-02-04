'use strict';

import BaseComponent from '../components/baseComponent.js';
import Button from '../components/button.js';


export default class StartPage extends BaseComponent {
    constructor(selector, name) {
        super(selector || '.start', name || 'Start page', 'Page', null);

        this.startLinkButton = new Button('.start__link', 'Start link', this);
    }

    async startGame() {
        await this.startLinkButton.click();
    }
}
