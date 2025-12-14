import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const contentFile = join(__dirname, '..', 'kemu_content.json');

const content = JSON.parse(fs.readFileSync(contentFile, 'utf-8'));

let emptyCount = 0;
let totalCount = 0;
let filledCount = 0;
const emptyEntries = [];

for (const [cat, data] of Object.entries(content)) {
  if (Array.isArray(data)) {
    data.forEach(item => {
      totalCount++;
      if (!item.details || item.details.length === 0) {
        emptyCount++;
        emptyEntries.push(`${cat}: ${item.title}`);
      } else {
        filledCount++;
      }
    });
  } else if (typeof data === 'object') {
    for (const [subcat, subdata] of Object.entries(data)) {
      if (Array.isArray(subdata)) {
        subdata.forEach(item => {
          totalCount++;
          if (!item.details || item.details.length === 0) {
            emptyCount++;
            emptyEntries.push(`${cat}/${subcat}: ${item.title}`);
          } else {
            filledCount++;
          }
        });
      }
    }
  }
}

const percentage = ((filledCount / totalCount) * 100).toFixed(1);

console.log('\n' + '='.repeat(70));
console.log('CONTENT PROGRESS REPORT');
console.log('='.repeat(70));
console.log(`Total entries: ${totalCount}`);
console.log(`Entries with details: ${filledCount} (${percentage}%)`);
console.log(`Empty entries: ${emptyCount} (${(100 - percentage).toFixed(1)}%)`);
console.log('='.repeat(70));

if (emptyEntries.length > 0) {
  console.log(`\nEmpty entries (${emptyEntries.length}):`);
  emptyEntries.forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
} else {
  console.log('\n✓ All entries have been processed!');
}

console.log('');
