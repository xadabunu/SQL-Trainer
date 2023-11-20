import { Routes, RouterModule } from '@angular/router';

import { CounterComponent } from '../components/counter/counter.component';
import { UserListComponent } from '../components/userlist/userlist.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'quizzes', pathMatch: 'full' },
  { path: 'counter', component: CounterComponent },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] }
  },
  { path: 'login', component: LoginComponent },
  { path: 'quizzes', component: QuizzListPageComponent, canActivate: [AuthGuard], data: { roles: [Role.User, Role.Admin]} },
  // { path: 'signup', component: SignUpComponent },  
  { path: 'newQuizz', component: NewQuizzComponent},
  { path: 'restricted', component: RestrictedComponent },
  { path: '**', component: UnknownComponent }
];

import { RestrictedComponent } from '../components/restricted/restricted.component';
import { LoginComponent } from '../components/login/login.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { AuthGuard } from '../services/auth.guard';
import { Role } from '../models/user';
import { QuizzListPageComponent } from '../components/quizzlist/quizzlist-page.component';
import { NewQuizzComponent } from '../components/new-quizz/newquizz.component';
// import { SignUpComponent } from '../components/signup/signup.component';

export const AppRoutes = RouterModule.forRoot(appRoutes);
