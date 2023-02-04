'use strict';

import { t } from 'testcafe';
import BaseComponent from './baseComponent';

/**
 * A Checkbox component
 */
class Checkbox extends BaseComponent {
    /**
     * Create Checkbox component
     *
     * @param {string | Selector} selector - The selector to the element
     * @param {string} name - The textual description of the element
     * @param {BaseComponent} parent - A parent of the component. For Page it must be null (e.g. A Button has a parent a Form)
     */
    constructor(selector, name, parent) {
        super(selector, name, 'CheckBox', parent);
    }

    async getOptionValues() {
        await this.waitUntilComponentIsExisting();
        const options = await this.getSelector().nextSibling();
        const values = [];
        for ( let i = 0; i < await options.count; i++) {
            values.push(await options.nth(i).textContent);
        }
        return values;
    }

    async selectByIndex(index) {
        await this.waitUntilComponentIsExisting();
        const selector = await this.getSelector().nth(index);
        await t.click(selector);
    }
}

export default Checkbox;
