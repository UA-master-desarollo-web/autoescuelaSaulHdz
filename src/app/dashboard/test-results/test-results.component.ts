import { Component } from '@angular/core';
import { Test } from '../../core/test/models/test';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import {
  RouterLink,
  RouterModule,
  Router,
  ActivatedRoute,
} from '@angular/router';
import { TestService } from '../../core/test.service';

@Component({
  selector: 'app-test-results',
  standalone: true,
  templateUrl: './test-results.component.html',
  styleUrls: ['./test-results.component.css'],
  imports: [NgClass, NgIf, NgFor, DatePipe, RouterLink, RouterModule],
})
export class TestResultsComponent {
  test: Test | null = null;

  constructor(
    private testService: TestService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.testService.data$.subscribe((test) => {
      this.test = test;
    });

    this.route.params.subscribe((params) => {
      const testId = params['testId'];

      this.test = this.testService.getTestById(testId);
    });
  }
}
