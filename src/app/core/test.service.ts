import { Injectable } from '@angular/core';
import { data_A1 } from './test/data_A1';
import { TestQuestion } from './test/models/question';
import { Test } from './test/models/test';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor() {}

  // This is the data that will be used
  // read from the data_A1.ts file
  getTestContent() {
    return data_A1;
  }

  // This is the current test, its an observable
  // that will be updated when a new test is created
  // or when a test is updated
  private resultSubject = new Subject<Test>();
  data$: Observable<Test> = this.resultSubject.asObservable();

  // This function will update the current test observable
  updateObservableTest(updatedTest: Test | string): void {
    if (typeof updatedTest === 'string') {
      updatedTest = this.getTestById(updatedTest) as Test;
    }
    this.resultSubject.next(updatedTest);
  }

  // This function will randomize the correct answer
  // so the correct answer is not always on the same position
  randomizeCorrectAnswer(question: TestQuestion): TestQuestion {
    question.respuestas.sort(() => Math.random() - 0.5);
    return question;
  }

  // This function will transform the raw question
  // from the data_A1.ts file to a TestQuestion
  // with random order of the answers
  transformRawQuestion(questionRaw: any): TestQuestion {
    const question: TestQuestion = {
      // This function will generate a random id
      id: Math.random().toString(36).substring(2, 8),
      img: questionRaw.img,
      pregunta: questionRaw.pregunta,
      respuestas: [questionRaw['a.'], questionRaw['b.'], questionRaw['c.']],
    };
    return this.randomizeCorrectAnswer(question);
  }

  // This function will return a random question
  // from the data_A1.ts file
  getRandomQuestion(): TestQuestion {
    const questionRaw = data_A1[Math.floor(Math.random() * data_A1.length)];
    return this.transformRawQuestion(questionRaw);
  }

  // This function will return a question object
  // by the text of the question
  getQuestionObject(questionText: string): TestQuestion | null {
    const questionRaw = data_A1.find(
      (question) => question.pregunta === questionText
    );

    return questionRaw ? this.transformRawQuestion(questionRaw) : null;
  }

  // This function will return a question by its id
  // from the current test in a TestQuestion format
  getTestQuestionById(questionId: string, testId: string): TestQuestion | null {
    const test = this.getTestById(testId);
    return test
      ? test.questions.find((q) => q.id === questionId) || null
      : null;
  }

  // This function will create a new test
  // with random questions from the data_A1.ts file
  newTest(): Test {
    const questionsRaw = data_A1.sort(() => Math.random() - 0.5).slice(0, 40);
    const test: Test = {
      id: Math.random().toString(36).substring(2, 8),
      date: new Date(),
      data: 'data_A1',
      result: {
        remaining: 40,
        correct: 0,
        incorrect: 0,
      },
      questions: [],
    };
    questionsRaw.forEach((questionRaw) => {
      const question = this.transformRawQuestion(questionRaw);
      test.questions.push(question);
    });
    this.saveTest(test);
    return test;
  }

  // This function will return a test by its id
  // from the local storage
  getTestById(id: string): Test | null {
    const testRaw = localStorage.getItem(id);
    if (!testRaw) {
      return null;
    }
    const test: Test = JSON.parse(testRaw);
    this.updateTest(test);
    return test;
  }

  // This function will return a question by its id
  // from the data_A1.ts file in a TestQuestion format
  // with the correct answer and explanation
  getQuestionObjectFull(questionText: string): TestQuestion | null {
    const questionRaw = data_A1.find(
      (question) => question.pregunta === questionText
    );
    if (!questionRaw) {
      return null;
    }
    let question: TestQuestion = this.transformRawQuestion(questionRaw);
    question.correcta = questionRaw['a.'];
    question.explicacion = questionRaw.explicacion;
    return question;
  }

  // This function will save a test to the local storage
  // and update the current test observable
  saveTest(test: Test): void {
    localStorage.setItem(test.id, JSON.stringify(test));
    this.updateObservableTest(test);
  }

  // This function will update a test to the local storage
  // and update the current test observable
  updateTest(test: Test): void {
    localStorage.setItem(test.id, JSON.stringify(test));
    this.updateObservableTest(test);
  }

  // This function will delete a test from the local storage
  deleteTest(test: string | Test): void {
    if (typeof test === 'string') {
      test = this.getTestById(test) as Test;
    }
    localStorage.removeItem(test.id);
  }

  clearTests(): void {
    Object.keys(localStorage).forEach((key) => {
      if (key.length === 6) {
        localStorage.removeItem(key);
      }
    });
  }

  // This function will mark a question on a test as correct or incorrect
  // and update the test result
  markQuestion(
    test: string | Test,
    question: TestQuestion,
    correct: boolean
  ): void {
    if (typeof test === 'string') {
      test = this.getTestById(test) as Test;
    } else {
      test = this.getTestById(test.id) as Test;
    }
    if (!test) {
      return;
    }
    let respuesta = question.respuesta;
    question = this.getQuestionObjectFull(question.pregunta) as TestQuestion;
    if (!question) {
      return;
    }
    console.log(test, question, correct);

    question.acertada = correct;
    question.respuesta = respuesta;
    let index = test.questions.findIndex(
      (q: TestQuestion) => q.pregunta === question.pregunta
    );
    test.questions[index] = question;
    test.result.remaining = test.questions.filter(
      (q: TestQuestion) => q.acertada === undefined
    ).length;
    test.result.correct = test.questions.filter(
      (q: TestQuestion) => q.acertada === true
    ).length;
    test.result.incorrect = test.questions.filter(
      (q: TestQuestion) => q.acertada === false
    ).length;
    this.updateTest(test);
  }

  verifyAnswer(question: string | TestQuestion, answer: string): boolean {
    if (typeof question === 'string') {
      question = this.getQuestionObjectFull(question) as TestQuestion;
    } else {
      question = this.getQuestionObjectFull(question.pregunta) as TestQuestion;
    }
    return question.correcta === answer;
  }

  selectAnswer(
    test: Test | string,
    question: TestQuestion | string,
    answer: string
  ): void {
    if (typeof test === 'string') {
      test = this.getTestById(test) as Test;
    }
    if (!test) {
      return;
    }
    if (typeof question === 'string') {
      question = test.questions.find(
        (q: TestQuestion) => q.id === question
      ) as TestQuestion;
    }
    if (!question) {
      return;
    }
    let correct = this.verifyAnswer(question, answer);
    question.respuesta = answer;
    this.markQuestion(test, question, correct);
  }

  nextQuestion(test: Test | string): TestQuestion {
    if (typeof test === 'string') {
      test = this.getTestById(test) as Test;
    }
    let question = test.questions.find(
      (question: TestQuestion) => question.acertada === undefined
    );

    return question || test.questions[0];
  }

  nextQuestionId(test: Test | string): string {
    let question = this.nextQuestion(test);
    return question.id;
  }

  resetTest(test: Test | string): void {
    if (typeof test === 'string') {
      test = this.getTestById(test) as Test;
    }
    test.result.remaining = 40;
    test.result.correct = 0;
    test.result.incorrect = 0;
    test.questions.forEach((question: TestQuestion) => {
      question.acertada = undefined;
    });
    this.updateTest(test);
  }

  copyTest(test: Test | string): Test {
    if (typeof test === 'string') {
      test = this.getTestById(test) as Test;
    }
    let testCopy: Test = JSON.parse(JSON.stringify(test));
    testCopy.id = Math.random().toString(36).substring(2, 8);
    testCopy.date = new Date();
    this.resetTest(testCopy);
    return testCopy;
  }

  newTestFromMistakes(): Test {
    let tests: Test[] = Object.keys(localStorage)
      .filter((key) => key.length === 6) // Filter keys with length 6
      .map((key) => this.getTestById(key))
      .filter((test) => test !== null) as Test[];
    let incorrectQuestions: TestQuestion[] = [];

    tests.map((test) => {
      test.questions.map((question) => {
        if (!question.acertada) {
          incorrectQuestions.push(question);
        }
      });
    });

    // Randomize the questions
    incorrectQuestions = incorrectQuestions.sort(() => Math.random() - 0.5);

    // if there are less than 40 incorrect questions, fill the test with random questions
    let fill = 40 - incorrectQuestions.length;
    while (fill > 0) {
      let question = this.getRandomQuestion();
      // if the question is already in the test, skip it
      if (incorrectQuestions.find((q) => q.pregunta === question.pregunta)) {
        continue;
      }
      incorrectQuestions.push(question);
      fill--;
    }

    incorrectQuestions = incorrectQuestions.slice(0, 40);
    incorrectQuestions = incorrectQuestions.sort(() => Math.random() - 0.5);
    let test: Test = {
      id: Math.random().toString(36).substring(2, 8),
      date: new Date(),
      data: 'data_A1',
      result: {
        remaining: 40,
        correct: 0,
        incorrect: 0,
      },
      questions: incorrectQuestions,
    };

    console.log(test);

    this.saveTest(test);
    return test;
  }

  getAvailableTests(): Test[] {
    let tests: Test[] = Object.keys(localStorage)
      .filter((key) => key.length === 6) // Filter keys with length 6
      .map((key) => this.getTestById(key))
      .filter((test) => test !== null) as Test[];
    return tests;
  }
}
