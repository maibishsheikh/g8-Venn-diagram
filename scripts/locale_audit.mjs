// scripts/locale_audit.mjs
// Conforms to TRD §4.4 & §12.18 (Locale-neutrality and English-names audit M1, M2, G1)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 1. Forbidden terms (case-insensitive unless specified)
const FORBIDDEN_PATTERNS = [
  // Legacy / non-English draft character names (TRD §4.4)
  /\bJia\s*Wei\b/i,
  /\bNurul\b/i,
  /\bAisha\b/i,
  /\bChen\b/,
  /\bDev\b/,
  /\bFarah\b/i,

  // Regional school terminology & currency
  /\bCCA\b/,
  /\bHDB\b/,
  /\bMOE\b/,
  /\bSinglish\b/i,
  /\bSGD\b/,
  /S\$/,

  // Country / framework names forbidden in src/ and user-facing text
  /\bSingapore\b/i,
  /\bSingaporean\b/i,
  /\bCambridge\b/i,
  /\bCommon\s+Core\b/i,
  /\bNCERT\b/i,

  // Non-Intellia level labels (TRD §4.4)
  /\bSecondary\s+[0-9]\b/i,
  /\bSec\s+[0-9]\b/i,
  /\bPrimary\s+[0-9]\b/i,
  /\bPri\s+[0-9]\b/i,
  /\bYear\s+[0-9]\b/i,
  /\bClass\s+[0-9]\b/i,
];

// Folders and files to scan
const SCAN_TARGETS = ['src', 'public', 'index.html', 'README.md', 'scripts/generate_audio.js'];
const IGNORED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.svg', '.zip', '.ico', '.woff', '.woff2'];

function getFilesToScan(dirOrFile) {
  const fullPath = path.resolve(projectRoot, dirOrFile);
  if (!fs.existsSync(fullPath)) return [];

  const stat = fs.statSync(fullPath);
  if (stat.isFile()) {
    const ext = path.extname(fullPath).toLowerCase();
    if (!IGNORED_EXTENSIONS.includes(ext)) {
      return [fullPath];
    }
    return [];
  }

  const results = [];
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) continue;
    const subPath = path.join(fullPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...getFilesToScan(subPath));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (!IGNORED_EXTENSIONS.includes(ext)) {
        results.push(subPath);
      }
    }
  }
  return results;
}

let violations = 0;

console.log('🔍 Running Locale & Name Audit (M1, M2, G1)...');

// 1. Scan files for forbidden patterns
for (const target of SCAN_TARGETS) {
  const files = getFilesToScan(target);
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, lineNum) => {
      for (const pattern of FORBIDDEN_PATTERNS) {
        if (pattern.test(line)) {
          const relPath = path.relative(projectRoot, file);
          console.error(`❌ [Violation] ${relPath}:${lineNum + 1} matches forbidden pattern ${pattern}`);
          console.error(`   Content: ${line.trim()}`);
          violations++;
        }
      }
    });
  }
}

// 2. Audit namePool.js
const namePoolPath = path.resolve(projectRoot, 'src/data/namePool.js');
if (!fs.existsSync(namePoolPath)) {
  console.error('❌ [Violation] Missing src/data/namePool.js');
  violations++;
} else {
  const namePoolContent = fs.readFileSync(namePoolPath, 'utf-8');
  const EXPECTED_NAMES = [
    'Amy', 'Ava', 'Ben', 'Chloe', 'Dan', 'Ella', 'Fiona', 'Grace',
    'Harry', 'Isla', 'Jake', 'Kate', 'Liam', 'Mia', 'Noah', 'Olivia',
    'Sam', 'Tom', 'Zoe', 'Ruby', 'Leo', 'Lucy', 'Max', 'Ned',
    'Nina', 'Owen', 'Rose', 'Ryan', 'Sophie', 'Will', 'Adam', 'Beth',
    'Cara', 'Dylan', 'Evie', 'Finn', 'Gwen', 'Hugo', 'Iris', 'Joe',
    'Kyle', 'Lara', 'Matt', 'Nora', 'Oscar', 'Paul', 'Pete', 'Tess'
  ];

  for (const name of EXPECTED_NAMES) {
    if (!namePoolContent.includes(`'${name}'`)) {
      console.error(`❌ [Violation] Expected name '${name}' not found in namePool.js`);
      violations++;
    }
  }
}

// 3. Audit characters.config.js
const charPath = path.resolve(projectRoot, 'src/config/characters.config.js');
if (!fs.existsSync(charPath)) {
  console.error('❌ [Violation] Missing src/config/characters.config.js');
  violations++;
} else {
  const charContent = fs.readFileSync(charPath, 'utf-8');
  if (!charContent.includes('Jack') || !charContent.includes('Emma') || !charContent.includes('Pixel')) {
    console.error('❌ [Violation] characters.config.js must define Jack, Emma, and Pixel');
    violations++;
  }
}

if (violations === 0) {
  console.log('✅ Locale & Name Audit Passed! 0 violations found.');
  process.exit(0);
} else {
  console.error(`\n💥 Audit Failed with ${violations} violation(s).`);
  process.exit(1);
}
