import { Component } from "@angular/core";
import { QuizList, Quizz } from '../../models/quizz';
import { QuizzService } from "src/app/services/quizz.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatTableState } from "src/app/helpers/mattable.state";
import { StateService } from "src/app/services/state.service";
import { AuthenticationService } from "src/app/services/authentication.service";
import { Role } from "src/app/models/user";

@Component({
	selector: 'quizzlist-page',
	templateUrl: './quizzlist-page.component.html'
})
export class QuizzListPageComponent {
	quizzes: Quizz[] = [];
	trainingQuizzes: QuizList = null!;
	testQuizzes: QuizList = null!;
	allQuizzes: QuizList = null!;
	
	filter: string = '';
	state: MatTableState;

	dataSource: MatTableDataSource<Quizz> = new MatTableDataSource();

	constructor(
		private authenticationServie: AuthenticationService,
		private quizzService: QuizzService,
		private stateService: StateService
	) {

		this.state = this.stateService.quizListState;
		this.filter = this.state.filter;
	}

	ngOnInit(): void {
		if (this.isAdmin)
			this.quizzService.getAll().subscribe(list => this.allQuizzes = new QuizList(list));
		else {
			this.quizzService.getTests().subscribe(list => this.testQuizzes = new QuizList(list));
			this.quizzService.getTrainings().subscribe(list => this.trainingQuizzes = new QuizList(list));
		}
	}
	
	/**
	 * On sauvegarde le filtre dans le state du composant parent
	 * car c'est lui qui fournit son filtre aux enfants quand on
	 * revient sur la page.
	 */
	filterChanged(e: KeyboardEvent): void {
		this.state.filter = this.filter;
	}

	get isAdmin() {
        return this.authenticationServie.currentUser && this.authenticationServie.currentUser.role === Role.Admin;
    }
}