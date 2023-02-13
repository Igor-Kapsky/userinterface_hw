'use strict';

import { getRandomIntInclusive } from '../utils/helpers';
import { BaseComponent, Input, Button, Label, Dropdown, Checkbox } from '../components';
import { Selector } from 'testcafe';
import { waitForTrue } from '../utils/waiter.js';
import TestData from '../testData.json';



class GamePage extends BaseComponent {
    constructor() {
        super('.game', 'Game page');

        this.loginFormLabel = new Label('.login-form__container', 'Login form', this);
        this.passwordFieldInput = new Input('.login-form__field-row input[placeholder="Choose Password"]', 'Password field', this);
        this.emailFieldInput = new Input('.login-form__field-row input[placeholder="Your email"]', 'Email field', this);
        this.domainFieldInput = new Input('.login-form__field-row input[placeholder="Domain"]', 'Domain field', this);
        this.tldDropdown = new Dropdown( '.login-form__field-row .dropdown__field', 'TLD dropdown', this);
        this.commonDropdown = new Dropdown('.dropdown__list', 'Dropdown', this);
        this.acceptConditionsCheckbox = new Checkbox('.checkbox', 'Accept conditions checkbox', this);
        this.nextButton = new Button(Selector('.button-container__secondary .button--secondary').withText('Next'), 'Next button', this);
        this.timerLabel = new Label('.timer', 'Timer', this);
    }

    async isPageLoaded() {
        return await this.loginFormLabel.isComponentExisting();
    }

    async clearField(field) {
        await field.clear();
    }

    async enterPassword(password) {
        await this.clearField(this.passwordFieldInput);
        await this.passwordFieldInput.sendKeys(password);
    }

    async enterEmail(email) {
        await this.clearField(this.emailFieldInput);
        await this.emailFieldInput.sendKeys(email);
    }

    async enterDomain(domain) {
        await this.clearField(this.domainFieldInput);
        await this.domainFieldInput.sendKeys(domain);
    }

    async selectRandomTldOption() {
        await this.tldDropdown.openDropdown();
        const optionsCount = await this.commonDropdown.getOptionValues();
        const randomOptionNumber = getRandomIntInclusive(1, optionsCount.length - 1);
        await this.commonDropdown.selectByIndex(randomOptionNumber);
    }

    async acceptConditions() {
        await this.acceptConditionsCheckbox.click();
    }

    async goToNextStep() {
        await this.nextButton.click();
    }

    async getTime() {
        return await this.timerLabel.getTextContent();
    }

    async getStyle(element, style) {
        const test = await element.getStyleProperty(style);
        return test;
    }

    async isCorrectStyle(element, style, expected, timeout = TestData.timeout) {
        return await waitForTrue(async () => await element.getStyleProperty(style) === expected, timeout);
    }
}

export default new GamePage();
