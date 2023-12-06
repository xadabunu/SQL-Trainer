import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Answer } from "src/app/models/answer";
import { Question } from "src/app/models/question";
import { QuestionService } from "src/app/services/question.sercice";

@Component({
	selector: '',
	templateUrl: './question.component.html'
})
export class QuestionComponent implements OnInit, AfterViewInit{

	question!: Question;
	answer!: Answer;
	title: string = '';

	constructor(
		private questionService: QuestionService,
		private route: ActivatedRoute
		) { }

	ngOnInit(): void {
		this.route.params.subscribe(params => {
			this.questionService.getQuestion(params['id']).subscribe(question => {
				this.question = question;
				this.title = question.quizTitle + ' - Exercice ' + question.order;
		})

		});
	}

	ngAfterViewInit(): void { }

	navigateToPrevious() {

	}

	get isFirst(): boolean {
		return this.question.previous != 0;
	}

	get isLast(): boolean {
		return this.question.next != 0;
	}

	get canSave(): boolean {
		return this.question.answer?.sql === '';
	}
}