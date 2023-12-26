import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Quiz } from '../models/quiz';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { Question } from '../models/question';
import { Attempt } from '../models/attempt';

@Injectable({ providedIn: 'root' })
export class QuizService {
	constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

	getAll(): Observable<Quiz[]> {
		return this.http.get<any[]>(`${this.baseUrl}api/quizzes/getAll`)
			.pipe(map(res => plainToInstance(Quiz, res)));
	}

	getTrainings(): Observable<Quiz[]> {
		return this.http.get<any[]>(`${this.baseUrl}api/quizzes/getTrainings`)
			.pipe(map(res => plainToInstance(Quiz, res)));
	}

	getTests(): Observable<Quiz[]> {
		return this.http.get<any[]>(`${this.baseUrl}api/quizzes/getTests`)
			.pipe(map(res => plainToInstance(Quiz, res)));
	}

	getById(id: number) {
		return this.http.get<Quiz>(`${this.baseUrl}api/quizzes/${id}`)
			.pipe(map(res => plainToInstance(Quiz, res)),
			catchError(err => of(null)));
	}

	getByName(name: string) {
		return this.http.get<Quiz>(`${this.baseUrl}api/quizzes/byName/${name}`)
			.pipe(map(res => plainToInstance(Quiz, res)),
			catchError(err => of(null)));
	}

	update(q: Quiz): Observable<boolean> {
		return this.http.put<Quiz>(`${this.baseUrl}api/quizzes`, q).pipe(
			map(res => true),
			catchError(err => {
				console.log(err);
				return of(false);
			})
		)
	}

	create(q: Quiz): Observable<boolean> {
		return this.http.post<Quiz>(`${this.baseUrl}api/quizzes`, q).pipe(
			map(res => true),
			catchError(err => {
				console.log(err);
				return of(false);
			})
		);
	}

	createAttempt(a: Attempt): Observable<boolean> {
		return this.http.post<Attempt>(`${this.baseUrl}api/attempts`, a)
			.pipe(map(res => true),
				catchError(err => {
					console.log(err);
					return of(false);
				}));
	}

	deleteQuiz(quizId: number): Observable<boolean> {
		return this.http.delete<boolean>(`${this.baseUrl}api/quizzes/${quizId}`).pipe(
			map(res => true),
			catchError(err => {
				console.log(err);
				return of(false);
			})
		);
	}
}
