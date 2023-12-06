import { Type } from "class-transformer";

export class Answer {
    id?: number;
    sql: string = '';
    @Type(() => Date)
    timestamp?: Date;
    isCorrect: boolean = false;
}