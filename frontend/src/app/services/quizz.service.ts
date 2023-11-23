import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Quizz } from '../models/quizz';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToInstance } from 'class-transformer';

@Injectable({ providedIn: 'root' })
export class QuizzService {
	constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

	getAll(): Observable<Quizz[]> {
		return this.http.get<any[]>(`${this.baseUrl}api/quizzes/getAll`)
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

	getById(id: number) {
		return this.http.get<Quizz>(`${this.baseUrl}api/quizzes/${id}`)
			.pipe(map(res => plainToInstance(Quizz, res)),
			catchError(err => of(null)));
	}
}
