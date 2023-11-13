import { Component } from "@angular/core";
import { QuizList, Quizz } from '../../models/quizz';
import { QuizzService } from "src/app/services/quizz.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatTableState } from "src/app/helpers/mattable.state";
import { StateService } from "src/app/services/state.service";

@Component({
	selector: 'quizzlist-page',
	templateUrl: './quizzlist-page.component.html'
})
export class QuizzListPageComponent {
	quizzes: Quizz[] = [];
	trainingQuizzes: QuizList = null!;
	testQuizzes: QuizList = null!;
	
	filter: string = '';
	state: MatTableState;

	dataSource: MatTableDataSource<Quizz> = new MatTableDataSource();

	constructor(
		private quizzService: QuizzService,
		private stateService: StateService	
	) {

		this.state = this.stateService.quizListState;
		this.filter = this.state.filter;

		quizzService.getTrainings().subscribe(trainingQuizzes => {
			this.trainingQuizzes = new QuizList(trainingQuizzes);
		})
		quizzService.getTests().subscribe(testQuizzes => {
			this.testQuizzes = new QuizList(testQuizzes);
		})
	}
	
	/**
	 * On sauvegarde le filtre dans le state du composant parent
	 * car c'est lui qui fournit son filtre aux enfants quand on
	 * revient sur la page.
	 */
	filterChanged(e: KeyboardEvent): void {
		this.state.filter = this.filter;
	}
}