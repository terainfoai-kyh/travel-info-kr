import fs from 'fs';

const code = fs.readFileSync('./src/components/TravelDetailModal.jsx', 'utf-8');
const lines = code.split('\n');

let stack = [];
lines.forEach((line, idx) => {
  const lineNum = idx + 1;
  // find simple div open / close count
  const opens = (line.match(/<div/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  if (opens > 0 || closes > 0) {
    for (let i = 0; i < opens; i++) stack.push({ type: 'div', line: lineNum });
    for (let i = 0; i < closes; i++) {
      if (stack.length > 0) {
        stack.pop();
      } else {
        console.log(`Unmatched close </div> at line ${lineNum}`);
      }
    }
  }
});

console.log(`Remaining unclosed tags count: ${stack.length}`);
if (stack.length > 0) {
  console.log(`First 5 unclosed tags opened at:`, stack.slice(-5));
}
