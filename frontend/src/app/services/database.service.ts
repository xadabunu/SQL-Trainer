import { Inject, Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Database } from "../models/database";
import { HttpClient } from "@angular/common/http";
import { plainToInstance } from "class-transformer";

@Injectable({ providedIn: 'root' })
export class DatabaseService {

	constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {}

	getAll(): Observable<Database[]> {
		return this.http.get<any[]>(`${this.baseUrl}api/databases/getAll`)
			.pipe(map(res => plainToInstance(Database, res)));
	}
}