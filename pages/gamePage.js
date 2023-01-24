import { Selector, t } from 'testcafe';
import { findIndexByText, getRandomIntInclusive, getRandomIntsInRange } from '../utils/helper.js';

class GamePage {
    constructor() {
        this.loginForm = '.login-form__container';
        this.passwordField = '.login-form__field-row input[placeholder="Choose Password"]';
        this.emailField = '.login-form__field-row input[placeholder="Your email"]';
        this.domainField = '.login-form__field-row input[placeholder="Domain"]';
        this.tldDropdown = '.login-form__field-row .dropdown__field';
        this.dropdownItem = '.dropdown__list .dropdown__list-item:not(.selected)';
        this.acceptConditionsCheckbox = '.checkbox__check';
        this.nextButton = Selector('.button-container__secondary .button--secondary').withText('Next');

        this.avatarAndInterestsForm = '.avatar-and-interests';
        this.checkboxSelector = '.avatar-and-interests__interests-list .checkbox';
        this.checkboxTitleSelector = Selector(this.checkboxSelector).nextSibling();
        this.nextButtonBlue = Selector('.button--white').withText('Next');
        this.validationError = (error) => Selector('.avatar-and-interests__error').withText(`${error}`);

        this.helpModal = '.help-form';
        this.hideHelpModalButton ='.help-form__send-to-bottom-button';

        this.cookiesForm = '.cookies';
        this.agreeToUseCookiesButton = '.cookies .button--transparent';

        this.timer = '.timer';
    }

    async clearField(field) {
        await t.click(field).pressKey('ctrl+a delete');
    }

    async fillInText(field, text) {
        await this.clearField(field);
        await t.typeText(field, text);
    }

    async selectTldOption() {
        const optionsCount = await Selector(this.dropdownItem).count - 1;
        const randomOptionNumber = getRandomIntInclusive(0, optionsCount);
        await t.click(this.tldDropdown).click(Selector(this.dropdownItem).nth(randomOptionNumber));
    }

    async acceptConditions() {
        await t.click(this.acceptConditionsCheckbox);
    }

    async goToNextStep() {
        await t.click(this.nextButton);
    }

    async selectInterests(shouldBeSelected) {
        const optionsCount = await Selector(this.checkboxSelector).count - 1;
        const allTitles = await this.getInterestsTitles();
        const selectAllIndex = await findIndexByText(allTitles);
        const selectedOptions = getRandomIntsInRange(shouldBeSelected, optionsCount, selectAllIndex);
        await t.click(Selector(this.checkboxSelector).nth(optionsCount));
        for (let i = 0; i < shouldBeSelected; i++) {
            await t.click(Selector(this.checkboxSelector).nth(selectedOptions[i]));
        }
    }

    async getInterestsTitles() {
        const count = await Selector(this.checkboxTitleSelector).count - 1;
        let allTitles = [];
        for (let i = 0; i < count; i++) {
            allTitles.push(await Selector(this.checkboxTitleSelector).nth(i).innerText);
        }
        return allTitles;
    }

    async clickNextButton() {
        await t.click(this.nextButtonBlue);
    }

    async acceptCookies() {
        await t.click(this.agreeToUseCookiesButton);
    }

    async hideHelpForm() {
        await t.click(this.hideHelpModalButton);
    }

    async getTime() {
        return await Selector(this.timer).innerText;
    }
}

export default new GamePage();
