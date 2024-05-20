import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { MainComponent } from './main/main.component';
import { TestComponent } from './test/test.component';
import { QuestionComponent } from './question/question.component';
import { TestPageComponent } from './test-page/test-page.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', component: MainComponent },
      { path: 'test', component: TestPageComponent },
      {
        path: 'test/:testId',
        component: TestComponent,
        children: [
          { path: 'question/:questionId', component: QuestionComponent },
        ],
      },
      { path: 'settings', component: MainComponent },
      { path: '**', redirectTo: '' },
    ],
  },
];
