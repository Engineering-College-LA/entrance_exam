import fs from 'fs';
import path from 'path';

function searchDir(dir, query) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'package-lock.json') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchDir(fullPath, query);
    } else {
      // Check if it's a text file
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.toLowerCase().includes(query.toLowerCase())) {
          console.log(`Match in ${fullPath}:`);
          const lines = content.split('\n');
          lines.forEach((line, idx) => {
            if (line.toLowerCase().includes(query.toLowerCase())) {
              console.log(`  Line ${idx + 1}: ${line.trim()}`);
            }
          });
        }
      } catch (e) {
        // Skip binaries
      }
    }
  }
}

console.log('Searching for "сворачивать" in all files...');
searchDir('c:\\Users\\DAUD.TUFGAMING\\entrance_exam', 'сворачивать');
console.log('Done.');
