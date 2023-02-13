'use strict';

import { findIndexByText, getRandomIntsInRange } from '../utils/helpers';
import { Button, Label, Checkbox, BaseComponent } from '../components';
import { Selector } from 'testcafe';

export default new class AvatarAndInterestsPage extends BaseComponent {
    constructor() {
        super('.avatar-and-interests', 'Avatar and interests');

        this.avatarAndInterestsFormLabel = new Label('.avatar-and-interests', 'Avatar and interests', this);
        this.interestCheckbox = new Checkbox('.avatar-and-interests__interests-list .checkbox', 'Interest checkbox', this);
        this.nextBlueButton = new Button(Selector('.button--white').withText('Next'), 'Blue next button', this);
        this.validationErrorLabel = (error) => new Label(Selector('.avatar-and-interests__error').withText(`${error}`), `Error ${error} label`, this);
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

    async isAvatarPageExists() {
        return await this.avatarAndInterestsFormLabel.isComponentExisting();
    }

    async isErrorExists(error) {
        return await this.validationErrorLabel(error).isComponentExisting();
    }

};
