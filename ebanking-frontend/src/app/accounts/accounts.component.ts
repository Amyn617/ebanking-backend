import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-accounts',
  standalone: false,
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css',
})
export class AccountsComponent implements OnInit {
  // Stats for dashboard cards
  totalAccounts: number = 0;
  activeAccounts: number = 0;
  pendingAccounts: number = 0;
  suspendedAccounts: number = 0;

  searchFormGroup: FormGroup | undefined;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize with dummy data for demonstration
    this.totalAccounts = 127;
    this.activeAccounts = 98;
    this.pendingAccounts = 24;
    this.suspendedAccounts = 5;

    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control(''),
    });
  }
}
