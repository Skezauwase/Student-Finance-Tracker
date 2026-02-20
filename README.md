#  Student Finance Tracker

A lightweight, browser-based personal finance tracker built with vanilla HTML, CSS, and JavaScript. No frameworks, no back-end — just open `index.html` and start tracking your money.

---

##  Features

- **Dashboard** — Overview of total records, net balance, top spending category, and a 7-day bar chart of daily expenses
- **Records** — Full transaction table with search, filter by category, and sort by date/amount/category; inline edit and delete
- **Add Transaction** — Form with regex-based validation for description, amount, category, and date
- **Settings** — Toggle between dark/light theme, change display currency, export data as JSON, and import JSON data back
- **About** — Project info page
- **Persistent Storage** — All data is stored in the browser's `localStorage` — no account or server needed
- **Multi-currency Support** — USD, EUR, GBP, RWF with approximate live conversion rates

---

##  Project Structure

```
Student-Finance-Tracker/
├── index.html          # Dashboard page
├── records.html        # Transaction records page
├── add.html            # Add transaction page
├── settings.html       # Settings page
├── about.html          # About page
├── seed.json           # Sample data for import
├── styles/
│   ├── base.css        # CSS variables, reset, typography
│   ├── layout.css      # Header, footer, nav, grid layout
│   └── components.css  # Cards, chart, table, forms, badges
└── scripts/
    ├── storage.js      # localStorage CRUD + import/export API
    ├── dashboard.js    # Stats calculation & bar chart rendering
    ├── records.js      # Filter, sort, inline edit/delete logic
    ├── add.js          # Add transaction form + validation
    └── settings.js     # Theme toggle, currency, data import/export
```

---

##  Getting Started

No build step required.

1. **Clone or download** this repository.
2. Open `index.html` directly in your browser.
3. *(Optional)* To pre-load sample data, go to **Settings → Import Data** and select `seed.json`.

---

##  Data Model

Each transaction record stored in `localStorage` has the following shape:

```json
{
  "id": "unique-string",
  "description": "Lunch at campus",
  "amount": 5.50,
  "date": "2026-02-20",
  "category": "Food"
}
```

**Categories:** `Food`, `Books`, `Transport`, `Entertainment`, `Fees`, `Income`, `Other`

---

##  Settings

| Setting | Options | Default |
|---|---|---|
| Theme | Dark / Light | Dark |
| Currency | USD, EUR, GBP, RWF | USD |
| Export | Downloads `finance_data_YYYY-MM-DD.json` | — |
| Import | Merges JSON records into existing data | — |

---

##  Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic) |
| Styling | Vanilla CSS (custom properties, flexbox, grid) |
| Logic | Vanilla JavaScript (ES6+) |
| Storage | `localStorage` |
| Fonts | [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts |

---

##  Validation Rules

| Field | Rule |
|---|---|
| Description | Must not have leading/trailing whitespace |
| Amount | Positive number, up to 2 decimal places |
| Category | Letters, spaces, or hyphens only |
| Date | Required; uses browser native date picker |

---

##  License

This project is for personal/educational use. Feel free to adapt it for your own needs.
