import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Question } from "../models/question";
import { plainToInstance } from "class-transformer";
import { catchError, map } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { QueryResult } from "../models/queryResult";
import { Answer } from "../models/answer";
import { Attempt } from "../models/attempt";

export class ForQuery {
    dbName: string = '';
    query: string = '';
    questionId!: number;
}

@Injectable({ providedIn: 'root' })
export class QuestionService {

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getQuestion(id: number): Observable<Question> {
        return this.http.get<Question>(`${this.baseUrl}api/questions/${id}`)
            .pipe(map(res => plainToInstance(Question, res)));
    }

    sendAnswer(answer: Answer): Observable<boolean> {
        return this.http.post(`${this.baseUrl}api/answers`, answer)
            .pipe(map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            }));
    }

    executeQuery(dbName: string, query: string, qstId: number): Observable<any> {
        var fq: ForQuery = { dbName: dbName, query: query, questionId: qstId }
        return this.http.post(`${this.baseUrl}api/answers/executeQuery`, fq)
            .pipe(map(res => plainToInstance(QueryResult, res)));
    }

    closeAttempt(attempt: Attempt): Observable<boolean> {
        return this.http.post(`${this.baseUrl}api/attempts/close`, attempt)
            .pipe(map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            }))
    }
}