import { Solution } from "./solution";

export class Question {
	id?: number;
	order?: number;
	body?: string;

	solutions: Solution[] = [];
}