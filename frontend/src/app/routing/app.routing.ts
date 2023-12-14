import { Routes, RouterModule } from '@angular/router';

import { UserListComponent } from '../components/userlist/userlist.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'quizzes', pathMatch: 'full' },
  // {
  //   path: 'users',
  //   component: UserListComponent,
  //   canActivate: [AuthGuard],
  //   data: { roles: [Role.Teacher] }
  // },
  { path: 'login', component: LoginComponent },
  {
    path: 'quizzes',
    component: QuizListPageComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Student, Role.Teacher]}
  },
  {
	  path: 'question/:id',
	  component: QuestionComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Student] }
  },
  // { path: 'signup', component: SignUpComponent },  
  {
    path: 'editQuiz/:id',
    component: EditQuizComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Teacher]}
  },
  { path: 'test', component: TestCodeEditorComponent },
  { path: 'restricted', component: RestrictedComponent },
  { path: '**', component: UnknownComponent }
];

import { RestrictedComponent } from '../components/restricted/restricted.component';
import { LoginComponent } from '../components/login/login.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { AuthGuard } from '../services/auth.guard';
import { Role } from '../models/user';
import { EditQuizComponent } from '../components/edit-quiz/edit-quiz.component';
import { TestCodeEditorComponent } from '../components/test-code-editor/test-code-editor.component';
import { QuestionComponent } from '../components/question/question.component';
import { QuizListPageComponent } from '../components/quizlist/quizlist-page.component';
// import { SignUpComponent } from '../components/signup/signup.component';

export const AppRoutes = RouterModule.forRoot(appRoutes);
