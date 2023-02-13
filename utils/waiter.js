'use strict';

/**
 * Waits until fn returns true
 *
 * @param {Function} fn - The function being called with delay until timeout
 * @param {number} [timeout] - Total time to wait in ms before giving an error. Default value is 3000
 * @param {number} [interval] - Interval between checks in ms. Default value is 50
 * @returns {Promise<boolean>} true if fn returns true before timeout is reached, false otherwise
 * @private
 */
async function waitForTrue(fn, timeout, interval = 50) {
    const finish = Date.now() + timeout;
    while (Date.now() - finish < 0) {
        try {
            const isTrue = await fn();
            if (isTrue) {
                return true;
            }
        } catch (e) {
            console.error('FATAL: waitForTrue\'s fn should not throw an error');
            throw e;
        }
        await new Promise(resolve => setTimeout(resolve, interval));
    }
    return false;
}

module.exports = {
    waitForTrue,
};
