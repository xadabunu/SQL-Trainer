import { Component, Input, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { MatTableState } from "src/app/helpers/mattable.state";
import { Quizz } from "src/app/models/quizz";
import { QuizzService } from "src/app/services/quizz.service";
import { StateService } from "src/app/services/state.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { format } from "date-fns";
import { AuthenticationService } from "src/app/services/authentication.service";
import { Role } from "src/app/models/user";
import { Attempt } from "src/app/models/attempt";
import { Router } from "@angular/router";

@Component({
	selector: 'quizlist',
	templateUrl: './quizlist.component.html'
})
export class QuizListComponent {

	@Input() isTest!: boolean;

	title!: string;

	private _filter!: string;
	get filter(): string {
		return this._filter;
	}
	@Input() set filter(val: string) {

		this._filter = val;
		this.dataSource.filter = val.trim().toLowerCase();
		this.state.filter = this.dataSource.filter;

		if (this.dataSource.paginator)
			this.dataSource.paginator.firstPage();
	}

	trainingColumns: string[] = ['name', 'dbName', 'status', 'actions'];
	testColumns: string[] = ['name', 'dbName', 'startAsString', 'finishAsString', 'status', 'evaluation', 'actions'];
	teacherColumns: string[] = ['name', 'dbName', 'type de quiz', 'status', 'startAsString', 'finishAsString', 'actions'];

	displayedColumns: string[] = null!;

	dataSource: MatTableDataSource<Quizz> = new MatTableDataSource();
	state: MatTableState;

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(
		private quizService: QuizzService,
		private stateService: StateService,
		public dialog: MatDialog, // sera utile en cas de bouton "new Quizz" pour les Teachers
		public snackBar: MatSnackBar,
		private authService: AuthenticationService,
		private router: Router
	) {
		this.state = this.stateService.quizListState;
	}

	ngOnInit(): void {
		/* si cette assignation est faite dans le constructeur, isTest est toujours undefined */
		this.displayedColumns = this.isTest ? this.testColumns : 
				(this.isTest === undefined ? this.teacherColumns : this.trainingColumns);
		this.title = this.isTest === undefined ? "Liste des quiz :"
			: ("Quiz " + (this.isTest === true ? "de test :" : "d'entraînement :"));
	}

	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;

		this.dataSource.filterPredicate = (data: Quizz, filter: string) => {
			const str = data.name + ' ' + data.description + ' ' +
				(data.start ? format(data.start!, 'dd/MM/yyyy') : ' ') + ' ' +
					(data.finish ? format(data.finish!, 'dd/MM/yyyy') : ' ');
			return str.toLowerCase().includes(filter);
		}
		this.state.bind(this.dataSource);
		this.refresh();
	}

	refresh(): void {
		if (this.isTest)
			this.quizService.getTests().subscribe(quizzes => {
				this.dataSource.data = quizzes;
				this.state.restoreState(this.dataSource);
				this.filter = this.state.filter;
			});
		else if (this.isTest === false)
			this.quizService.getTrainings().subscribe(quizzes => {
				this.dataSource.data = quizzes;
				this.state.restoreState(this.dataSource);
				this.filter = this.state.filter;
			});
		else
			this.quizService.getAll().subscribe(quizzes => {
				this.dataSource.data = quizzes;
				this.state.restoreState(this.dataSource);
				this.filter = this.state.filter;
			});
	}

	get isTeacher(): boolean {
		return this.authService.currentUser?.role === Role.Teacher;
	}

	canCreate(quiz: Quizz): boolean {
		return !this.isTeacher &&
			(quiz.status === 'PAS COMMENCE' ||
				(quiz.status === 'FINI' && !quiz.isTest));
	}

	canEdit(quiz: Quizz): boolean {
		return !this.isTeacher && quiz.status === 'EN COURS';
	}

	canConsult(quiz: Quizz): boolean {
		return !this.isTeacher && quiz.status === 'FINI';
	}

	navigateToAttempt(quiz: Quizz, create: boolean): void {
		if (create) {
			const attempt: Attempt = {
					quizId: quiz.id, start: new Date()
			};
			this.quizService.createAttempt(attempt);
		}
		this.router.navigateByUrl('question/' + quiz.firstQuestionId);
	}
}