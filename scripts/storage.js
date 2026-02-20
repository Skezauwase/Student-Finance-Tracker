/**
 * storage.js
 * Handles interactions with localStorage for the Student Finance Tracker.
 */

const STORAGE_KEY = 'finance_tracker_records';
const SETTINGS_KEY = 'finance_tracker_settings';

/**
 * Retrieves all records from localStorage.
 * @returns {Array} An array of record objects.
 */
function getRecords() {
    const records = localStorage.getItem(STORAGE_KEY);
    return records ? JSON.parse(records) : [];
}

/**
 * Saves a new record to localStorage.
 * @param {Object} record - The record object to save.
 */
function saveRecord(record) {
    const records = getRecords();
    records.push(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

/**
 * Updates an existing record in localStorage.
 * @param {string} id - The unique ID of the record to update.
 * @param {Object} updatedRecord - The updated record object.
 */
function updateRecord(id, updatedRecord) {
    const records = getRecords();
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
        records[index] = { ...records[index], ...updatedRecord };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
}

/**
 * Deletes a record from localStorage.
 * @param {string} id - The unique ID of the record to delete.
 */
function deleteRecord(id) {
    let records = getRecords();
    records = records.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

// --- Settings Management ---

/**
 * Retrieves the current settings.
 * @returns {Object} Settings object (defaults: theme='dark', currency='USD').
 */
function getSettings() {
    const settings = localStorage.getItem(SETTINGS_KEY);
    return settings ? JSON.parse(settings) : { theme: 'dark', currency: 'USD' };
}

/**
 * Saves the settings to local storage.
 * @param {Object} settings - The settings object to save.
 */
function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// --- Import / Export ---

/**
 * Exports data as a JSON string.
 * @returns {string} JSON string of all records.
 */
function exportData() {
    const records = getRecords();
    return JSON.stringify(records, null, 2);
}

/**
 * Imports data from a JSON object.
 * Validates the format before saving.
 * @param {Array} importedRecords - The parsed JSON array of records.
 * @returns {Object} { success: boolean, message: string }
 */
function importData(importedRecords) {
    if (!Array.isArray(importedRecords)) {
        return { success: false, message: "Invalid format: Data must be an array." };
    }

    // Basic validation of the first item (if exists)
    if (importedRecords.length > 0) {
        const sample = importedRecords[0];
        if (!sample.hasOwnProperty('description') || !sample.hasOwnProperty('amount') || !sample.hasOwnProperty('date')) {
            return { success: false, message: "Invalid format: Missing required fields (description, amount, date)." };
        }
    }

    // Merge strategy: Append imported records to existing ones? Or replace?
    // User prompt said "store the uploded values in the localstorage same with the already/none data".
    // This implies appending/merging.
    const currentRecords = getRecords();
    const newRecords = [...currentRecords, ...importedRecords];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));
    return { success: true, message: `Successfully imported ${importedRecords.length} records.` };
}

// Expose functions to the global scope
window.FinanceStorage = {
    getRecords,
    saveRecord,
    updateRecord,
    deleteRecord,
    getSettings,
    saveSettings,
    exportData,
    importData
};
