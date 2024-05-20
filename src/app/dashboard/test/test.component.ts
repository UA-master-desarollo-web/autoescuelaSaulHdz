import { Component } from '@angular/core';
import { TestService } from '../../core/test.service';
import {
  Router,
  RouterLink,
  RouterOutlet,
  ActivatedRoute,
} from '@angular/router';
import { Test } from '../../core/test/models/test';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { QuestionComponent } from '../question/question.component';
import { TestResultsComponent } from '../test-results/test-results.component';

@Component({
  selector: 'app-test',
  standalone: true,
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
  imports: [
    NgFor,
    QuestionComponent,
    RouterOutlet,
    RouterLink,
    NgIf,
    NgClass,
    TestResultsComponent,
  ],
})
export class TestComponent {
  availableTests: Test[] = [];

  testInProgress: boolean = false;
  testCompleted: boolean = false;

  test: Test | null = null;

  constructor(
    private testService: TestService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // subscribe to the test data
    this.testService.data$.subscribe((test) => {
      this.test = test;
    });

    this.route.params.subscribe((params) => {
      const testId = params['testId'];

      // get the initial test
      this.test = this.testService.getTestById(testId);

      // if the test is completed, show a message
      this.testCompleted = this.test?.result.remaining === 0;

      // if the url contains 'question', the test is in progress
      this.testInProgress = this.router.url.includes('question');
    });
  }

  returnToDashboard() {
    // if the test is completed, show a message
    this.testCompleted = this.test?.result.remaining === 0;

    // if the url contains 'question', the test is in progress
    this.testInProgress = this.router.url.includes('question');

    this.router.navigate(['dashboard/test']);
  }

  reviewResults() {
    // if the test is completed, show a message
    this.testCompleted = this.test?.result.remaining === 0;

    // if the url contains 'question', the test is in progress
    this.testInProgress = this.router.url.includes('question');

    this.router.navigate(['dashboard/test', this.test?.id]);
  }

  startTest() {
    if (this.test === null) {
      console.error('Test not loaded.');
      return;
    }

    // if the test is completed, show a message
    this.testCompleted = this.test?.result.remaining === 0;

    // if the url contains 'question', the test is in progress
    this.testInProgress = this.router.url.includes('question');

    // Redirect to the first question
    this.router.navigate([
      'dashboard/test',
      this.test.id,
      'question',
      this.testService.nextQuestionId(this.test),
    ]);
  }
}
