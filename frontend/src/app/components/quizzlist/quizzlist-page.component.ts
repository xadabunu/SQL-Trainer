import { Component } from "@angular/core";
import { QuizList, Quizz } from '../../models/quizz';
import { QuizzService } from "src/app/services/quizz.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatTableState } from "src/app/helpers/mattable.state";
import { StateService } from "src/app/services/state.service";
import { QuizListComponent } from "./quizlist.component";

@Component({
	selector: 'app-quizzlist',
	templateUrl: './quizzlist-page.component.html'
})
export class QuizzListMainComponent {
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

		let trainingList: Quizz[];
		let testLis: Quizz[];

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
		const filterValue = (e.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
		this.state.filter = this.dataSource.filter;

		if (this.dataSource.paginator)
			this.dataSource.paginator.firstPage();
	}
}