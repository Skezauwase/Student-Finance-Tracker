/**
 * storage.js
 * Handles interactions with localStorage for the Student Finance Tracker.
 */

const STORAGE_KEY = 'finance_tracker_records';

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

// Expose functions to the global scope
window.FinanceStorage = {
    getRecords,
    saveRecord,
    updateRecord,
    deleteRecord
};
