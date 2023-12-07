import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
	label: string = 'Votre requête:';
	sql: string = '';
	displaySolutions: boolean = false;

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
			.then(() => {
				this.refresh();
			});
	}

	navigateToNext(): void {
		this.router.navigateByUrl("/question/" + this.question.next)
			.then(() => {
				this.refresh();
			});
	}

	refresh(): void {
		this.route.params.subscribe(params => {
			this.questionService.getQuestion(params['id']).subscribe(question => {
				this.question = question;
				this.header = question.quizTitle + ' - Exercice ' + question.order;
				this.body = question.body ?? '';
				if (!question.answer) {
					this.label = 'Votre requête: (pas encore répondu)';
					this.sql = '';
				}
				else {
					this.label = 'Votre requête:';
					this.sql = question.answer.sql;
				}
				this.displaySolutions = false;
			});
		});
	}

	send(): void {

	}

	erase(): void {
		this.sql = '';
	}

	showSolutions(): void {
		this.displaySolutions = true;
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
}