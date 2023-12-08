import { Answer } from "./answer";
import { Quizz } from "./quizz";
import { Solution } from "./solution";

export class Question {
	id?: number;
	order?: number;
	body?: string;
	quiz?: Quizz;

	solutions: Solution[] = [];

	previous: number = 0;
	next: number = 0;
	answer?: Answer | undefined = undefined;
}