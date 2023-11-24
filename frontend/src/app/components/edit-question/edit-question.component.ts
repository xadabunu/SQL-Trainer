import { ChangeDetectorRef, Component, Input } from "@angular/core"
import { Question } from "src/app/models/question"

@Component({
	selector: 'edit-question',
	templateUrl: './edit-question.component.html'
})
export class EditQuestionComponent {

	@Input() question!: Question;

	panelTitle: string = "";
	myisExtanded: boolean = false;
	openTitle: string = "";
	closeTitle: string = "";

	constructor(private cdr: ChangeDetectorRef) {
	}

	ngOnInit() {
		this.panelTitle = this.question.id + ". " + this.question.body;
		this.closeTitle = this.question.id + ". " + this.question.body;
		this.openTitle = "Question " + this.question.id;
	}
	
	ngAfterViewInit(): void {
	}

	changeTitle(isExpanded: boolean) {
		this.panelTitle = isExpanded ? "Question " + this.question.id : this.question.id + ". " + this.question.body;
		this.cdr.detectChanges();
		console.log(1)
	}

	toggleExpansion() {
		this.myisExtanded = !this.myisExtanded;
	}
}