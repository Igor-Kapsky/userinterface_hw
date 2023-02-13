import gamePage from './pages/gamePage.js';
import startPage from './pages/startPage.js';
import avatarAndInterestsPage from './pages/avatarAndInterestPage.js';
import helpForm from './pages/helpForm.js';
import cookiesForm from './pages/cookiesForm.js';
import { assert } from 'chai';
import {
    passwordGenerator,
    emailGenerator,
    textGenerator,
    stringContainsValue,
    convertTimeout
} from './utils/helpers';
import TestData from './testData.json';


fixture`Getting Started`
    .page`https://userinyerface.com/`;

test('Registration', async t => {
    await startPage.startGame();

    assert.isTrue(await gamePage.isPageLoaded());
    const password = passwordGenerator(TestData.passwordLength);
    await gamePage.enterPassword(password);
    await gamePage.enterEmail(emailGenerator(TestData.emailLength, password));
    await gamePage.enterDomain(textGenerator(TestData.domainLength));
    await gamePage.selectRandomTldOption();
    await gamePage.acceptConditions();
    await gamePage.goToNextStep();

    assert.isTrue(await avatarAndInterestsPage.isAvatarPageExists());
    await avatarAndInterestsPage.selectInterests(TestData.interestsAmount);
    await avatarAndInterestsPage.clickNextButton();
    assert.isTrue(await avatarAndInterestsPage.isErrorExists(TestData.uploadErrorText));
    assert.isTrue(await gamePage.isCorrectStyle(avatarAndInterestsPage.validationErrorLabel(TestData.uploadErrorText), TestData.colorStyle, TestData.greenColorRGB));
    assert.isFalse(await avatarAndInterestsPage.isErrorExists(TestData.interestsErrorText));
});

test('Hide help form', async t => {
    await startPage.startGame();


    assert.isTrue(await gamePage.isPageLoaded());
    assert.isTrue(await helpForm.isHelpFormExists());
    const attributesBefore = await helpForm.getAttribute(helpForm.helpModalLabel);
    assert.isFalse(stringContainsValue(attributesBefore.class, TestData.hiddenAttribute));
    await helpForm.hideHelpForm();
    const attributesAfter = await helpForm.getAttribute(helpForm.helpModalLabel);
    assert.isTrue(stringContainsValue(attributesAfter.class, TestData.hiddenAttribute));
    const timeoutValueStr = await gamePage.getStyle(helpForm.helpModalLabel, TestData.hideDurationStyle);
    const timeoutValueInt = convertTimeout(timeoutValueStr);
    assert.isTrue(await gamePage.isCorrectStyle(helpForm.helpModalLabel, TestData.heightStyle, TestData.heightValueAfterHide, timeoutValueInt));
});

test('Accept cookies', async t => {
    await startPage.startGame();


    assert.isTrue(await gamePage.isPageLoaded());
    await cookiesForm.waitForCookiesModal();
    await cookiesForm.acceptCookies();
    assert.isFalse(await cookiesForm.isCookiesFormExists());
});

test('Check timer placeholder', async t => {
    await startPage.startGame();


    assert.isTrue(await gamePage.isPageLoaded());
    const startTime = await gamePage.getTime();
    assert.strictEqual(startTime, TestData.timerStartValue);
});
