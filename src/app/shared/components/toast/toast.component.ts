// toast.component.ts
import { Component, OnInit } from '@angular/core';
import { ToastService, ToastStatus } from './toast.service';
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  imports: [NgFor, NgClass],
})
export class ToastComponent implements OnInit {
  toasts: { title: string; text: string; status: ToastStatus }[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.getToast().subscribe((toasts) => {
      this.toasts = toasts;
    });
  }
}
