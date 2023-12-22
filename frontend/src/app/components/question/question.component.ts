import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Answer } from "src/app/models/answer";
import { QueryResult } from "src/app/models/queryResult";
import { Question } from "src/app/models/question";
import { QuestionService } from "src/app/services/question.service";

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
			.then(() => this.refresh());
	}

	navigateToNext(): void {
		this.router.navigateByUrl("/question/" + this.question.next)
			.then(() => this.refresh());
	}

	refresh(): void {
		this.solutionBtnLabel = "Afficher solutions";
		this.route.params.subscribe(params => {
			this.questionService.getQuestion(params['id']).subscribe(question => {
				this.question = question;
				this.header = question.quiz?.name + ' - Exercice ' + question.order;
				this.body = question.body ?? '';
				if (!question.answer) {
					this.label = 'Votre requête: (pas encore répondu)';
					this.query = '';
					this.displaySolutions = question.quiz!.isClosed!;
					this.queryResult = undefined;
				} else {
					this.label = 'Votre requête:';
					this.query = question.answer.sql;
					this.executeQuery();
				}
			});
		});
	}

	send(): void {
		const answer: Answer = {
					timestamp: new Date(),
					sql: this.query,
					isCorrect: false,
					question: this.question,
					attempt: this.question.attempt! };

		this.questionService.sendAnswer(answer).subscribe(() => this.refresh());
	}

	executeQuery(): void {
		this.questionService.executeQuery(this.question.quiz!.database!.name!, this.query, this.question.id!)
			.subscribe(qr => {
				let errors: string[] = qr.errors;
				qr.errors = errors.filter(e => e !== null);
				this.queryResult = qr;
				this.displaySolutions = qr.isCorrect || this.question!.quiz!.isClosed || this.question.attempt?.finish;
				console.log(this.question!.quiz!.isClosed);
			});
	}

	erase(): void {
		this.query = '';
		this.displaySolutions = false;
		this.queryResult = undefined;
	}

	showSolutions(): void {
		this.displaySolutions = true;
	}

	closeAttempt() {

	}

	get timestamp(): string {
		if (this.question && this.question.answer) {
			const ts: Date = this.question.answer!.timestamp;
			console.log(ts);
			return ts.toLocaleDateString() + " " + ts.toLocaleTimeString();
		}
		return "";
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
				(!this.question.quiz!.isTest || this.question.attempt!.finish === null);
		return false;
	}

	get canWrite(): boolean {
		if (this.question !== undefined) {
			return !this.question.quiz?.isClosed
				&& this.question.attempt!.finish === null
				&& !this.displaySolutions;
		}
		return false;
	}

	get canSeeSolutions() {
		if (this.question !== undefined)
			return !this.question.quiz!.isTest || this.question.quiz!.isClosed;
		return false;
	}

	get dbName(): string {
		if (this.question !== undefined)
			return this.question.quiz!.database!.name!;
		return '';
	}
}