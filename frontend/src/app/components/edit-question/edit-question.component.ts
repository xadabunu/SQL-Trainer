import { ChangeDetectorRef, Component, Input } from "@angular/core"
import { Question } from "src/app/models/question"

@Component({
	selector: 'edit-question',
	templateUrl: './edit-question.component.html',
	styleUrls: ['./edit-question.component.css']
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
	}
	
	ngAfterViewInit(): void {
	}

	changeTitle(isExpanded: boolean) {
		this.panelTitle = isExpanded ? "Question " + this.question.order : this.question.order + ". " + this.question.body;
		this.cdr.detectChanges();
	}

	canEdit(): boolean {
		return true;
	}
}