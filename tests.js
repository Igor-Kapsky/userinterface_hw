// import { Selector } from 'testcafe';
import StartPage from './pages/startPage.js';
import GamePage from './pages/gamePage.js';
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
    const startPage = new StartPage();
    const gamePage = new GamePage();
    await startPage.startGame();

    assert.isTrue(await gamePage.isComponentExists(gamePage.loginFormLabel));
    const password = passwordGenerator(TestData.passwordLength);
    await gamePage.enterPassword(password);
    await gamePage.enterEmail(emailGenerator(TestData.emailLength, password));
    await gamePage.enterDomain(textGenerator(TestData.domainLength));
    await gamePage.selectRandomTldOption();
    await gamePage.acceptConditions();
    await gamePage.goToNextStep();

    assert.isTrue(await gamePage.isComponentExists(gamePage.avatarAndInterestsFormLabel));
    await gamePage.selectInterests(TestData.interestsAmount);
    await gamePage.clickNextButton();
    assert.isTrue(await gamePage.isComponentExists(gamePage.validationErrorLabel(TestData.uploadErrorText)));
    assert.isTrue(await gamePage.isCorrectStyle(gamePage.validationErrorLabel(TestData.uploadErrorText), TestData.colorStyle, TestData.greenColorRGB));
    assert.isFalse(await gamePage.isComponentExists(gamePage.validationErrorLabel(TestData.interestsErrorText)));
});

test('Hide help form', async t => {
    const startPage = new StartPage();
    const gamePage = new GamePage();
    await startPage.startGame();


    assert.isTrue(await gamePage.isComponentExists(gamePage.loginFormLabel));
    assert.isTrue(await gamePage.isComponentExists(gamePage.helpModalLabel));
    const attributesBefore = await gamePage.getAttribute(gamePage.helpModalLabel);
    assert.isFalse(stringContainsValue(attributesBefore.class, TestData.hiddenAttribute));
    await gamePage.hideHelpForm();
    const attributesAfter = await gamePage.getAttribute(gamePage.helpModalLabel);
    assert.isTrue(stringContainsValue(attributesAfter.class, TestData.hiddenAttribute));
    const timeoutValueStr = await gamePage.getStyle(gamePage.helpModalLabel, TestData.hideDurationStyle);
    const timeoutValueInt = convertTimeout(timeoutValueStr);
    assert.isTrue(await gamePage.isCorrectStyle(gamePage.helpModalLabel, TestData.heightStyle, TestData.heightValueAfterHide, timeoutValueInt));
});

test('Accept cookies', async t => {
    const startPage = new StartPage();
    const gamePage = new GamePage();
    await startPage.startGame();


    assert.isTrue(await gamePage.isComponentExists(gamePage.loginFormLabel));
    await gamePage.waitForCookiesModal();
    await gamePage.acceptCookies();
    assert.isFalse(await gamePage.isComponentExists(gamePage.cookiesFormLabel));
});

test('Check timer placeholder', async t => {
    const startPage = new StartPage();
    const gamePage = new GamePage();
    await startPage.startGame();


    assert.isTrue(await gamePage.isComponentExists(gamePage.loginFormLabel));
    const startTime = await gamePage.getTime();
    assert.strictEqual(startTime, TestData.timerStartValue);
});
