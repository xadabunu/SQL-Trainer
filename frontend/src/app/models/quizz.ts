import { Type } from "class-transformer";
import 'reflect-metadata';
import { Database } from "./database";

/**
 * Précise l'état d'un quizz à une date donnée.
 */
enum state {
	/**
	 * La date de fin du quizz est dépassée.
	 */
	CLOTURE = "CLOTURÉ",
	/**
	 * Une tentative est entamée et l'étudiant n'a pas demandé à la cloturer.
	 */
	EN_COURS = "EN COURS",
	/**
	 * La dernière tentative a été clôturée par l'étudiant.
	 */
	FINI = "FINI",
	/**
	 * Il n'existe aucune tentative liant l'étudiant connecté au quizz concerné.
	 */
	PAS_COMMENCE = "PAS COMMENCÉ",
	/**
	 * La date de début du quizz est dans le futur.
	 */
	A_VENIR = "À VENIR",
	/**
	 * Uniquement pour la liste de quizz des professeurs.
	 */
	PAS_PUBLIE = "PAS PUBLIÉ"
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
	database?: Database;

	get display(): string {
		return `${this.name} - (${this.description ? this.description : 'no description'})`;
	}

	/**
	 * ? getStatus(currentUser: User) 
	 */
	get getStatus(): string {
		if (!this.isPublished) return state.PAS_PUBLIE;

		let today = new Date(2023, 9, 21);

		if (this.start && this.finish)
		{
			if (this.start.valueOf() > today.valueOf())
				return state.A_VENIR;
			else if (this.finish.valueOf() <= today.valueOf())
				return state.CLOTURE;
			else
				return state.PAS_COMMENCE; //todo: return hasAttempt ? (attemptCompleted ? state.FINI : state.EN_COURS)
										//todo 						: state.PAS_COMMENCE
		}
		return state.PAS_COMMENCE; //todo: return hasAttempt ? (si finie -> FINI : EN_COURS) : PAS_COMMENCE
	}

	get getEvaluation(): string {
		return "N/A";
	}

	get getTestOrTraining(): string {
		return this.isTest ? "Test" : "Training";
	}

	get getStart(): string {
		return this.start ? this.start.toLocaleDateString('eu-EU') : "N/A";
	}

	get getFinish(): string {
		return this.finish ? this.finish.toLocaleDateString('eu-EU') : "N/A";
	}
}

export class QuizList {
	private _quizzes: Quizz[] = [];

	constructor(list: Quizz[]) {
		this._quizzes = list;
	}
}
