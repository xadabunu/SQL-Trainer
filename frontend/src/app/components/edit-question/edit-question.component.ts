import { Component, Input } from "@angular/core"
import { FormControl } from "@angular/forms";
import { Question } from "src/app/models/question"

@Component({
	selector: 'edit-question',
	templateUrl: './edit-question.component.html',
	styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent {

	@Input() question!: Question;
	@Input() canEdit!: boolean;

	panelTitle: string = "";
	isExpanded: boolean = false;

	public ctlBody!: FormControl;

	constructor() {
	}

	ngOnInit() {
		this.panelTitle = this.question.order + ". " + (this.question.body === undefined ? "Nouvelle question" : this.question.body);
		this.isExpanded = this.question.id === undefined;
	}

	ngAfterViewInit(): void {
	}

	private get title(): string {
		if (this.isExpanded) return ("Question " + this.question.order);
		let res: string = this.question.order + ". ";
		if (this.question.id === undefined)
			return res + "Nouvelle question";
		return res + this.question.body;
	}

	changeTitle(isExpanded: boolean) {
		if (isExpanded) {
			this.panelTitle = "Question " + this.question.order;
		}
		else {
			this.panelTitle = this.question.order + ". " + (this.question.body === undefined ?
				"Nouvelle question" : this.question.body)
		}
	}

	addSolution(): void {
		const order: number = this.question.solutions.length + 1;
		this.question.solutions.push({
			order: order
		});
	}

	deleteSolution(order: number | undefined): void {
		if (order)
			this.question.solutions.splice(order - 1, 1);
	}
}