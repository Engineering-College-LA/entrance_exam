import fs from 'fs';

const logFile = 'C:\\Users\\DAUD.TUFGAMING\\.gemini\\antigravity-ide\\brain\\0ff60ffe-0cbd-4988-b5fb-7cff20488534\\.system_generated\\logs\\transcript_full.jsonl';

try {
  const content = fs.readFileSync(logFile, 'utf8');
  const lines = content.split('\n');

  for (const line of lines) {
    if (!line.trim()) continue;
    const obj = JSON.parse(line);
    const body = JSON.stringify(obj);
    if (body.includes('id=\\"date-dropdown\\"') && body.includes('date-option')) {
      console.log(`--- Match in step ${obj.step_index} (${obj.type}) ---`);
      const startIdx = body.indexOf('id=\\"date-dropdown\\"');
      console.log(body.substring(startIdx, startIdx + 1200));
      break;
    }
  }
} catch (e) {
  console.error(e);
}
