'use strict';

import { BaseComponent, Button, Label } from '../components';

class HelpForm extends BaseComponent {

    constructor() {
        super('.help-form', 'Help Form');

        this.helpModalLabel = new Label('.help-form', 'Help Modal', this);
        this.hideHelpModalButton = new Button('.help-form__send-to-bottom-button', 'Hide help button', this);

    }

    async getAttribute(element) {
        return await element.getComponentAttributes();
    }

    async hideHelpForm() {
        await this.hideHelpModalButton.click();
    }

    async isHelpFormExists() {
        return await this.helpModalLabel.isComponentExisting();
    }
}

export default new HelpForm();
