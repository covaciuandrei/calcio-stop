/**
 * @jest-environment jsdom
 */

import 'jest-localstorage-mock';

// Import all test files to ensure they run
import './auth.test.js';
import './badges.test.js';
import './kitTypes.test.js';
import './namesets.test.js';
import './products.test.js';
import './sales.test.js';
import './settings.test.js';
import './teams.test.js';

describe('All CRUD Tests Suite', () => {
  test('should run all CRUD tests', () => {
    // This test ensures all imported test files are executed
    expect(true).toBe(true);
  });
});
