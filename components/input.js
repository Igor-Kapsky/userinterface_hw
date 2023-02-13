'use strict';

import { t } from 'testcafe';
import BaseComponent from './baseComponent';

/**
 * An Input component
 */
class Input extends BaseComponent {
    /**
     * Create Input component
     *
     * @param {string | Selector} selector - The selector to the element
     * @param {string} name - The textual description of the element
     * @param {BaseComponent} parent - A parent of the component. For Page it must be null (e.g. A Button has a parent a Form)
     */
    constructor(selector, name, parent) {
        super(selector, name, 'Input', parent);
    }

    /**
     * Types text into the input.
     * By default overwrites the current contents of the input.
     * @param {string} text The text to type into the input field
     * @param {{}} options Testcafe Typing Action Options: https://devexpress.github.io/testcafe/documentation/test-api/actions/action-options.html#typing-action-options
     * @param {boolean} options.clean clean a value of the input before putting the text
     */
    async sendKeys(text, options = null) {
        options = { replace: true, ...options };
        await this.waitUntilComponentIsExisting();
        await this.waitUntilElementIsEnabled();
        const { 'type': typeValue } = await this.getComponentAttributes();
        if (typeValue === 'number') {
            options = { paste: true, ...options };
        }
        if (await this.getTextContent() === text) {
            return;
        } else if (options.clean) {
            await this.clear();
            delete options.clean;
        }
        await t.typeText(this.getSelector(), text, options);
    }

    /**
     * Clear the input
     * @returns {Promise<void>}
     */
    async clear() {
        await t.click(this.getSelector()).pressKey('ctrl+a delete');
    }

    _getTextContent() {
        return this.getSelector().value;
    }
}

export default Input;
