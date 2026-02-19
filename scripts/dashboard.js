/**
 * dashboard.js
 * Handles calculating stats and rendering the dashboard chart.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const totalRecordsDisplay = document.getElementById('total-records-display');
    const totalAmountDisplay = document.getElementById('total-amount-display');
    const topCategoryDisplay = document.getElementById('top-category-display');
    const chartContainer = document.getElementById('weekly-chart');

    const records = window.FinanceStorage.getRecords();

    // --- 1. Calculate Stats ---

    // Total Records
    const totalRecords = records.length;
    totalRecordsDisplay.textContent = totalRecords;

    // Total Amount (Net Balance)
    // Assuming "amount" in record is just a number. 
    // Usually Income is positive, Expense is negative in the record data if stored that way.
    // If stored as absolute numbers, we need to check category.
    // Based on `add.js` logic: "amount: parseFloat(amount)". It doesn't seem to negate it for expenses automatically.
    // However, in `records.js`: `const amountPrefix = record.category.toLowerCase() === 'income' ? '+' : '-';`
    // This implies stored amount is positive, and we treat it based on category.

    let totalAmount = 0;
    const categoryCounts = {};

    records.forEach(record => {
        // Amount Calculation
        if (record.category.toLowerCase() === 'income') {
            totalAmount += record.amount;
        } else {
            totalAmount -= record.amount;
        }

        // Category Count
        const cat = record.category;
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const formatCurrency = (num) => {
        return (num < 0 ? '-' : '') + '$' + Math.abs(num).toFixed(2);
    };

    totalAmountDisplay.textContent = formatCurrency(totalAmount);
    if (totalAmount >= 0) {
        totalAmountDisplay.classList.remove('negative');
        totalAmountDisplay.classList.add('positive');
    } else {
        totalAmountDisplay.classList.remove('positive');
        totalAmountDisplay.classList.add('negative');
    }

    // Top Category
    let topCategory = '-';
    let maxCount = 0;

    for (const [cat, count] of Object.entries(categoryCounts)) {
        if (count > maxCount) {
            maxCount = count;
            topCategory = cat;
        }
    }
    topCategoryDisplay.textContent = topCategory;


    // --- 2. Last 7-Days Trend Chart ---

    // Get last 7 days inclusive of today
    const days = [];
    const spendingMap = {}; // Date string -> Total Spending (absolute)

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
        days.push({
            date: dateStr,
            label: d.toLocaleDateString('en-US', { weekday: 'short' }) // Mon, Tue...
        });
        spendingMap[dateStr] = 0;
    }

    // Aggregate Spending (Expenses only usually for trend charts, or Net? 
    // "total spendings for each day" implies EXPENSES. 
    // "spending" usually means money going out. I will sum absolute value of expenses.)
    records.forEach(record => {
        if (record.category.toLowerCase() !== 'income') {
            if (spendingMap.hasOwnProperty(record.date)) {
                spendingMap[record.date] += record.amount;
            }
        }
    });

    // Find max value for scaling
    let maxSpending = 0;
    Object.values(spendingMap).forEach(val => {
        if (val > maxSpending) maxSpending = val;
    });

    // Render Chart
    chartContainer.innerHTML = '';

    days.forEach(day => {
        const amount = spendingMap[day.date];
        // simple linear scale: (amount / max) * 100
        // If max is 0, height is 0.
        let percent = 0;
        if (maxSpending > 0) {
            percent = (amount / maxSpending) * 100;
        }

        // Cap at 100% just in case (though math says it shouldn't exceed)
        if (percent > 100) percent = 100;

        const barGroup = document.createElement('div');
        barGroup.className = 'chart-bar-group';
        barGroup.innerHTML = `
            <div class="bar" style="height: ${percent}%" title="$${amount.toFixed(2)}"></div>
            <span class="chart-label">${day.label}</span>
        `;
        chartContainer.appendChild(barGroup);
    });
});
