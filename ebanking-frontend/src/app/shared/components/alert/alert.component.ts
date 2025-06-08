import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'success' | 'warning' | 'error' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="alertClasses" *ngIf="visible">
      <div class="flex items-center gap-4">
        <div class="alert-icon">
          <svg *ngIf="type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          <svg *ngIf="type === 'warning'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
          <svg *ngIf="type === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
          <svg *ngIf="type === 'info'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </div>
        
        <div class="flex-1">
          <div *ngIf="title" class="alert-title">{{ title }}</div>
          <div class="alert-message">
            <ng-content></ng-content>
            <span *ngIf="message">{{ message }}</span>
          </div>
        </div>
        
        <button 
          *ngIf="dismissible" 
          class="alert-close"
          (click)="dismiss()"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .alert-title {
      font-weight: 600;
      margin-bottom: var(--spacing-xs);
    }

    .alert-message {
      font-size: var(--font-size-sm);
    }

    .alert-close {
      background: none;
      border: none;
      color: currentColor;
      cursor: pointer;
      padding: var(--spacing-xs);
      border-radius: var(--radius-sm);
      transition: background-color var(--transition-fast);
    }

    .alert-close:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .alert-icon {
      flex-shrink: 0;
    }
  `]
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() title?: string;
  @Input() message?: string;
  @Input() dismissible = false;
  @Input() visible = true;

  @Output() dismissed = new EventEmitter<void>();

  get alertClasses(): string {
    return `alert alert-${this.type}`;
  }

  dismiss(): void {
    this.visible = false;
    this.dismissed.emit();
  }
}
