import fs from 'fs';
import path from 'path';

function checkFile(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf-8');
    // Simple check
    console.log(`Successfully read ${filePath}, length: ${code.length}`);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
}

checkFile('./src/services/geminiNlpService.js');
checkFile('./src/components/TravelDetailModal.jsx');
