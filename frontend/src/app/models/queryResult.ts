export class QueryResult {
    public isCorrect!: boolean;
    public sqlError?: string;
    public errors: string[] = [];
    public rowCount: number = -1;
    public columnCount: number = -1;
    public columns: string[] = [];
    public data: string[][] = [];
}