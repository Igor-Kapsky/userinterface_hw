'use strict';

import BaseComponent from './baseComponent';

/**
* A Label component
*/
class Label extends BaseComponent {
    /**
     * Create Label component
     *
     * @param {string | Selector} selector - The selector to the element
     * @param {string} name - The textual description of the element
     * @param {BaseComponent} parent - A parent of the component. For Page it must be null (e.g. A Button has a parent a Form)
     */
    constructor(selector, name, parent) {
        super(selector, name, 'Label', parent);
    }
}

export default Label;
