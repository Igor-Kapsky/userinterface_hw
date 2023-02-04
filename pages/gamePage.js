'use strict';

import { findIndexByText, getRandomIntInclusive, getRandomIntsInRange } from '../utils/helpers';
import { waitForTrue } from '../utils/waiter.js';
import { BaseComponent, Input, Button, Label, Dropdown, Checkbox } from '../components';
import { Selector } from 'testcafe';
import TestData from '../testData.json';



export default class GamePage extends BaseComponent {
    constructor(selector, name) {
        super(selector || '.game', name || 'Game page', 'Page', null);

        this.loginFormLabel = new Label('.login-form__container', 'Login form', this);
        this.passwordFieldInput = new Input('.login-form__field-row input[placeholder="Choose Password"]', 'Password field', this);
        this.emailFieldInput = new Input('.login-form__field-row input[placeholder="Your email"]', 'Email field', this);
        this.domainFieldInput = new Input('.login-form__field-row input[placeholder="Domain"]', 'Domain field', this);
        this.tldDropdown = new Dropdown( '.login-form__field-row .dropdown__field', 'TLD dropdown', this);
        this.commonDropdown = new Dropdown('.dropdown__list', 'Dropdown', this);
        this.acceptConditionsCheckbox = new Checkbox('.checkbox', 'Accept conditions checkbox', this);
        this.nextButton = new Button(Selector('.button-container__secondary .button--secondary').withText('Next'), 'Next button', this);

        this.avatarAndInterestsFormLabel = new Label('.avatar-and-interests', 'Avatar and interests', this);
        this.interestCheckbox = new Checkbox('.avatar-and-interests__interests-list .checkbox', 'Interest checkbox', this);
        this.nextBlueButton = new Button(Selector('.button--white').withText('Next'), 'Blue next button', this);
        this.validationErrorLabel = (error) => new Label(Selector('.avatar-and-interests__error').withText(`${error}`), `Error ${error} label`, this);

        this.helpModalLabel = new Label('.help-form', 'Help Modal', this);
        this.hideHelpModalButton = new Button('.help-form__send-to-bottom-button', 'Hide help button', this);

        this.cookiesFormLabel = new Label('.cookies', 'Cookies modal', this);
        this.agreeToUseCookiesButton = new Button('.cookies .button--transparent', 'Agree button', this);

        this.timerLabel = new Label('.timer', 'Timer', this);
    }

    async isComponentExists(component) {
        return await component.isExists();
    }

    async waitForCookiesModal() {
        return await this.cookiesFormLabel.waitUntilComponentIsExisting();
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

    async selectInterests(shouldBeSelected) {
        const options = await this.interestCheckbox.getOptionValues();
        const selectAllIndex = await findIndexByText(options);
        const selectedOptions = getRandomIntsInRange(shouldBeSelected, options.length - 1, selectAllIndex);
        await this.interestCheckbox.selectByIndex(options.length - 1);
        for (let i = 0; i < shouldBeSelected; i++) {
            await this.interestCheckbox.selectByIndex(selectedOptions[i]);
        }
    }

    async clickNextButton() {
        await this.nextBlueButton.click();
    }

    async isCorrectStyle(element, style, expected, timeout = TestData.timeout) {
        return await waitForTrue(async () => await element.getStyleProperty(style) === expected, timeout);
    }

    async getStyle(element, style) {
        const test = await element.getStyleProperty(style);
        return test;
    }

    async getAttribute(element) {
        return await element.getComponentAttributes();
    }

    async acceptCookies() {
        await this.agreeToUseCookiesButton.click();
    }

    async hideHelpForm() {
        await this.hideHelpModalButton.click();
    }

    async getTime() {
        return await this.timerLabel.getTextContent();
    }
}
