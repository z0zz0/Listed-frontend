import { readdirSync, statSync } from 'node:fs';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';

const srcRoot = resolve('src');
const testRoot = resolve('src', 'test');
const testFilePattern = /\.test\.(ts|tsx)$/;

function walkFiles(dirPath, results) {
  const entries = readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);

    if (entry.isDirectory()) {
      walkFiles(fullPath, results);
      continue;
    }

    if (entry.isFile() && testFilePattern.test(entry.name)) {
      results.push(fullPath);
    }
  }
}

function isInsideDir(basePath, targetPath) {
  const relPath = relative(basePath, targetPath);
  return relPath !== '' && !relPath.startsWith(`..${sep}`) && relPath !== '..' && !isAbsolute(relPath);
}

function toPosixPath(filePath) {
  return filePath.replace(/\\/g, '/');
}

if (!statSync(srcRoot, { throwIfNoEntry: false })) {
  console.error('Unable to find src/ directory.');
  process.exit(1);
}

const allTestFiles = [];
walkFiles(srcRoot, allTestFiles);

const invalidLocations = allTestFiles.filter((filePath) => !isInsideDir(testRoot, filePath));

if (invalidLocations.length > 0) {
  console.error('Test files must live under src/test. Move these files:');
  invalidLocations
    .map((filePath) => toPosixPath(relative(resolve('.'), filePath)))
    .sort()
    .forEach((filePath) => console.error(`- ${filePath}`));
  process.exit(1);
}

console.log('Test location check passed.');
