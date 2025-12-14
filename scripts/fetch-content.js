import fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const contentFile = join(__dirname, '..', 'kemu_content.json');
const logFile = join(__dirname, '..', 'fetch-content.log');

// Logging function
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  try {
    process.stdout.write(logMessage);
  } catch (e) {
    // Ignore stdout errors
  }
  try {
    fs.appendFileSync(logFile, logMessage);
  } catch (e) {
    // Try to create file if it doesn't exist
    try {
      fs.writeFileSync(logFile, logMessage);
    } catch (e2) {
      // Ignore if still fails
    }
  }
}

// Initialize log file
try {
  fs.writeFileSync(logFile, `Fetch started at ${new Date().toISOString()}\n\n`);
} catch (e) {
  // Ignore
}

// Read content
let content = JSON.parse(fs.readFileSync(contentFile, 'utf-8'));
log('✓ Loaded kemu_content.json');

// Extract details function
function extractDetails(html) {
  const $ = cheerio.load(html);
  $('script, style, nav, footer, header, .menu, .sidebar, .widget').remove();
  
  const details = [];
  const seen = new Set();
  
  // Headings
  $('h1, h2, h3, h4, h5').each((i, elem) => {
    const text = $(elem).text().trim();
    if (text.length > 5 && text.length < 200) {
      const key = text.substring(0, 40).toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        details.push(text);
      }
    }
  });
  
  // List items
  $('ul li, ol li').each((i, elem) => {
    const text = $(elem).text().trim();
    if (text.length > 10 && text.length < 300) {
      const key = text.substring(0, 40).toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        details.push(text);
      }
    }
  });
  
  // Paragraphs
  $('p').each((i, elem) => {
    const text = $(elem).text().trim();
    if (text.length > 30 && text.length < 400) {
      const key = text.substring(0, 40).toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        details.push(text);
      }
    }
  });
  
  // Table rows
  $('table tr').each((i, elem) => {
    const cells = $(elem).find('td, th').map((j, cell) => $(cell).text().trim()).get();
    const rowText = cells.filter(c => c.length > 3).join(' - ');
    if (rowText.length > 10 && rowText.length < 300) {
      const key = rowText.substring(0, 40).toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        details.push(rowText);
      }
    }
  });
  
  return details.slice(0, 30);
}

// Find all empty entries
function findAllEmpty() {
  const entries = [];
  
  for (const [category, categoryData] of Object.entries(content)) {
    if (Array.isArray(categoryData)) {
      categoryData.forEach((item, index) => {
        if (!item.details || item.details.length === 0) {
          entries.push({ item, category, index, isNested: false });
        }
      });
    } else if (typeof categoryData === 'object' && categoryData !== null) {
      for (const [subcategory, subcategoryData] of Object.entries(categoryData)) {
        if (Array.isArray(subcategoryData)) {
          subcategoryData.forEach((item, index) => {
            if (!item.details || item.details.length === 0) {
              entries.push({ item, category, subcategory, index, isNested: true });
            }
          });
        }
      }
    }
  }
  
  return entries;
}

// Update entry
function updateEntry(entry, details) {
  if (entry.isNested) {
    content[entry.category][entry.subcategory][entry.index].details = details;
  } else {
    content[entry.category][entry.index].details = details;
  }
}

// Save content
function save() {
  fs.writeFileSync(contentFile, JSON.stringify(content, null, 2), 'utf-8');
}

// Fetch URL
async function fetchUrl(url, title) {
  try {
    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      maxRedirects: 5
    });
    
    if (response.status === 200) {
      return extractDetails(response.data);
    }
    return [];
  } catch (error) {
    return null; // null = error
  }
}

// Main
async function main() {
  log('='.repeat(70));
  log('FETCHING ALL REMAINING ENTRIES');
  log('='.repeat(70));
  
  let totalProcessed = 0;
  let totalSuccess = 0;
  let totalErrors = 0;
  
  // Keep processing until done
  for (let iteration = 1; iteration <= 10; iteration++) {
    const entries = findAllEmpty();
    
    if (entries.length === 0) {
      log('\n✓ ALL ENTRIES PROCESSED!');
      break;
    }
    
    log(`\nIteration ${iteration}: Processing ${entries.length} entries\n`);
    
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      totalProcessed++;
      
      log(`[${i + 1}/${entries.length}] ${entry.item.title}`);
      log(`  URL: ${entry.item.url}`);
      
      const details = await fetchUrl(entry.item.url, entry.item.title);
      
      if (details === null) {
        log(`  ✗ Error fetching`);
        totalErrors++;
        // Mark as processed with empty array to avoid retrying
        updateEntry(entry, []);
      } else if (details.length > 0) {
        updateEntry(entry, details);
        log(`  ✓ Extracted ${details.length} details`);
        totalSuccess++;
      } else {
        log(`  ⚠ No content extracted`);
        updateEntry(entry, []); // Mark as processed
      }
      
      // Save after each entry
      save();
      log(`  ✓ Saved progress`);
      
      // Delay
      if (i < entries.length - 1) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    
    // Check if done
    const remaining = findAllEmpty().length;
    if (remaining === 0) {
      log('\n✓ ALL ENTRIES PROCESSED!');
      break;
    }
    
    log(`\nRemaining: ${remaining} entries`);
    log('Waiting 3 seconds before next iteration...\n');
    await new Promise(r => setTimeout(r, 3000));
  }
  
  const finalEmpty = findAllEmpty().length;
  
  log('\n' + '='.repeat(70));
  log('FINAL SUMMARY');
  log('='.repeat(70));
  log(`Total processed: ${totalProcessed}`);
  log(`Successfully fetched: ${totalSuccess}`);
  log(`Errors: ${totalErrors}`);
  log(`Remaining empty: ${finalEmpty}`);
  log('='.repeat(70));
  
  save();
  log('\n✓ Content saved to kemu_content.json');
  log(`\nCompleted at ${new Date().toISOString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
