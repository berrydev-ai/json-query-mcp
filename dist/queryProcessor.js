import { JSONPath } from 'jsonpath-plus';
export function executeQuery(data, query) {
    const startTime = Date.now();
    if (!query || query.trim() === '') {
        return {
            data,
            count: Array.isArray(data) ? data.length : 1,
            query: '$',
            executionTime: Date.now() - startTime,
        };
    }
    try {
        const result = processJsonPathQuery(data, query.trim());
        return {
            data: result,
            count: Array.isArray(result) ? result.length : 1,
            query,
            executionTime: Date.now() - startTime,
        };
    }
    catch (error) {
        throw new Error(`JSONPath query execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
function processJsonPathQuery(data, query) {
    try {
        const result = JSONPath({ path: query, json: data });
        if (result.length === 0) {
            return null;
        }
        if (result.length === 1) {
            return result[0];
        }
        return result;
    }
    catch (error) {
        throw new Error(`Invalid JSONPath expression: ${query}`);
    }
}
export function aggregateData(data, operation, field) {
    if (!Array.isArray(data)) {
        return 0;
    }
    switch (operation.toLowerCase()) {
        case 'count':
            return data.length;
        case 'sum':
            if (!field)
                return 0;
            return data.reduce((sum, item) => {
                const value = getNestedValue(item, field);
                return sum + (Number(value) || 0);
            }, 0);
        case 'avg':
        case 'average': {
            if (!field)
                return 0;
            const sum = data.reduce((sum, item) => {
                const value = getNestedValue(item, field);
                return sum + (Number(value) || 0);
            }, 0);
            return sum / data.length;
        }
        case 'min': {
            if (!field)
                return 0;
            const values = data.map(item => Number(getNestedValue(item, field))).filter(v => !isNaN(v));
            return Math.min(...values);
        }
        case 'max': {
            if (!field)
                return 0;
            const maxValues = data.map(item => Number(getNestedValue(item, field))).filter(v => !isNaN(v));
            return Math.max(...maxValues);
        }
        default:
            return 0;
    }
}
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
}
//# sourceMappingURL=queryProcessor.js.map