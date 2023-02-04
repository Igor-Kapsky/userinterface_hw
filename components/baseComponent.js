'use strict';

import { Selector, t } from 'testcafe';
import { waitForTrue as utilsWaitForTrue } from '../utils/waiter';

class BaseComponent {
    /**
     * Create base component for any UI control or UI form
     *
     * @param {string | Selector} selector - The selector to the element
     * @param {string} name - The textual description of the element
     * @param {string} type - The type of the element (Input, Form, Page, etc.)
     * @param {BaseComponent | null} parent - A parent of the component. For Page it must be null (e.g. A Button has a parent a Form)
     */
    constructor(selector, name, type, parent) {
        if (!name || !type || (type !== 'Page' && !parent)) {
            throw new Error(`Some of the required constructor parametes are not passed. Component constructor expects 4 params:
                selector, name, type, parent (for components of type 'Page' parent is not required). 
                Currently the following values have been passed:\nselector = ${selector}\nname = ${name}\ntype = ${type}\nparent = ${parent ? parent.name + ' ' + parent.type : null}`);
        }
        this.selector = selector;
        this.name = name;
        this.type = type;
        this.parent = parent;
        this.nested = false;
    }

    /**
     * Logs component action
     *
     * @param {string} action - The action description
     * @param {string|null} [value] - Additional values of the action. Optional
     */
    logComponentAction(action, value = null) {
        t.ctx.logger.info(LoggerMessages.createComponentMessage(action, this, value));
    }

    /**
     * Asserts an element is visible (or can be scrolled to if off the viewport)
     * Throws an exception if `visibiltyCheck` fails
     * @return {Promise<void>}
     */
    async assertComponentIsVisible() {
        if (!await this.getSelector().visible) {
            this.throwComponentError('is not visible');
        }
    }

    throwComponentError(message) {
        const name = this.name;

        let type = '';
        let postPhrase = '';

        if (this.type) {
            type = this.type.toLowerCase();
            const components = this.makeComponentChain();
            postPhrase = type === 'page' ? '' : ` at "${components}"`;
        }

        throw new ComponentError(`The "${name}" ${type} ${message}${postPhrase}`, this);
    }

    /**
     * Clicks an element
     *
     * @param {{}} [options] - the testcafe click options
     * @param {boolean} [checkVisibility] - flag which specifies whether the visibility of element should or should not be checked before click
     * @return {Promise<void>}
     */
    async click(options, checkVisibility = true) {
        await this.waitUntilComponentIsExisting();
        await this.waitUntilElementIsEnabled();
        if (checkVisibility) {
            await this.assertComponentIsVisible();
        }
        await t.click(this.getSelector(), options);
    }

    /**
     * Right clicks an element
     *
     * @param {{}} [options] - the testcafe click options
     * @return {Promise<void>}
     */
    async rightClick(options) {
        await this.waitUntilComponentIsExisting();
        await this.waitUntilElementIsEnabled();
        this.logComponentAction('rightClick');
        await t.rightClick(this.getSelector(), options);
    }

    /**
     * Clicks all elements matching the selector
     *
     * @return {Promise<void>}
     */
    async clickAll() {
        await this.waitUntilComponentIsExisting();
        const elements = this.getSelector();
        const count = await elements.count;
        for (let i = 0; i < count; i++) {
            this.logComponentAction('click');
            await t.click(elements.nth(i));
        }
    }

    /**
     * The text content of the node and its descendants
     * See https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
     *
     * @return {Promise<string>}
     */
    async getTextContent() {
        await this.waitUntilComponentIsExisting();
        const text = await this._getTextContent();
        return text;
    }

    /**
     * The text content of the node and its descendants
     * See https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
     *
     * @return {Promise<string>}
     * @private
     */
    _getTextContent() {
        return this.getSelector().textContent;
    }

    /**
     * Returns the TestCafe selector
     *
     * @return {Selector}
     */
    getSelector() {
        if (this.nested) {
            return this.getNestedSelector();
        } else {
            if (this.selector instanceof Function) {
                return this.selector();
            }
            return Selector(this.selector);
        }
    }

    /**
     * Returns the TestCafe selector with its parents selectors prepended
     *
     * @return {Selector}
     */
    getNestedSelector() {
        const toName = (component) => component.selector;

        const components = [];
        for (let component = this.parent; component; component = component.parent) {
            components.push(toName(component));
        }
        components.reverse().push(toName(this));

        return Selector(components.join(' '));
    }

    /**
     * Returns true if at least one matching element exists
     *
     * @return {Promise<boolean>}
     */
    async isExists() {
        const isExist = await this._isExisting();
        // this.logComponentAction('exist', isExist ? 'yes' : 'no');
        return isExist;
    }

    /**
     * Returns true if at least one matching element exists
     *
     * @return {Promise<boolean>}
     * @private
     */
    _isExisting() {
        return this.getSelector().exists;
    }

    /**
     * Waits until the element is enabled. Throws ComponentError if the element is not enabled after wait.
     *
     * @param {number} [timeout] - Timeout
     * @return {Promise<void>}
     */
    async waitUntilElementIsEnabled(timeout) {
        const isEnabled = await utilsWaitForTrue(async () => await this.isEnabled(), timeout || 10000);
        if (!isEnabled) {
            this.throwComponentError('is disabled');
        }
    }

    /**
     * Waits until the element is disabled. Throws ComponentError if the element is not disabled after wait.
     *
     * @param {number} [timeout] - Timeout
     * @return {Promise<void>}
     */
    async waitUntilElementIsDisabled(timeout) {
        const isDisabled = await utilsWaitForTrue(async () => await this.isDisabled(), timeout || 10000);
        if (!isDisabled) {
            this.throwComponentError('is enabled');
        }
    }

    /**
     * @deprecated in 1.1, use {@link waitUntilSelectorIsExisting} instead.
     *
     * Waits until the selector exists. Throws an error is the selector does not exist after wait.
     *
     * @param {Selector|string} selector - The selector that has to exist
     * @param {number} [timeout] - Timeout in ms
     * @return {Promise<void>}
     */
    async assertSelectorExists(selector, timeout) {
        console.warn('"assertSelectorExists" is deprecated. Use "waitUntilSelectorIsExisting"');
        await this.waitUntilSelectorIsExisting(selector, timeout || 10000);
    }

    /**
     * Waits until the selector exists. Throws an error is the selector does not exist after wait.
     *
     * @param {Selector|string} selector - The selector that has to exist
     * @param {number} [timeout] - Timeout in ms
     * @return {Promise<void>}
     */
    async waitUntilSelectorIsExisting(selector, timeout) {
        if (!await this.isSelectorExisting(selector, timeout || 10000)) {
            this.throwComponentError('does not exist');
        }
    }

    /**
     * Waits until component is absent. Throws an error if the component is present after wait.
     *
     * @param {number} [timeout] - Timeout in ms
     * @return {Promise<void>}
     */
    async waitUntilComponentIsAbsent(timeout) {
        const isAbsent = utilsWaitForTrue.bind(null, async () => {
            const isExisting = await this._isExisting();
            return !isExisting;
        }, timeout || 10000);

        if (!await isAbsent()) {
            this.throwComponentError('is not absent');
        }
    }

    /**
     * @deprecated in 1.1, use {@link isSelectorExisting} instead.
     *
     * Returns true if the selector exists after wait. Returns false otherwise
     *
     * @param {Selector|string} selector - The selector that has to exist
     * @param {number} [timeout] - Timeout in ms
     * @return {Promise<boolean>} - true if the element exists, false otherwise
     * @private
     */
    async waitUntilSelectorExists(selector, timeout) {
        console.warn('"waitUntilSelectorExists" is deprecated. Use "isSelectorExisting"');
        return await this.isSelectorExisting(selector, timeout || 10000);
    }

    /**
     * Returns true if the selector exists after wait. Returns false otherwise
     *
     * @param {Selector|string} selector - The selector that has to exist
     * @param {number} [timeout] - Timeout in ms
     * @return {Promise<boolean>} - true if the element exists, false otherwise
     * @private
     */
    async isSelectorExisting(selector, timeout) {
        if (typeof selector === 'string') {
            selector = Selector(selector);
        }
        if (!await selector.exists) {
            if (!await utilsWaitForTrue(async () => await selector.exists, timeout || 10000)) {
                return false;
            }
        }
        return true;
    }

    /**
     * @deprecated in 1.1, use {@link isComponentExisting} instead.
     *
     * Returns true if the component exists after wait. Returns false otherwise
     *
     * @param {number} [timeout] - Timeout in ms
     * @return {Promise<boolean>} - true if the element exists, false otherwise
     */
    async waitUntilComponentExists(timeout) {
        console.warn('"waitUntilComponentExists" is deprecated. Use "isComponentExisting"');
        return await this.isComponentExisting(timeout || 10000);
    }

    /**
     * Returns true if the component exists after wait. Returns false otherwise
     *
     * @param {number} [timeout] - Timeout in ms
     * @return {Promise<boolean>} - true if the element exists, false otherwise
     */
    async isComponentExisting(timeout) {
        return await this.isSelectorExisting(this.getSelector(), timeout || 10000);
    }

    /**
     * @deprecated in 1.1, use {@link waitUntilComponentIsExisting} instead.
     *
     * Waits until the component exists. Throws an error if the component does not exist after wait.
     * Otherwise throws an error
     *
     * @param {number} [timeout] - Timeout in ms
     * @return {Promise<void>}
     */
    async assertComponentExists(timeout) {
        console.warn('"assertComponentExists" is deprecated. Use "waitUntilComponentIsExisting"');
        await this.waitUntilComponentIsExisting(timeout || 10000);
    }

    /**
     * Waits until the component exists. Throws an error if the component does not exist after wait.
     * Otherwise throws an error
     *
     * @param {number} [timeout] - Timeout in ms
     * @return {Promise<void>}
     */
    async waitUntilComponentIsExisting(timeout) {
        await this.waitUntilSelectorIsExisting(this.getSelector(), timeout || 10000);
    }

    /**
     * Clicks an element with the provided `text`
     *
     * @param {string} text - The text in the element
     * @return {Promise<void>}
     */
    async clickElementWithText(text) {
        await this.waitUntilComponentIsExisting();
        this.logComponentAction('click', `with text: ${text}`);
        await t.click(this.getSelector().withText(text));
    }

    /**
    * Waits until fn is done
    *
    * @param {Function} fn - The function being called with delay until timeout
    * @param {number} [timeout] - Total time to wait in ms before giving an error. Default value is 3000
    * @param {number} [interval] - Interval between checks in ms. Default value is 50
    * @return {Promise<void>}
    */
    async waitComponentForAssert(fn, timeout = 10000, interval = 50) {
        const finish = Date.now() + timeout;
        let lastError;
        while (Date.now() - finish < 0) {
            try {
                await fn();
                lastError = null;
                break;
            } catch (e) {
                lastError = e;
                await new Promise(resolve => setTimeout(resolve, interval));
            }
        }
        if (lastError) {
            throw lastError;
        }
    }

    /**
     * Collects a list component names starting from the parent component
     *
     * @return {string[]}
     */
    getComponentChain() {
        const components = [];
        for (let component = this.parent; component; component = component.parent) {
            components.push(component);
        }
        return components.reverse();
    }

    /**
     * Collects component names starting from the current component
     * and makes a string that represent components hierarchy
     *
     * @return {string}
     */
    makeComponentChain() {
        const toName = (component) => component.type ? `${component.name} (${component.type})` : `${component.name}`;

        const components = this.getComponentChain().map(component => toName(component));
        components.push(toName(this));

        return components.join(' / ');
    }

    /**
     * Hover over an element
     *
     * @param {{}} [options] - the testcafe hover options
     * @param {boolean} [checkVisibility] - flag which specifies whether the visibility of element should or should not be checked before click
     * @return {Promise<void>}
     */
    async hover(options, checkVisibility = true) {
        await this.waitUntilComponentIsExisting();
        await this.waitUntilElementIsEnabled();
        if (checkVisibility) {
            await this.assertComponentIsVisible();
        }
        this.logComponentAction('hover');
        await t.hover(this.getSelector(), options);
    }

    /**
     * Get the number of components with specified selector
     * @returns {Promise<number>}
     */
    async getComponentCount() {
        return await this.getSelector().count;
    }

    /**
     * Get attributes of the component
     * @returns {Promise<{}>}
     */
    async getComponentAttributes() {
        await this.waitUntilComponentIsExisting();
        return await this.getSelector().attributes;
    }

    /**
     * Get text content of all elements matching the selector
     *
     * @return {Promise<Object[]>}
     */
    async getTextFromAll() {
        let texts = [];
        await this.waitUntilComponentIsExisting();
        const count = await this.getComponentCount();
        for (let index = 0; index < count; index++) {
            texts.push(await this.getSelector().nth(index).textContent);
        }
        return texts.filter(text => text !== '');
    }

    /**
     * Return true or false if the component is enabled
     *
     * @return {Promise<boolean>}
     */
    async isEnabled() {
        await this.waitUntilComponentIsExisting();
        const attributes = await this.getComponentAttributes();
        return (
            !('disabled' in attributes) &&
            !(attributes.class && attributes.class.includes('disabled')) &&
            ('aria-disabled' in attributes ? attributes['aria-disabled'] === 'false' : true)
        );
    }

    /**
     * Return true or false if the component is disabled
     *
     * @return {Promise<boolean>}
     */
    async isDisabled() {
        await this.waitUntilComponentIsExisting();
        const attributes = await this.getComponentAttributes();
        return (
            'disabled' in attributes ||
            !!(attributes.class && attributes.class.includes('disabled')) ||
            !!(attributes['aria-disabled'] && attributes['aria-disabled'] === 'true')
        );
    }

    /**
     * Scroll the component into view
     * @returns {Promise<void>}
     */
    async scrollTo() {
        await this.waitUntilComponentIsExisting();
        this.logComponentAction('scroll to');
        await t.scrollIntoView(this.getSelector());
    }

    /**
     * Returns the computed value of a specific CSS property
     *
     * @param {string} propertyName - CSS property
     * @return {Promise<string>}
     */
    async getStyleProperty(propertyName) {
        return this.getSelector().getStyleProperty(propertyName);
    }

    /**
     * Returns the value of color CSS property
     *
     * @param {string} propertyName - color CSS property
     * @return {Promise<string>}
     */
    async getColor(propertyName = 'color') {
        return this.getStyleProperty(propertyName);
    }

    /**
     * Returns the value of background color CSS property
     *
     * @param {string} propertyName - background color CSS property
     * @return {Promise<string>}
     */
    async getBackgroundColor(propertyName = 'background-color') {
        return this.getStyleProperty(propertyName);
    }
}

export default BaseComponent;
