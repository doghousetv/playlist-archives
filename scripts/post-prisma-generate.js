#!/usr/bin/env node

/**
 * Post-Prisma Generate Script
 * Creates .js symlinks for .ts files to fix Turbopack module resolution
 */

const fs = require('fs');
const path = require('path');

const generatedDir = path.join(__dirname, '../generated/prisma');

// Files that need .js symlinks
const filesToLink = [
  'enums.ts',
  'internal/class.ts',
  'internal/prismaNamespace.ts',
];

function createSymlink(source, target) {
  try {
    if (fs.existsSync(target)) {
      fs.unlinkSync(target);
    }

    fs.symlinkSync(path.basename(source), target, 'file');
    console.log(`✓ Created symlink: ${target} -> ${source}`);
  } catch (error) {
    console.error(`✗ Failed to create symlink ${target}:`, error.message);
  }
}

filesToLink.forEach((file) => {
  const sourcePath = path.join(generatedDir, file);
  const targetPath = path.join(generatedDir, file.replace('.ts', '.js'));
  
  if (fs.existsSync(sourcePath)) {
    createSymlink(sourcePath, targetPath);
  } else {
    console.warn(`⚠ Source file not found: ${sourcePath}`);
  }
});

console.log('Post-Prisma generate script completed');

