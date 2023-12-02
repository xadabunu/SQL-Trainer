import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Database } from "src/app/models/database";
import { DatabaseService } from "src/app/services/database.service";
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { QuizzService } from "src/app/services/quizz.service";
import { Question } from "src/app/models/question";

enum quizType {
	Training = "Training",
	Test = "Test"
}

@Component({
	selector: 'edit-quizz',
	templateUrl: './edit-quizz.component.html',
	styleUrls: ['./edit-quiz.component.css']
})
export class EditQuizzComponent implements AfterViewInit, OnInit {

	editQuizForm!: FormGroup;
	id: number = 0;
	private _editable: boolean = true;

	public ctlName!: FormControl;
	public ctlDescription!: FormControl;
	public ctlStart!: FormControl;
	public ctlFinish!: FormControl;
	public ctlType!: FormControl;
	public ctlDatabase!: FormControl;
	public ctlPublished!: FormControl;
	public ctlQuestions!: FormControl;

	dbs: MatTableDataSource<Database> = new MatTableDataSource();
	qsts: MatTableDataSource<Question> = new MatTableDataSource();

	constructor(
		private databaseService: DatabaseService,
		private quizService: QuizzService,
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef
	) {
		this.getDatabases();
		this.ctlName = this.formBuilder.control('', [
			Validators.required,
			Validators.minLength(3)
		], [this.nameUsed()]);
		this.ctlDescription = this.formBuilder.control('');
		this.ctlStart = this.formBuilder.control('', [this.startValidator.bind(this)]);
		this.ctlFinish = this.formBuilder.control('', [this.finishValidator.bind(this)]);
		this.ctlType = this.formBuilder.control(quizType.Training);
		this.ctlDatabase = this.formBuilder.control(null, [
			Validators.required
		]);
		this.ctlPublished = this.formBuilder.control(false);
		this.ctlQuestions = this.formBuilder.control('');
		this.editQuizForm = this.formBuilder.group({
			name: this.ctlName,
			description: this.ctlDescription,
			start: this.ctlStart,
			finish: this.ctlFinish,
			database: this.ctlDatabase,
			isTest: this.ctlType.value === quizType.Test,
			isPublished: this.ctlPublished,
		});
	}

	ngAfterViewInit(): void {
		this.ctlType.setValue(quizType.Training);
	}

	ngOnInit(): void {
		this.route.params.subscribe(params => {
			this.id = params['id'];
			if (params['id'] != 0) {
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
						this._editable = quizz?.editable ?? true;
					})
				this.quizService.getQuestions(params['id'])
					.subscribe(qsts => {
						if (qsts) {
							this.qsts.data = qsts;								
						}
					});
			}
		});
		this.ctlType.valueChanges.subscribe(() => {
			this.ctlStart.updateValueAndValidity();
			this.ctlFinish.updateValueAndValidity();
		});
		this.ctlStart.valueChanges.subscribe(() => this.ctlFinish.setValue(''));
	}

	nameUsed(): any {
		let timeout: NodeJS.Timeout;
		return (ctl: FormControl) => {
			clearTimeout(timeout);
			const name = ctl.value;
			return new Promise(resolve => {
				timeout = setTimeout(() => {
					if (ctl.pristine)
						resolve(null);
					else
						this.quizService.getByName(name)
							.subscribe(quiz => resolve((quiz && this.id != quiz.id) ? { nameUsed: true } : null));
				}, 300)
			})
		};
	}

	private hasValue(ctl: any): boolean {
		if (!ctl) return false;
		return ctl?.value !== undefined && ctl?.value !== null && ctl?.value !== '';
	}

	startValidator(control: AbstractControl): { [key: string]: any } | null {
		if (this.isTest && !this.hasValue(control)) {
			return { startRequired: true };
		}
		if (this.hasValue(this.ctlFinish) && this.ctlFinish?.value < control.value) {
			return { finishAfterStart: true };
		}
		return null;
	}

	finishValidator(control: AbstractControl): { [key: string]: any } | null {
		if (this.isTest) {
			if (control.value === undefined || control.value === null || control.value === '') {
				return { finishRequired: true };
			}
			if (this.ctlStart.value > control.value) {
				return { finishAfterStart: true };
			}
		}
		return null;
	}

	get canEdit(): boolean {
		return this._editable;
	}

	get isTest(): boolean {
		return this.ctlType?.value === quizType.Test;
	}

	update() {
		this.quizService.update();
	}

	delete() {
		console.log("delete");
	}

	addQuestion(): void {
		const order:number = this.qsts.data.length + 1;
		this.qsts.data.push({
			order: order,
			solutions: []
		});
	}

	deleteQuestion($event: number): void {
		if ($event >= 0)
			this.qsts.data.splice($event, 1);
		for (let index = $event; index < this.qsts.data.length; index++) {
			const element = this.qsts.data[index];
			if (element && element.order) element.order--;
		}
	}

	swapQuestions(direction: 'up' | 'down', index: number): void {
		let destination: number = index + (direction === 'up' ? -1 : 1);
		let temp: Question = this.qsts.data[index];
		if (temp && temp.order) temp.order += (direction === 'up' ? -1 : 1);
		temp = this.qsts.data[destination];
		if (temp && temp.order) temp.order -= (direction === 'up' ? -1 : 1);
		this.qsts.data.sort((q1, q2) => (q1.order ?? 0) - (q2.order ?? 0));
		this.cdr.detectChanges();
	}

	private getDatabases(): void {
		this.databaseService.getAll().subscribe(dbs => {
			this.dbs.data = dbs;
		});
	}
}