import { Component, EventEmitter, Input, Output } from "@angular/core"
import { FormControl, ValidationErrors } from "@angular/forms";
import { Question } from "src/app/models/question"
import { Solution } from "src/app/models/solution";

@Component({
	selector: 'edit-question',
	templateUrl: './edit-question.component.html',
	styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent {

	@Input() question!: Question;
	@Input() canEdit!: boolean;
	@Input() isLast!: boolean;

	@Output() indexToRemove = new EventEmitter<number>();
	@Output() indexToPushDown = new EventEmitter<number>();
	@Output() indexToPushUp = new EventEmitter<number>();

	@Output() bodyChange = new EventEmitter<string>();
	@Output() solutionChange = new EventEmitter<ValidationErrors>();

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

	onBodyChange(): void {
		this.bodyChange.emit(this.question.body);
	}

	sqlChange(sql: string | undefined): void {
		this.solutionChange.emit((sql && sql.length > 0) ? undefined : { emptySolution: true});
	}

	deleteQuestion(): void {
		this.indexToRemove.emit((this.question.order ?? 0) - 1);
	}

	goDown(index: number | undefined): void {
		this.indexToPushDown.emit((index ?? 0) - 1);
		this.changeTitle(true);
	}

	goUp(index: number | undefined): void {
		this.indexToPushUp.emit((index ?? 0) - 1);
		this.changeTitle(true);
	}

	addSolution(): void {
		const order: number = this.question.solutions.length + 1;
		this.question.solutions.push({
			order: order
		});
		this.solutionChange.emit(undefined);
	}

	deleteSolution(order: number | undefined): void {
		if (order) {
			const index: number = order - 1;
			this.question.solutions.splice(index, 1);
			for (let i = index; i < this.question.solutions.length; i++) {
				const element = this.question.solutions[i];
				if (element && element.order) element.order -= 1;
			}
		}
		if (this.question.solutions.length === 0)
			this.solutionChange.emit({ noSolution: true });
	}

	solutionUp(order: number | undefined): void {
		if (order) {
			let temp: Solution = this.question.solutions[order - 1];
			if (temp && temp.order) temp.order -= 1;
			temp = this.question.solutions[order - 2];
			if (temp && temp.order) temp.order += 1;
			this.question.solutions.sort((s1, s2) => (s1.order ?? 0) - (s2.order ?? 0));
		}
	}

	solutionDown(order: number | undefined): void {
		if (order) {
			let temp: Solution = this.question.solutions[order - 1];
			if (temp && temp.order) temp.order += 1;
			temp = this.question.solutions[order];
			if (temp && temp.order) temp.order -= 1;
			this.question.solutions.sort((s1, s2) => (s1.order ?? 0) - (s2.order ?? 0));
		}
	}
}