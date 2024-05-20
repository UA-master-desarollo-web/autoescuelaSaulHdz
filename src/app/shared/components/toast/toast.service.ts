// toast.service.ts
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export enum ToastStatus {
  Success = 'success',
  Error = 'error',
  // Add more statuses as needed
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts: { title: string; text: string; status: ToastStatus }[] = [];
  private toastSubject = new Subject<
    { title: string; text: string; status: ToastStatus }[]
  >();

  showToast(title: string, text: string, status: ToastStatus): void {
    const toast = { title, text, status };
    this.toasts.push(toast);
    this.toastSubject.next([...this.toasts]);

    // Remove the toast after 3 seconds
    setTimeout(() => {
      this.toasts = this.toasts.filter((t) => t !== toast);
      this.toastSubject.next([...this.toasts]);
    }, 3000);
  }

  getToast(): Observable<
    { title: string; text: string; status: ToastStatus }[]
  > {
    return this.toastSubject.asObservable();
  }
}
