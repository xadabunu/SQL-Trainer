import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DefaultValueAccessor, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutes } from '../routing/app.routing';

import { AppComponent } from '../components/app/app.component';
import { NavMenuComponent } from '../components/nav-menu/nav-menu.component';
import { UserListComponent } from '../components/userlist/userlist.component';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { JwtInterceptor } from '../interceptors/jwt.interceptor';
import { LoginComponent } from '../components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SetFocusDirective } from '../directives/setfocus.directive';
import { EditUserComponent } from '../components/edit-user/edit-user.component';
import { SharedModule } from './shared.module';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { fr } from 'date-fns/locale';
import { QuizListPageComponent } from '../components/quizlist/quizlist-page.component';
import { EditQuizComponent } from '../components/edit-quiz/edit-quiz.component';
import { EditQuestionComponent } from '../components/edit-question/edit-question.component';
import { TestCodeEditorComponent } from '../components/test-code-editor/test-code-editor.component';
import { CodeEditorComponent } from '../components/code-editor/code-editor.component';
import { QuestionComponent } from '../components/question/question.component';
import { QueryResultComponent } from '../components/question/query-result.component';
import { QuizListComponent } from '../components/quizlist/quizlist.component';
import { ConfirmDeleteComponent } from '../components/edit-quiz/confirm-delete';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    UserListComponent,
    LoginComponent,
    UnknownComponent,
    RestrictedComponent,
    SetFocusDirective,
    EditUserComponent,
    QuizListPageComponent,
    QuizListComponent,
    EditQuizComponent,
    EditQuestionComponent,
    CodeEditorComponent,
    TestCodeEditorComponent,
	  QuestionComponent,
    QueryResultComponent,
    ConfirmDeleteComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutes,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: fr },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['dd/MM/yyyy'],
        },
        display: {
          dateInput: 'dd/MM/yyyy',
          monthYearLabel: 'MMM yyyy',
          dateA11yLabel: 'dd/MM/yyyy',
          monthYearA11yLabel: 'MMM yyyy',
        },
      },
    },  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    DefaultValueAccessor.prototype.registerOnChange = function (fn: (_: string | null) => void): void {
      this.onChange = (value: string | null) => {
          fn(value === '' ? null : value);
      };
    };
  }
}
