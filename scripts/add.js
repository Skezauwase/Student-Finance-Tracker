/**
 * add.js
 * Handles the Add Transaction form submission and validation.
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('transaction-form');

    // Regex patterns as per requirements
    const descriptionRegex = /^\S(?:.*\S)?$/;
    const amountRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    const categoryRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Get form values
        const descriptionInput = document.getElementById('description');
        const amountInput = document.getElementById('amount');
        const dateInput = document.getElementById('date'); // Date validation is handled by input type="date"
        const categoryInput = document.getElementById('category');

        const description = descriptionInput.value;
        const amount = amountInput.value;
        const date = dateInput.value;
        const category = categoryInput.value;

        // Reset previous validation styles/messages (conceptually)
        // For now, we will use simple alerts or console logs for invalid inputs, 
        // or just prevent submission if regex fails.
        // A better UX would be to show error messages below inputs.

        let isValid = true;
        let errorMessage = "";

        // Validate Description
        if (!descriptionRegex.test(description)) {
            isValid = false;
            errorMessage += "Invalid Description: Must not have leading/trailing spaces.\n";
            descriptionInput.classList.add('is-invalid');
        } else {
            descriptionInput.classList.remove('is-invalid');
        }

        // Validate Amount
        if (!amountRegex.test(amount)) {
            isValid = false;
            errorMessage += "Invalid Amount: Must be a positive number with up to 2 decimal places.\n";
            amountInput.classList.add('is-invalid');
        } else {
            amountInput.classList.remove('is-invalid');
        }

        // Validate Category
        if (!categoryRegex.test(category)) {
            isValid = false;
            errorMessage += "Invalid Category: Must contain only letters, spaces, or hyphens.\n";
            categoryInput.classList.add('is-invalid');
        } else {
            categoryInput.classList.remove('is-invalid');
        }

        // Validate Date (basic check)
        if (!date) {
            isValid = false;
            errorMessage += "Date is required.\n";
            dateInput.classList.add('is-invalid');
        } else {
            dateInput.classList.remove('is-invalid');
        }

        if (!isValid) {
            alert(errorMessage);
            return;
        }

        // Generate a unique ID (compatible with older browsers/insecure contexts)
        const generateId = () => {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        };

        // Create record object
        const newRecord = {
            id: generateId(),
            description: description,
            amount: parseFloat(amount),
            date: date,
            category: category
        };

        try {
            // Save to localStorage
            if (window.FinanceStorage) {
                window.FinanceStorage.saveRecord(newRecord);
                alert("Transaction added successfully!");
                form.reset();
            } else {
                console.error("Storage module not loaded.");
                alert("Error: Storage module not loaded.");
            }
        } catch (error) {
            console.error("Error saving record:", error);
            alert("An error occurred while saving the transaction.");
        }
    });
});
