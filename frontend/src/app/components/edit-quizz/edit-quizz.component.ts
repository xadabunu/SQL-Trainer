import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Database } from "src/app/models/database";
import { DatabaseService } from "src/app/services/database.service";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { QuizzService } from "src/app/services/quizz.service";
import { Question } from "src/app/models/question";

enum quizType{
	Training = "Training",
	Test = "Test"
}

@Component({
	selector: 'edit-quizz',
	templateUrl: './edit-quizz.component.html',
	//styleUrls: ['./edit-quiz.component.css']
})
export class EditQuizzComponent implements AfterViewInit, OnInit {

	editQuizForm!: FormGroup;
	id: number = 0;

	public isTest: boolean = false;

	private _quizType: string = quizType.Training;
	get quizType(): string {
		return this._quizType;
	}
	@Input() set quizType(val: string) {
		this._quizType = val;
		this.isTest = this._quizType === quizType.Test;
	}

	public ctlName!: FormControl;
	public ctlDescription!: FormControl;
	public ctlStart!: FormControl;
	public ctlFinish!: FormControl;
	public ctlType!: FormControl;
	public ctlDatabase!: FormControl;
	public ctlPublished!: FormControl;

	dbs: MatTableDataSource<Database> = new MatTableDataSource();
	qsts: MatTableDataSource<Question> = new MatTableDataSource();

	constructor(
		private databaseService: DatabaseService,
		private quizService: QuizzService,
		private formBuilder: FormBuilder,
		private route: ActivatedRoute
		) {
		this.getDatabases();
		this.ctlName = this.formBuilder.control('', [
			Validators.required,
			Validators.minLength(3)
		]);
		this.ctlDescription = this.formBuilder.control('');
		this.ctlStart = this.formBuilder.control('');
		this.ctlFinish = this.formBuilder.control('');
		this.ctlType = this.formBuilder.control(quizType.Training);
		this.ctlDatabase = this.formBuilder.control(null);
		this.ctlPublished = this.formBuilder.control(false);
		this.editQuizForm = this.formBuilder.group({
			name: this.ctlName,
			description: this.ctlDescription,
			start: this.ctlStart,
			finish: this.ctlFinish,
			database: this.ctlDatabase,
			isTest: this.ctlType,
			isPublished: this.ctlPublished,
		});
	}

	ngAfterViewInit(): void {
		this._quizType = quizType.Training;
	}

	ngOnInit(): void {
		this.route.params.subscribe(params => {
			this.id = params['id'];
			if (params['id'] != 0)
			{
				this.quizService.getById(params['id'])
					.subscribe(quizz => {
						this.ctlName.setValue(quizz?.name);
						this.ctlDescription.setValue(quizz?.description);
						this.ctlType.setValue(quizz?.isTest ? quizType.Test : quizType.Training);
						this.ctlPublished.setValue(quizz?.isPublished);
						var index: number | undefined = quizz?.database ? quizz.database.id : 1;
						if (index) //? meilleur moyen de récupérer la db ?
							index -= 1;
						this.ctlDatabase.setValue(this.dbs.data[index ?? 0]);
						this.ctlStart.setValue(quizz?.start);
						this.ctlFinish.setValue(quizz?.finish);
				})
				this.quizService.getQuestions(params['id'])
					.subscribe(qsts => {
						if (qsts)
							this.qsts.data = qsts;
					});
			}
		});
		
	}

	update() {
		this.quizService.update();
	}

	private getDatabases(): void {
		this.databaseService.getAll().subscribe(dbs => {
			this.dbs.data = dbs;
			this.ctlDatabase = this.formBuilder.control(this.dbs.data[0]);
		});
	}
}