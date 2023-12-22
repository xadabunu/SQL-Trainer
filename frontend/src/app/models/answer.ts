import { Type } from "class-transformer";
import { Question } from "./question";
import { Attempt } from "./attempt";

export class Answer {
    id?: number;
    sql: string = '';
    @Type(() => Date)
    timestamp!: Date;
    isCorrect: boolean = false;
    question?: Question;
    attempt!: Attempt;
}