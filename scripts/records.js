/**
 * records.js
 * Handles displaying, editing, and deleting financial records.
 */

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('.records-table tbody');
    const searchInput = document.getElementById('search-input');

    // Regex patterns for validation during edit
    const descriptionRegex = /^\S(?:.*\S)?$/;
    const amountRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    const categoryRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

    function renderRecords(filterText = '') {
        const records = window.FinanceStorage.getRecords();
        tableBody.innerHTML = '';

        const filteredRecords = records.filter(record => {
            const text = filterText.toLowerCase();
            return (
                record.description.toLowerCase().includes(text) ||
                record.amount.toString().includes(text) ||
                record.category.toLowerCase().includes(text) ||
                record.date.includes(text)
            );
        });

        if (filteredRecords.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" style="text-align:center;">No records found.</td>`;
            tableBody.appendChild(row);
            return;
        }

        filteredRecords.forEach(record => {
            const row = document.createElement('tr');
            row.dataset.id = record.id;

            // Format amount
            const amountClass = record.category.toLowerCase() === 'income' ? 'positive' : 'negative';
            const amountPrefix = record.category.toLowerCase() === 'income' ? '+' : '-';
            const displayAmount = `${amountPrefix}$${record.amount.toFixed(2)}`;

            row.innerHTML = `
                <td class="cell-date">${record.date}</td>
                <td class="cell-desc">${record.description}</td>
                <td class="cell-cat"><span class="badge category-${record.category.toLowerCase()}">${record.category}</span></td>
                <td class="cell-amount ${amountClass}">${displayAmount}</td>
                <td class="cell-actions">
                    <button class="btn-icon edit-btn" aria-label="Edit transaction">✎</button>
                    <button class="btn-icon danger delete-btn" aria-label="Delete transaction">🗑</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    }

    // Initial Render
    renderRecords();

    // Search Functionality
    searchInput.addEventListener('input', (e) => {
        renderRecords(e.target.value);
    });

    // Event Delegation for Actions
    tableBody.addEventListener('click', (e) => {
        const target = e.target;
        const row = target.closest('tr');
        if (!row) return;

        const id = row.dataset.id;

        // Delete Action
        if (target.closest('.delete-btn')) {
            if (confirm('Are you sure you want to delete this record?')) {
                window.FinanceStorage.deleteRecord(id);
                renderRecords(searchInput.value);
            }
        }

        // Edit Action
        if (target.closest('.edit-btn')) {
            enableEditMode(row);
        }

        // Save Action (dynamically added)
        if (target.closest('.save-btn')) {
            saveEdit(row);
        }

        // Cancel Action (dynamically added)
        if (target.closest('.cancel-btn')) {
            renderRecords(searchInput.value); // Re-render to revert changes
        }
    });

    function enableEditMode(row) {
        const id = row.dataset.id;
        const records = window.FinanceStorage.getRecords();
        const record = records.find(r => r.id === id);

        if (!record) return;

        // Replace cells with inputs
        row.innerHTML = `
            <td><input type="date" class="edit-date" value="${record.date}" required></td>
            <td><input type="text" class="edit-desc" value="${record.description}" required></td>
            <td>
                <select class="edit-cat">
                    <option value="Food" ${record.category === 'Food' ? 'selected' : ''}>Food</option>
                    <option value="Books" ${record.category === 'Books' ? 'selected' : ''}>Books</option>
                    <option value="Transport" ${record.category === 'Transport' ? 'selected' : ''}>Transport</option>
                    <option value="Entertainment" ${record.category === 'Entertainment' ? 'selected' : ''}>Entertainment</option>
                    <option value="Fees" ${record.category === 'Fees' ? 'selected' : ''}>Fees</option>
                    <option value="Other" ${record.category === 'Other' ? 'selected' : ''}>Other</option>
                    <option value="Income" ${record.category === 'Income' ? 'selected' : ''}>Income</option>
                </select>
            </td>
            <td><input type="number" class="edit-amount" value="${record.amount}" step="0.01" min="0" required></td>
            <td>
                <button class="btn-icon save-btn" aria-label="Save changes">💾</button>
                <button class="btn-icon danger cancel-btn" aria-label="Cancel editing">❌</button>
            </td>
        `;
    }

    function saveEdit(row) {
        const id = row.dataset.id;
        const dateInput = row.querySelector('.edit-date');
        const descInput = row.querySelector('.edit-desc');
        const catInput = row.querySelector('.edit-cat');
        const amountInput = row.querySelector('.edit-amount');

        const date = dateInput.value;
        const description = descInput.value;
        const category = catInput.value;
        const amount = amountInput.value;

        // Validation
        let isValid = true;
        let errorMessage = "";

        if (!descriptionRegex.test(description)) {
            isValid = false;
            errorMessage += "Invalid Description.\n";
            descInput.style.borderColor = "red";
        }
        if (!amountRegex.test(amount)) {
            isValid = false;
            errorMessage += "Invalid Amount.\n";
            amountInput.style.borderColor = "red";
        }
        // Category from select is usually safe, but good to check if we allowed free text
        if (!categoryRegex.test(category)) {
            isValid = false;
            errorMessage += "Invalid Category.\n";
            catInput.style.borderColor = "red";
        }
        if (!date) {
            isValid = false;
            errorMessage += "Date is required.\n";
            dateInput.style.borderColor = "red";
        }

        if (!isValid) {
            alert(errorMessage);
            return;
        }

        // Update Record
        window.FinanceStorage.updateRecord(id, {
            date,
            description,
            category,
            amount: parseFloat(amount)
        });

        // Re-render
        renderRecords(searchInput.value);
    }
});
