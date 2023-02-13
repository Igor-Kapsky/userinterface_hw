'use strict';

import { BaseComponent, Button, Label } from '../components';


class CookiesForm extends BaseComponent {

    constructor() {
        super('.cookies', 'Cookies Form');

        this.cookiesFormLabel = new Label('.cookies', 'Cookies modal', this);
        this.agreeToUseCookiesButton = new Button('.cookies .button--transparent', 'Agree button', this);

    }

    async waitForCookiesModal() {
        return await this.cookiesFormLabel.waitUntilComponentIsExisting();
    }

    async acceptCookies() {
        await this.agreeToUseCookiesButton.click();
    }

    async isCookiesFormExists() {
        return await this.cookiesFormLabel.isComponentExisting();
    }

}

export default new CookiesForm();
