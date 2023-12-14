import { Answer } from "./answer";
import { Quiz } from "./quiz";
import { Solution } from "./solution";

export class Question {
	id?: number;
	order?: number;
	body?: string;
	quiz?: Quiz;

	solutions: Solution[] = [];

	previous: number = 0;
	next: number = 0;
	answer?: Answer | undefined = undefined;
}