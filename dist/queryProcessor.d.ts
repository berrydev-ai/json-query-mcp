export interface QueryResult {
    data: any;
    count: number;
    query: string;
    executionTime: number;
}
export declare function executeQuery(data: any, query: string): QueryResult;
export declare function aggregateData(data: any[], operation: string, field?: string): number;
//# sourceMappingURL=queryProcessor.d.ts.map