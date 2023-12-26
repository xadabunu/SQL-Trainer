import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Database } from "src/app/models/database";
import { DatabaseService } from "src/app/services/database.service";
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { QuizService } from "src/app/services/quiz.service";
import { Question } from "src/app/models/question";
import { Quiz } from "src/app/models/quiz";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDeleteComponent } from "./confirm-delete";

enum quizType {
	Training = "Training",
	Test = "Test"
}

@Component({
	selector: 'edit-quiz',
	templateUrl: './edit-quiz.component.html',
	styleUrls: ['./edit-quiz.component.css']
})
export class EditQuizComponent implements AfterViewInit, OnInit {

	editQuizForm!: FormGroup;
	id: number = 0;
	private _editable: boolean = true;
	private _quiz: Quiz = null!;
	temp: Question[] = [];

	public ctlName!: FormControl;
	public ctlDescription!: FormControl;
	public ctlStart!: FormControl;
	public ctlFinish!: FormControl;
	public ctlType!: FormControl;
	public ctlDatabase!: FormControl;
	public ctlPublished!: FormControl;
	public ctlQuestions!: FormControl;

	dbs: MatTableDataSource<Database> = new MatTableDataSource();

	constructor(
		private databaseService: DatabaseService,
		private quizService: QuizService,
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef,
		private dialog: MatDialog,
		private router: Router
	) {
		this.getDatabases();
		this.ctlName = this.formBuilder.control('', [
			Validators.required,
			Validators.minLength(3)
		], [this.nameUsed()]);
		this.ctlDescription = this.formBuilder.control('');
		this.ctlStart = this.formBuilder.control(null, [this.startValidator.bind(this)]);
		this.ctlFinish = this.formBuilder.control(null, [this.finishValidator.bind(this)]);
		this.ctlType = this.formBuilder.control(quizType.Training);
		this.ctlDatabase = this.formBuilder.control(null, [
			Validators.required
		]);
		this.ctlPublished = this.formBuilder.control(false);
		this.ctlQuestions = this.formBuilder.control('', [
			this.emptyQuestion(),
		]);
		this.editQuizForm = this.formBuilder.group({
			name: this.ctlName,
			description: this.ctlDescription,
			start: this.ctlStart,
			finish: this.ctlFinish,
			database: this.ctlDatabase,
			isPublished: this.ctlPublished,
			questions: this.ctlQuestions
		});
	}

	ngAfterViewInit(): void { }

	ngOnInit(): void {
		this.route.params.subscribe(params => {
			this.id = params['id'];
			if (params['id'] != 0) {
				this.quizService.getById(params['id'])
					.subscribe(quiz => {
						if (quiz)
							this._quiz = quiz;
						this.ctlName.setValue(quiz?.name);
						this.ctlDescription.setValue(quiz?.description);
						this.ctlType.setValue(quiz?.isTest ? quizType.Test : quizType.Training);
						this.ctlPublished.setValue(quiz?.isPublished);
						var index: number | undefined = quiz?.database ? quiz.database.id : 1;
						if (index) //? meilleur moyen de récupérer la db ?
							index -= 1;
						this.ctlDatabase.setValue(this.dbs.data[index ?? 0]);
						this.ctlStart.setValue(quiz?.start);
						this.ctlFinish.setValue(quiz?.finish);
						this.ctlQuestions.setValue(quiz?.questions ?? []);
						if (!quiz?.editable) {
							this._editable = quiz?.editable ?? true;
							this.ctlName.disable();
							this.ctlDescription.disable();
							this.ctlType.disable();
							this.ctlPublished.disable();
							this.ctlDatabase.disable();
							this.ctlStart.disable();
							this.ctlFinish.disable();
						}
					});
			} else {
				this._quiz = new Quiz();
				this._quiz.questions = this.temp;
				this.ctlQuestions.setValue(this.temp);
			}
		});
		this.ctlType.valueChanges.subscribe(value => {
			if (value === quizType.Test) {
				this.ctlStart.updateValueAndValidity();
				this.ctlFinish.updateValueAndValidity();
			} else {
				this.ctlStart.setValue(undefined);
			}
		});
		this.ctlStart.valueChanges.subscribe(() => this.ctlFinish.setValue(undefined));
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

	get questions(): Question[] {
		if (this._quiz)
			return this._quiz.questions;
		return this.temp;
	}

	get canEdit(): boolean {
		return this._editable;
	}

	get canSave(): boolean {
		return !(this.editQuizForm.pristine || this.editQuizForm.invalid || this.editQuizForm.pending);
	}

	get canDelete(): boolean {
		return this.route.snapshot.params['id'] != 0;
	}

	get isTest(): boolean {
		return this.ctlType?.value === quizType.Test;
	}

	get dbName(): string {
		return this.ctlDatabase.value?.name ?? "";
	}

	isLast(question: Question): boolean {
		return question.order === this.questions.length;
	}

	//	debugFormGroup() :{
	//		const fg = this.editQuizForm;
	//
	//		Object.keys(fg.controls).forEach(key => {
	//		const ctl = fg.get(key);
	//		if (ctl?.invalid)
	//			console.log(`${key} : `, ctl.errors);
	//	})

	update() {
		this._quiz.isTest = this.isTest;
		if (!this._quiz.id) {
			this.quizService.create({ ...this._quiz, ...this.editQuizForm.value }).subscribe(res => {
				if (res)
					this.router.navigateByUrl("/");
			});
		} else {
			this.quizService.update({ ...this._quiz, ...this.editQuizForm.value }).subscribe(res => {
				if (res)
					this.router.navigateByUrl("/");
			});
		}
	}

	delete() {
		const dialogRef = this.dialog.open(ConfirmDeleteComponent);

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.quizService.deleteQuiz(this._quiz.id!).subscribe(() => {
					this.router.navigateByUrl("/");
				});
			}
		});
	}

	addQuestion(): void {
		const order: number = this.questions.length + 1;
		this.questions.push({
			order: order,
			solutions: [],
			previous: 0,
			next: 0,
		});
		this.ctlQuestions.setErrors({ questionBody: true });
	}

	deleteQuestion($event: number): void {
		if ($event >= 0)
			this.questions.splice($event, 1);
		for (let index = $event; index < this.questions.length; index++) {
			const element = this.questions[index];
			if (element && element.order) element.order--;
		}
		this.ctlQuestions.updateValueAndValidity();
	}

	swapQuestions(direction: 'up' | 'down', index: number): void {
		let destination: number = index + (direction === 'up' ? -1 : 1);
		let temp: Question = this.questions[index];
		if (temp && temp.order) temp.order += (direction === 'up' ? -1 : 1);
		temp = this.questions[destination];
		if (temp && temp.order) temp.order -= (direction === 'up' ? -1 : 1);
		this.questions.sort((q1, q2) => (q1.order ?? 0) - (q2.order ?? 0));
		this.cdr.detectChanges();
	}

	private getDatabases(): void {
		this.databaseService.getAll().subscribe(dbs => {
			this.dbs.data = dbs;
			this.ctlDatabase.setValue(dbs[0]);
		});
	}

	onBodyChange(body: string): void {
		let errors = this.ctlQuestions.errors || {};

		if (!body || body.trim().length < 2) {
			errors = { ...errors, questionBody: true };
		} else {
			let validBody = this.questions.every(question => (question.body?.trim().length ?? 0) >= 2);

			if (validBody) {
				delete errors['questionBody'];
			} else {
				errors = { ...errors, questionBody: true };
			}
		}

		if (Object.keys(errors).length === 0) {
			this.checkSolutions();
			return;
		} else {
			this.ctlQuestions.setErrors(errors);
		}
	}

	onSolutionChange($event: ValidationErrors): void {
		if ($event !== undefined)
			this.ctlQuestions.setErrors($event);
		else
			this.checkSolutions();
	}

	checkSolutions(): void {
		this.editQuizForm.markAsDirty();
		let errors = this.ctlQuestions.errors || {};
		let hasEmptySolution = false;
		let hasNoSolution = false;

		this.questions.forEach(question => {
			if (!question.solutions || question.solutions.length === 0) {
				hasNoSolution = true;
			} else {
				for (const solution of question.solutions) {
					if (!solution || !solution.sql || solution.sql.trim().length === 0) {
						hasEmptySolution = true;
						break;
					}
				}
			}
		});

		if (hasNoSolution) {
			errors = { ...errors, noSolution: true };
		} else {
			delete errors['noSolution'];
		}

		if (hasEmptySolution) {
			errors = { ...errors, emptySolution: true };
		} else {
			delete errors['emptySolution'];
		}

		if (Object.keys(errors).length === 0) {
			this.ctlQuestions.setErrors(null);
		} else {
			this.ctlQuestions.setErrors(errors);
		}
	}

	private emptyQuestion(): any {
		return () => {
			if (this.questions.length === 0)
				return { noQuestion: true };
			return null;
		};
	}
}