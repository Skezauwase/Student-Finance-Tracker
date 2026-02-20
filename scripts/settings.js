/**
 * settings.js
 * Handles application settings: Theme, Currency, and Data Import/Export.
 * Included on all pages for global theme application.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Global Theme Application ---
    const currentSettings = window.FinanceStorage ? window.FinanceStorage.getSettings() : { theme: 'dark' };
    applyTheme(currentSettings.theme);

    // --- Settings Page Specific Logic ---
    if (window.location.pathname.includes('settings.html')) {
        initializeSettingsPage();
    }
});

/**
 * Applies the selected theme to the document body.
 * @param {string} theme - 'dark' or 'light'
 */
function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
}

/**
 * Initializes listeners and state for the Settings page.
 */
function initializeSettingsPage() {
    const themeToggle = document.getElementById('theme-toggle');
    const currencySelect = document.getElementById('base-currency');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importInput = document.getElementById('import-file');

    const settings = window.FinanceStorage.getSettings();

    // 1. Theme Toggle State
    if (themeToggle) {
        themeToggle.checked = settings.theme === 'light';
        themeToggle.addEventListener('change', (e) => {
            const newTheme = e.target.checked ? 'light' : 'dark';
            settings.theme = newTheme;
            window.FinanceStorage.saveSettings(settings);
            applyTheme(newTheme);
        });
    }

    // 2. Currency Select State
    if (currencySelect) {
        currencySelect.value = settings.currency || 'USD';
        currencySelect.addEventListener('change', (e) => {
            settings.currency = e.target.value;
            window.FinanceStorage.saveSettings(settings);
            // Optional: Reload to apply currency changes if we were caching things, 
            // but for now just saving is enough as other pages read from storage on load.
            alert(`Currency changed to ${settings.currency}. Rates will apply on dashboard/records view.`);
        });
    }

    // 3. Export Data
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const dataStr = window.FinanceStorage.exportData();
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

            const exportFileDefaultName = `finance_data_${new Date().toISOString().split('T')[0]}.json`;

            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        });
    }

    // 4. Import Data
    if (importBtn && importInput) {
        importBtn.addEventListener('click', () => {
            importInput.click();
        });

        importInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    const result = window.FinanceStorage.importData(json);
                    if (result.success) {
                        alert(result.message);
                        // Reset input
                        importInput.value = '';
                    } else {
                        alert(result.message);
                    }
                } catch (error) {
                    console.error('Import Error:', error);
                    alert('Error parsing JSON file. Please make sure specifically that it is a valid JSON file exported from this app.');
                }
            };
            reader.readAsText(file);
        });
    }
}
