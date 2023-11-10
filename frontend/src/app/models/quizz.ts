import { Type } from "class-transformer";
import 'reflect-metadata';

export class Quizz {
	id?: number;
	name?: string;
	description?: string;
	isPublished?: boolean;
	isClosed?: boolean;
	isTest?: boolean;
	@Type(() => Date)
	start?: Date;
	@Type(() => Date)
	finish?: Date;

	get display(): string {
		return `${this.name} - (${this.description ? this.description : 'no description'})`;
	}
}

export class QuizList {
	private _quizzes: Quizz[] = [];

	constructor(list: Quizz[]) {
		this._quizzes = list;
	}
}
