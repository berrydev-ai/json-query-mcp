import { readFile } from 'fs/promises';
import { join, resolve, isAbsolute } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEST_DATA_DIR = join(__dirname, '..', 'test-data');

export async function loadJsonFile(filePath: string): Promise<any> {
  if (!filePath) {
    throw new Error('File path is required');
  }

  let resolvedPath: string;

  if (isAbsolute(filePath)) {
    resolvedPath = resolve(filePath);
  } else {
    if (filePath.includes('..')) {
      throw new Error('Relative paths with .. are not allowed');
    }
    
    if (!filePath.endsWith('.json')) {
      filePath += '.json';
    }
    
    resolvedPath = join(TEST_DATA_DIR, filePath);
  }

  if (!resolvedPath.endsWith('.json')) {
    throw new Error('Only .json files are supported');
  }

  try {
    const content = await readFile(resolvedPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('ENOENT')) {
        throw new Error(`File not found: ${resolvedPath}`);
      }
      if (error.message.includes('Unexpected token')) {
        throw new Error(`Invalid JSON in file: ${resolvedPath}`);
      }
      throw new Error(`Failed to load JSON file: ${error.message}`);
    }
    throw new Error(`Failed to load JSON file: ${resolvedPath}`);
  }
}

export async function validateJsonFile(filePath: string): Promise<boolean> {
  try {
    await loadJsonFile(filePath);
    return true;
  } catch {
    return false;
  }
}

export function getTestDataPath(): string {
  return TEST_DATA_DIR;
}