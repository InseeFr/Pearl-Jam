import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { initializeSyncDate } from './initialize';

describe('initialize.ts', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        globalThis.localStorage.clear();
    });

    afterEach(() => {
        // Clean up after each test
        globalThis.localStorage.removeItem('LAST_SYNCH_SUCCESS_DATE');
    });

    it('should initialize LAST_SYNCH_SUCCESS_DATE when no value exists', () => {
        // Verify that the key doesn't exist initially
        expect(globalThis.localStorage.getItem('LAST_SYNCH_SUCCESS_DATE')).toBeNull();

        // Call the function
        initializeSyncDate();

        // Verify the value was set correctly
        expect(globalThis.localStorage.getItem('LAST_SYNCH_SUCCESS_DATE')).toBe('no synch yet');
    });

    it('should not override existing LAST_SYNCH_SUCCESS_DATE value', () => {
        // Set an existing value
        const existingValue = '2023-01-01 12:00:00';
        globalThis.localStorage.setItem('LAST_SYNCH_SUCCESS_DATE', existingValue);

        // Verify the existing value is set
        expect(globalThis.localStorage.getItem('LAST_SYNCH_SUCCESS_DATE')).toBe(existingValue);

        // Call the function
        initializeSyncDate();

        // Verify the existing value was not overridden
        expect(globalThis.localStorage.getItem('LAST_SYNCH_SUCCESS_DATE')).toBe(existingValue);
    });
});