import { readFile } from 'fs/promises';
import { resolve, isAbsolute } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export async function loadJsonFile(filePath) {
    if (!filePath) {
        throw new Error('File path is required');
    }
    let resolvedPath;
    if (isAbsolute(filePath)) {
        resolvedPath = resolve(filePath);
    }
    else {
        throw new Error('You must provide an absolute path to the JSON file');
    }
    if (!resolvedPath.endsWith('.json')) {
        throw new Error('Only .json files are supported');
    }
    try {
        const content = await readFile(resolvedPath, 'utf-8');
        return JSON.parse(content);
    }
    catch (error) {
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
export async function validateJsonFile(filePath) {
    try {
        await loadJsonFile(filePath);
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=jsonManager.js.map