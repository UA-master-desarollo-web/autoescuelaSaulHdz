import { Component } from '@angular/core';
import { Test } from '../../core/test/models/test';
import { TestService } from '../../core/test.service';
import { NgFor, NgIf, PercentPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [NgFor, NgIf, RouterModule, PercentPipe],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.css',
})
export class TestPageComponent {
  finishedTests: Test[] = [];
  unfinishedTests: Test[] = [];

  constructor(private testService: TestService, private router: Router) {}

  ngOnInit() {
    this.testService.getAvailableTests().map((test) => {
      if (test.result.remaining === 0) {
        this.finishedTests.push(test);
      } else {
        this.unfinishedTests.push(test);
      }
    });
  }

  clearTests(): void {
    this.testService.clearTests();
    this.finishedTests = [];
    this.unfinishedTests = [];
  }

  continueTest(test: Test): void {
    let testId = test.id;
    let questionId = this.testService.nextQuestionId(testId);

    this.router.navigate(['dashboard/test', testId, 'question', questionId]);
  }

  reviewTest(test: Test): void {
    this.router.navigate(['dashboard/test', test.id]);
  }

  startNewTestFromMistakes(): void {
    let newTest = this.testService.newTestFromMistakes();

    this.router.navigate([
      'dashboard/test',
      newTest.id,
      'question',
      newTest.questions[0].id,
    ]);
  }

  startNewTest(): void {
    let newTest = this.testService.newTest();

    this.router.navigate([
      'dashboard/test',
      newTest.id,
      'question',
      newTest.questions[0].id,
    ]);
  }
}
