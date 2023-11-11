import { Type } from "class-transformer";
import 'reflect-metadata';

/**
 * Précise l'état d'un quizz à une date donnée.
 */
enum state {
	/**
	 * La date de fin du quizz est dépassée.
	 */
	CLOTURE = "CLOTURE",
	/**
	 * Une tentative est entamée et l'étudiant n'a pas demandé à la cloturer.
	 */
	EN_COURS = "EN_COURS",
	/**
	 * La dernière tentative a été clôturée par l'étudiant.
	 */
	FINI = "FINI",
	/**
	 * Il n'existe aucune tentative liant l'étudiant connecté au quizz concerné.
	 */
	PAS_COMMENCE = "PAS_COMMENCE"
}

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

	get getStatus(): string {
		let today = new Date(2023, 9, 21);
		if (this.start && this.finish)
		{
			if (this.start.valueOf() > today.valueOf())
				return state.PAS_COMMENCE;
			else if (this.finish.valueOf() <= today.valueOf())
				return state.CLOTURE;
			else
				return state.EN_COURS; //todo: return hasNotation ? state.FINI : state.EN_COURS
		}
		return state.EN_COURS; //todo: si une tentative a été débutée -> (si finie -> FINI : EN_COURS) : PAS_COMMENCE
	}

	get getEvaluation(): string {
		return "N/A";
	}
}

export class QuizList {
	private _quizzes: Quizz[] = [];

	constructor(list: Quizz[]) {
		this._quizzes = list;
	}
}
