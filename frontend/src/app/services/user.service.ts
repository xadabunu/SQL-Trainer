import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToInstance } from 'class-transformer';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getAll(): Observable<User[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/users`)
            .pipe(map(res => plainToInstance(User, res)));
    }

    getById(pseudo: string) {
        return this.http.get<User>(`${this.baseUrl}api/users/${pseudo}`).pipe(
            map(m => plainToInstance(User, m)),
            catchError(err => of(null))
        );
    }

    public update(m: User): Observable<boolean> {
        return this.http.put<User>(`${this.baseUrl}api/users`, m).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public delete(m: User): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/users/${m.pseudo}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public add(m: User): Observable<boolean> {
        return this.http.post<User>(`${this.baseUrl}api/users`, m).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
}
