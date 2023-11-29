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

	constructor() {
	}

	ngOnInit() {
		this.panelTitle = this.question.id + ". " + this.question.body;
	}
	
	ngAfterViewInit(): void {
	}

	changeTitle(isExpanded: boolean) {
		this.panelTitle = isExpanded ?
			"Question " + this.question.order :
				this.question.order + ". " + this.question.body;
	}

	get canEdit(): boolean {
		return true;
	}
}