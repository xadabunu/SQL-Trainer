import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Quizz } from '../models/quizz';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';

@Injectable({ providedIn: 'root' })
export class QuizzService {
	constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

	getAll(): Observable<Quizz[]> {
		return this.http.get<any[]>(`${this.baseUrl}api/quizzes`)
			.pipe(map(res => plainToInstance(Quizz, res)));
	}

	getTrainings(): Observable<Quizz[]> {
		return this.http.get<any[]>(`${this.baseUrl}api/quizzes/getTrainings`)
			.pipe(map(res => plainToInstance(Quizz, res)));
	}

	getTests(): Observable<Quizz[]> {
		return this.http.get<any[]>(`${this.baseUrl}api/quizzes/getTests`)
			.pipe(map(res => plainToInstance(Quizz, res)));
	}
}
