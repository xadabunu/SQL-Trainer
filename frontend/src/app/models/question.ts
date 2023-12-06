import { Answer } from "./answer";
import { Solution } from "./solution";

export class Question {
	id?: number;
	order?: number;
	body?: string;

	solutions: Solution[] = [];

	previous: number = 0;
	next: number = 0;
	quizTitle: string = '';
	answer?: Answer | undefined = undefined;
}