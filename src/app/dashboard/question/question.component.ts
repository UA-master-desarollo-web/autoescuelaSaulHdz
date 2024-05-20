import { Component, Input } from '@angular/core';
import { TestQuestion } from '../../core/test/models/question';
import { TestService } from '../../core/test.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-question',
  standalone: true,
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
  imports: [NgFor, ReactiveFormsModule, NgClass, NgIf],
})
export class QuestionComponent {
  questionForm = new FormControl('question', [Validators.required]);

  question: TestQuestion | null = null;

  testId: string = '';
  questionId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      // get the test id from the route
      // keep in mind it might have a trailing zero
      this.testId = this.route.parent?.snapshot.paramMap.get(
        'testId'
      ) as string;

      // get the question from the route id
      // keep in mind it might have a trailing zero
      this.questionId = params.get('questionId') as string;

      if (this.questionId === '' || this.testId === '') {
        return;
      }

      // get the question from the service
      this.question = this.testService.getTestQuestionById(
        this.questionId,
        this.testId
      );

      // if the question is not found, redirect to the test
      if (this.question === null) {
        this.router.navigate(['dashboard/test', this.testId]);
      }

      if (this.isQuestionAnswered()) {
        this.questionForm.disable();
      } else {
        this.questionForm.enable();
      }

      // set the form value to the selected answer
      if (this.question?.respuesta !== undefined) {
        this.questionForm.setValue(this.question.respuesta);
      }
    });
  }

  isQuestionAnswered(): boolean {
    return this.question?.acertada !== undefined;
  }

  navigateToNextQuestion() {
    let nextQuestion = this.testService.nextQuestionId(this.testId);

    this.router.navigate([
      'dashboard/test',
      this.testId,
      'question',
      nextQuestion,
    ]);
  }

  confirmAnswer() {
    if (this.question === null || !this.questionForm.value) {
      return;
    }

    this.testService.selectAnswer(
      this.testId,
      this.question.id,
      this.questionForm.value
    );

    // clear the form
    this.questionForm.reset();

    this.navigateToNextQuestion();
  }
}
