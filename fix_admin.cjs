const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pages', 'Admin.tsx');
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log('Original lines:', lines.length);

// Step 1: Add import for VacancyManagement after axios import
let importInsertLine = -1;
for (let i = 0; i < 20; i++) {
  if (lines[i].includes("import axios from 'axios'")) {
    importInsertLine = i;
    break;
  }
}

if (importInsertLine > 0) {
  lines.splice(importInsertLine + 1, 0, "import VacancyManagement from '../components/VacancyManagement';");
  console.log('Added VacancyManagement import after line', importInsertLine + 1);
}

// Step 2: Find vacancy tab and replace with null  
// Find: ) : activeTab === 'vacancies' ? (
// Replace entire block until: ) : activeTab === 'inbox' ? (
let vacancyStart = -1;
let inboxStart = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes(") : activeTab === 'vacancies' ?")) {
    vacancyStart = i;
    console.log('Found vacancy start at line', i + 1);
  }
  if (lines[i].includes(") : activeTab === 'inbox' ?") && vacancyStart > 0 && inboxStart === -1) {
    inboxStart = i;
    console.log('Found inbox start at line', i + 1);
    break;
  }
}

if (vacancyStart > 0 && inboxStart > 0) {
  // Remove lines from vacancyStart to inboxStart-1
  const linesToRemove = inboxStart - vacancyStart;
  console.log('Removing', linesToRemove, 'lines of vacancy code');

  // Replace vacancy block with null branch
  lines.splice(vacancyStart, linesToRemove, "                      ) : activeTab === 'vacancies' ? null");
  console.log('Replaced vacancy block with null');
}

// Step 3: Find where to add VacancyManagement component
// Find: {/* Delete Confirmation Modal */}
// Add before this line
let deleteModalLine = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('{/* Delete Confirmation Modal */}')) {
    deleteModalLine = i;
    console.log('Found Delete Modal at line', i + 1);
    break;
  }
}

if (deleteModalLine > 0) {
  const vacancyComponent = `
          {/* Vacancies Tab - Using VacancyManagement Component */}
          {activeTab === 'vacancies' && (
            <VacancyManagement
              vacancies={vacancies}
              onRefreshData={refreshData}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
              editMode={editMode}
              setEditMode={setEditMode}
              token={getStorageItem(STORAGE_KEYS.TOKEN)}
            />
          )}
`;
  lines.splice(deleteModalLine, 0, vacancyComponent);
  console.log('Added VacancyManagement component render');
}

console.log('New total lines:', lines.length);

// Write updated file
fs.writeFileSync(filePath, lines.join('\n'));
console.log('File updated successfully!');
