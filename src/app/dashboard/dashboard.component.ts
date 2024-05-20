import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';

// remove when ready
import { TestService } from '../core/test.service';

import { Router, RouterModule } from '@angular/router';
import {
  ToastService,
  ToastStatus,
} from '../shared/components/toast/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [RouterModule],
})
export class DashboardComponent implements OnInit {
  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
    // remove when ready
    private testService: TestService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getLoggedInUser();
  }

  // remove when ready
  navigateTest(): void {
    // create a new test
    let test = this.testService.newTest();

    // navigate to the test
    this.router.navigate(['dashboard/test', test.id]);
  }

  logout(): void {
    this.authService.logout();
    this.toast.showToast(
      'Goodbye',
      'You have successfully logged out',
      ToastStatus.Success
    );
    this.router.navigate(['/']);
  }
}
