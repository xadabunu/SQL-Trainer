import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Question } from "../models/question";
import { plainToInstance } from "class-transformer";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { QueryResult } from "../models/queryResult";

export class ForQuery {
    dbName: string = '';
    query: string = '';
    questionId!: number;
}

@Injectable({ providedIn: 'root' })
export class QuestionService {

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getQuestion(id: number) {
        return this.http.get<Question>(`${this.baseUrl}api/questions/${id}`)
            .pipe(map(res => plainToInstance(Question, res)));
    }

    executeQuery(dbName: string, query: string, qstId: number): Observable<any> {
        var temp: ForQuery = { dbName: dbName, query: query, questionId: qstId }
        return this.http.post(`${this.baseUrl}api/databases/executeQuery`, temp)
            .pipe(map(res => plainToInstance(QueryResult, res)));
    }
}