import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { QueryResult } from "src/app/models/queryResult";
import { Question } from "src/app/models/question";
import { QuestionService } from "src/app/services/question.sercice";

@Component({
	selector: '',
	templateUrl: './question.component.html',
	styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit, AfterViewInit {

	question!: Question;
	header: string = '';
	body: string = '';
	label: string = '';
	query: string = '';
	displaySolutions: boolean = false;
	canWrite: boolean = false;
	solutionBtnLabel: string = 'Voir solutions';

	queryResult?: QueryResult;

	constructor(
		private questionService: QuestionService,
		private route: ActivatedRoute,
		private router: Router
	) { }

	ngOnInit(): void {
		this.refresh();
	}

	ngAfterViewInit(): void { }

	navigateToPrevious(): void {
		this.router.navigateByUrl("/question/" + this.question.previous)
			.then(() =>	this.refresh());
	}

	navigateToNext(): void {
		this.router.navigateByUrl("/question/" + this.question.next)
			.then(() =>	this.refresh());
	}

	refresh(): void {
		this.route.params.subscribe(params => {
			this.questionService.getQuestion(params['id']).subscribe(question => {
				this.question = question;
				this.header = question.quiz?.name + ' - Exercice ' + question.order;
				this.body = question.body ?? '';
				this.canWrite = this.canEdit;
				if (!question.answer) {
					this.label = 'Votre requête: (pas encore répondu)';
					this.query = '';
					this.displaySolutions = false;
				} else {
					this.label = 'Votre requête:';
					this.query = question.answer.sql;
					this.displaySolutions = true;
					this.canWrite = false;
					this.solutionBtnLabel = "Cacher solutions";
				}
			});
		});
	}

	send(): void {
		this.questionService.executeQuery(this.question.quiz!.database!.name!, this.query)
			.subscribe(qr => this.queryResult = qr);
	}

	erase(): void {
		this.query = '';
	}

	showSolutions(): void {
		this.displaySolutions = !this.displaySolutions;
		if (this.displaySolutions === true) {
			this.solutionBtnLabel = "Cacher solutions";
			this.canWrite = false;
		} else {
			this.solutionBtnLabel = "Voir solutions";
			this.canWrite = true;
		}
	}

	get isFirst(): boolean {
		if (this.question !== undefined)
			return this.question.previous == 0;
		return false;
	}

	get isLast(): boolean {
		if (this.question !== undefined)
			return this.question.next == 0;
		return false;
	}

	get canSave(): boolean {
		if (this.question !== undefined)
			return this.question.answer?.sql !== undefined;
		return false;
	}

	get canEdit(): boolean {
		if (this.question !== undefined)
			return !this.question.quiz!.isClosed &&
				(!this.question.quiz!.isTest || this.question.answer === undefined);
		return false;
	}

	get canSeeSolutions() {
		if (this.question !== undefined)
			return !this.question.quiz!.isTest || this.question.quiz!.isClosed;
		return false;
	}

	get dbName(): string {
		if (this.question!== undefined)
			return this.question.quiz!.database!.name!;
		return '';
	}
}