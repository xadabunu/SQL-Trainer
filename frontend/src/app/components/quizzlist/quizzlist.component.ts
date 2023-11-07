import { Component } from "@angular/core";
import { Quizz } from '../../models/quizz';
import { QuizzService } from "src/app/services/quizz.service";

@Component({
	selector: 'app-quizzlist',
	templateUrl: './quizzlist.component.html'
})
export class QuizzListComponent {
	quizzes: Quizz[] = [];

	constructor(private quizzService: QuizzService) {
		quizzService.getAll().subscribe(quizzes => {
			this.quizzes = quizzes;
		})
	}
}