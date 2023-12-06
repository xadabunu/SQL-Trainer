import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Question } from "../models/question";
import { plainToInstance } from "class-transformer";
import { map } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class QuestionService {

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getQuestion(id: number) {
        return this.http.get<Question>(`${this.baseUrl}api/questions/${id}`)
            .pipe(map(res => plainToInstance(Question, res)));
    }
}