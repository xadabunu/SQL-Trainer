import { Component } from "@angular/core";
import { MatTableState } from "src/app/helpers/mattable.state";
import { StateService } from "src/app/services/state.service";
import { AuthenticationService } from "src/app/services/authentication.service";
import { Role } from "src/app/models/user";

@Component({
	selector: 'quizlist-page',
	templateUrl: './quizlist-page.component.html'
})
export class QuizListPageComponent {
	
	filter: string = '';
	state: MatTableState;

	constructor(
		private authenticationService: AuthenticationService,
		private stateService: StateService
	) {
		this.state = this.stateService.quizListState;
		this.filter = this.state.filter;
	}
	
	/**
	 * On sauvegarde le filtre dans le state du composant parent
	 * car c'est lui qui fournit son filtre aux enfants quand on
	 * revient sur la page.
	 */
	filterChanged(e: KeyboardEvent): void {
		this.state.filter = this.filter;
	}

	get isTeacher() {
        return this.authenticationService.currentUser && this.authenticationService.currentUser.role === Role.Teacher;
    }
}