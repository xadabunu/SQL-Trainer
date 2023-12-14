import { Type } from "class-transformer";
import 'reflect-metadata';
import { Database } from "./database";
import { Question } from "./question";

export class Quiz {
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
	database?: Database;
	status?: string;
	editable?: boolean;
	firstQuestionId: number = 0;
	evaluation?: string;

	questions: Question[] = [];

	get display(): string {
		return `${this.name} - (${this.description ? this.description : 'no description'})`;
	}

	get evaluationAsString(): string {
		return this.evaluation ?? "N/A";
	}

	get getTestOrTraining(): string {
		return this.isTest ? "Test" : "Training";
	}

	get dbName(): string | undefined {
		return this.database?.name;
	}

	get startAsString(): string {
		return this.start ? this.start.toLocaleDateString('eu-EU') : "N/A";
	}

	get finishAsString(): string {
		return this.finish ? this.finish.toLocaleDateString('eu-EU') : "N/A";
	}
}
