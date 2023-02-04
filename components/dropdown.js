'use strict';

import { t } from 'testcafe';
import BaseComponent from './baseComponent';

/**
 * A Dropdown component
 */
class Dropdown extends BaseComponent {
    /**
     * Create Dropdown component
     *
     * @param {string | Selector} selector - The selector to the element
     * @param {string} name - The textual description of the element
     * @param {BaseComponent} parent - A parent of the component. For Page it must be null (e.g. A Button has a parent a Form)
     */
    constructor(selector, name, parent) {
        super(selector, name, 'Dropdown', parent);
    }

    /**
     * Opens dropdown if it isn't already opened
     *
     * @return {Promise<void>}
     */
    async openDropdown() {
        await this.waitUntilComponentIsExisting();
        const classAttr = await this.getSelector().getAttribute('class');

        if (!classAttr.includes('open')) {
            await this.click();
        } else {
            const expandedAttr = await this.getSelector().getAttribute('aria-expanded');
            if (expandedAttr !== 'true' && expandedAttr !== undefined) {
                await this.click();
            }
        }
    }

    /**
     * Select a drop-down element by it's 0-based index within the drop-down
     *
     * @param {string} index - The 0-based index of the element
     * @param {boolean} [closeDropdown=false] - If true then closes dropdown after select
     */
    async selectByIndex(index) {
        await this.waitUntilComponentIsExisting();
        const selector = await this.getSelector().find('.dropdown__list-item').nth(index);
        await t.click(selector);
    }

    /**
     * Retrieve dropdown option values
     *
     * @return {Promise<string[]>}
     */
    async getOptionValues() {
        await this.waitUntilComponentIsExisting();
        const options = await this.getSelector().find('.dropdown__list-item');
        const values = [];
        for ( let i = 0; i < await options.count; i++) {
            values.push(await options.nth(i).textContent);
        }
        return values;
    }
}

export default Dropdown;
