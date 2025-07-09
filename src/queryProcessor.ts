export interface QueryResult {
  data: any;
  count: number;
  query: string;
  executionTime: number;
}

export function executeQuery(data: any, query: string): QueryResult {
  const startTime = Date.now();
  
  if (!query || query.trim() === '') {
    return {
      data,
      count: Array.isArray(data) ? data.length : 1,
      query: 'all',
      executionTime: Date.now() - startTime,
    };
  }

  try {
    const result = processQuery(data, query.trim());
    
    return {
      data: result,
      count: Array.isArray(result) ? result.length : 1,
      query,
      executionTime: Date.now() - startTime,
    };
  } catch (error) {
    throw new Error(`Query execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function processQuery(data: any, query: string): any {
  const parts = query.toLowerCase().split(/\s+/);
  let result = data;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    
    if (part === 'filter' && parts[i + 1] === 'by') {
      const filterParts = parts.slice(i + 2);
      result = applyFilter(result, filterParts);
      break;
    } else if (part === 'sort' && parts[i + 1] === 'by') {
      const sortField = parts[i + 2];
      const sortOrder = parts[i + 3];
      result = applySort(result, sortField, sortOrder);
      break;
    } else if (part === 'limit') {
      const limitValue = parseInt(parts[i + 1]);
      result = applyLimit(result, limitValue);
      break;
    } else if (part === 'top') {
      const limitValue = parseInt(parts[i + 1]);
      result = applyLimit(result, limitValue);
      i++;
    } else if (part === 'count') {
      return Array.isArray(result) ? result.length : 1;
    } else if (part === 'first') {
      return Array.isArray(result) ? result[0] : result;
    } else if (part === 'last') {
      return Array.isArray(result) ? result[result.length - 1] : result;
    }
  }

  return result;
}

function applyFilter(data: any, filterParts: string[]): any {
  if (!Array.isArray(data)) {
    return data;
  }

  if (filterParts.length < 3) {
    return data;
  }

  const field = filterParts[0];
  const operator = filterParts[1];
  const value = filterParts.slice(2).join(' ').replace(/['"]/g, '');

  return data.filter((item: any) => {
    const fieldValue = getNestedValue(item, field);
    
    switch (operator) {
      case '=':
      case '==':
        return String(fieldValue).toLowerCase() === value.toLowerCase();
      case '!=':
        return String(fieldValue).toLowerCase() !== value.toLowerCase();
      case '>':
        return Number(fieldValue) > Number(value);
      case '>=':
        return Number(fieldValue) >= Number(value);
      case '<':
        return Number(fieldValue) < Number(value);
      case '<=':
        return Number(fieldValue) <= Number(value);
      case 'contains':
        return String(fieldValue).toLowerCase().includes(value.toLowerCase());
      case 'startswith':
        return String(fieldValue).toLowerCase().startsWith(value.toLowerCase());
      case 'endswith':
        return String(fieldValue).toLowerCase().endsWith(value.toLowerCase());
      default:
        return String(fieldValue).toLowerCase() === value.toLowerCase();
    }
  });
}

function applySort(data: any, field: string, order: string = 'asc'): any {
  if (!Array.isArray(data)) {
    return data;
  }

  const sortedData = [...data].sort((a, b) => {
    const aValue = getNestedValue(a, field);
    const bValue = getNestedValue(b, field);
    
    if (aValue < bValue) return order === 'desc' ? 1 : -1;
    if (aValue > bValue) return order === 'desc' ? -1 : 1;
    return 0;
  });

  return sortedData;
}

function applyLimit(data: any, limit: number): any {
  if (!Array.isArray(data)) {
    return data;
  }

  return data.slice(0, limit);
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

export function aggregateData(data: any[], operation: string, field?: string): number {
  if (!Array.isArray(data)) {
    return 0;
  }

  switch (operation.toLowerCase()) {
    case 'count':
      return data.length;
    case 'sum':
      if (!field) return 0;
      return data.reduce((sum, item) => sum + (Number(getNestedValue(item, field)) || 0), 0);
    case 'avg':
    case 'average':
      if (!field) return 0;
      const sum = data.reduce((sum, item) => sum + (Number(getNestedValue(item, field)) || 0), 0);
      return sum / data.length;
    case 'min':
      if (!field) return 0;
      const values = data.map(item => Number(getNestedValue(item, field))).filter(v => !isNaN(v));
      return Math.min(...values);
    case 'max':
      if (!field) return 0;
      const maxValues = data.map(item => Number(getNestedValue(item, field))).filter(v => !isNaN(v));
      return Math.max(...maxValues);
    default:
      return 0;
  }
}