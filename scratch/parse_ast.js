import fs from 'fs';
import * as parser from '@babel/parser';

const code = fs.readFileSync('./src/components/TravelDetailModal.jsx', 'utf-8');

try {
  parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });
  console.log('JSX PARSE SUCCESS! No Unterminated JSX error in file!');
} catch (err) {
  console.error('PARSE ERROR DETAILS:');
  console.error('Message:', err.message);
  console.error('Line:', err.loc?.line);
  console.error('Column:', err.loc?.column);
}
