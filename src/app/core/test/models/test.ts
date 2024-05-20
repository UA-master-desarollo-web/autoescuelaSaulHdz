import { TestQuestion } from './question';

export interface Test {
  id: string;
  date: Date;
  data: string;
  result: {
    remaining: number;
    correct: number;
    incorrect: number;
  };
  questions: TestQuestion[];
  retryFrom?: string;
}
