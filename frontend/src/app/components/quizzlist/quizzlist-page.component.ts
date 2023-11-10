import { Component } from "@angular/core";
import { QuizList, Quizz } from '../../models/quizz';
import { QuizzService } from "src/app/services/quizz.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatTableState } from "src/app/helpers/mattable.state";
import { StateService } from "src/app/services/state.service";
import { QuizListComponent } from "./quizlist.component";

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

		// quizzService.getAll().subscribe(quizzes => {
		// 	this.quizzes = quizzes;
		// })
		// for (let quiz of this.quizzes)
		// {
		// 	if (quiz.isTest)
		// 		this.testQuizzes.push(quiz);
		// 	else
		// 		this.trainingQuizzes.push(quiz);
		// }
		quizzService.getTrainings().subscribe(trainingQuizzes => {
			this.trainingQuizzes = new QuizList(trainingQuizzes);
		})
		quizzService.getTests().subscribe(testQuizzes => {
			this.testQuizzes = new QuizList(testQuizzes);
		})
	}
	
	filterChanged(e: KeyboardEvent): void {
		console.log(this.filter.length);
	}
}