import { Selector } from 'testcafe';
import StartPage from './pages/startPage.js';
import GamePage from './pages/gamePage.js';
import {
    passwordGenerator,
    emailGenerator,
    textGenerator,
    stringContainsValue,
    convertTimeout
} from './utils/helper.js';
import TestData from './testData.json';


fixture`Getting Started`
    .page`https://userinyerface.com/`;

test('Registration', async t => {
    await StartPage.startGame();

    await t.expect(Selector(GamePage.loginForm).exists).ok();
    const password = passwordGenerator(TestData.passwordLength);
    await GamePage.fillInText(GamePage.passwordField, password);
    await GamePage.fillInText(GamePage.emailField, emailGenerator(TestData.emailLength, password));
    await GamePage.fillInText(GamePage.domainField, textGenerator(TestData.domainLength));
    await GamePage.selectTldOption();
    await GamePage.acceptConditions();
    await GamePage.goToNextStep();

    await t.expect(Selector(GamePage.avatarAndInterestsForm).exists).ok();
    await GamePage.selectInterests(TestData.interestsAmount);
    await GamePage.clickNextButton();
    await t.expect(Selector(GamePage.validationError(TestData.uploadErrorText)).exists).ok();
    await t.expect(Selector(GamePage.validationError(TestData.uploadErrorText)).getStyleProperty(TestData.colorStyle)).eql(TestData.greenColorRGB);
    await t.expect(Selector(GamePage.validationError(TestData.interestsErrorText)).exists).notOk();
});

test('Hide help form', async t => {
    await StartPage.startGame();

    await t.expect(Selector(GamePage.loginForm).exists).ok();
    await t.expect(Selector(GamePage.helpModal).exists).ok();
    const attributesBefore = await Selector(GamePage.helpModal).attributes;
    await t.expect(stringContainsValue(attributesBefore.class, TestData.hiddenAttribute)).notOk;
    await GamePage.hideHelpForm();
    const attributesAfter = await Selector(GamePage.helpModal).attributes;
    await t.expect(stringContainsValue(attributesAfter.class, TestData.hiddenAttribute)).ok;
    const timeoutValueStr = await Selector(GamePage.helpModal).getStyleProperty(TestData.hideDurationStyle);
    const timeoutValueInt = convertTimeout(timeoutValueStr);
    await t.expect(Selector(GamePage.helpModal).getStyleProperty(TestData.heightStyle)).eql(TestData.heightValueAfterHide, { timeout: timeoutValueInt });
});

test('Accept cookies', async t => {
    await StartPage.startGame();

    await t.expect(Selector(GamePage.loginForm).exists).ok();
    await t.expect(Selector(GamePage.cookiesForm).exists).ok();
    await GamePage.acceptCookies();
    await t.expect(Selector(GamePage.cookiesForm).exists).notOk();
});

test('Check timer placeholder', async t => {
    await StartPage.startGame();

    const startTime = await GamePage.getTime();
    await t.expect(startTime).eql(TestData.timerStartValue);
});
