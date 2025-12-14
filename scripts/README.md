# Scripts Directory

This directory contains utility scripts for managing and updating the KeMU content data.

## Available Scripts

### `fetch-content.js`

Fetches content from all remaining URLs in `kemu_content.json` that have empty `details` arrays.

**Usage:**
```bash
npm run fetch-content
```

**What it does:**
- Scans `kemu_content.json` for entries with empty `details` arrays
- Fetches HTML content from each URL
- Extracts meaningful content (headings, lists, paragraphs, tables)
- Updates the JSON file with extracted details
- Saves progress after each entry
- Continues until all entries are processed

**Features:**
- Processes entries sequentially with delays to avoid overwhelming servers
- Handles errors gracefully
- Saves progress after each entry
- Provides detailed console output

### `check-progress.js`

Checks the progress of content fetching by reporting how many entries have been filled.

**Usage:**
```bash
npm run check-progress
```

**What it does:**
- Analyzes `kemu_content.json`
- Counts total entries, filled entries, and empty entries
- Displays a progress report with percentages
- Lists all entries that still need content

## Running Scripts

All scripts can be run using npm:

```bash
# Fetch content from remaining URLs
npm run fetch-content

# Check progress
npm run check-progress
```

Or directly with Node.js:

```bash
node scripts/fetch-content.js
node scripts/check-progress.js
```

## Notes

- The fetching script includes delays (2 seconds between requests) to be respectful to the server
- Progress is saved after each entry, so you can safely stop and resume
- Failed fetches are marked with empty arrays to avoid infinite retries
- The script will continue iterating until all entries are processed or a maximum iteration limit is reached
