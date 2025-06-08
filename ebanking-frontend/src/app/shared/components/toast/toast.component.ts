import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let toast of toasts"
        class="toast"
        [class]="getToastClasses(toast)"
        [@slideIn]
      >
        <div class="toast-content">
          <div class="toast-icon">
            <svg *ngIf="toast.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <svg *ngIf="toast.type === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
            <svg *ngIf="toast.type === 'warning'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
            <svg *ngIf="toast.type === 'info'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>
          
          <div class="toast-body">
            <div *ngIf="toast.title" class="toast-title">{{ toast.title }}</div>
            <div class="toast-message">{{ toast.message }}</div>
          </div>
          
          <button
            *ngIf="toast.dismissible"
            class="toast-close"
            (click)="dismiss(toast.id)"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <div *ngIf="toast.duration && toast.duration > 0" class="toast-progress">
          <div class="toast-progress-bar" [style.animation-duration.ms]="toast.duration"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: var(--spacing-lg);
      right: var(--spacing-lg);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      max-width: 400px;
    }

    .toast {
      background-color: var(--bg-card);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
      position: relative;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .toast-success {
      border-left: 4px solid var(--success);
    }

    .toast-error {
      border-left: 4px solid var(--error);
    }

    .toast-warning {
      border-left: 4px solid var(--warning);
    }

    .toast-info {
      border-left: 4px solid var(--info);
    }

    .toast-content {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
    }

    .toast-icon {
      flex-shrink: 0;
      margin-top: 2px;
    }

    .toast-success .toast-icon {
      color: var(--success);
    }

    .toast-error .toast-icon {
      color: var(--error);
    }

    .toast-warning .toast-icon {
      color: var(--warning);
    }

    .toast-info .toast-icon {
      color: var(--info);
    }

    .toast-body {
      flex: 1;
    }

    .toast-title {
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--spacing-xs);
    }

    .toast-message {
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
      line-height: 1.4;
    }

    .toast-close {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: var(--spacing-xs);
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
      flex-shrink: 0;
    }

    .toast-close:hover {
      color: var(--text-primary);
      background-color: var(--bg-hover);
    }

    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background-color: rgba(255, 255, 255, 0.1);
    }

    .toast-progress-bar {
      height: 100%;
      background-color: currentColor;
      animation: progress linear;
      transform-origin: left;
    }

    .toast-success .toast-progress-bar {
      background-color: var(--success);
    }

    .toast-error .toast-progress-bar {
      background-color: var(--error);
    }

    .toast-warning .toast-progress-bar {
      background-color: var(--warning);
    }

    .toast-info .toast-progress-bar {
      background-color: var(--info);
    }

    @keyframes progress {
      from {
        transform: scaleX(1);
      }
      to {
        transform: scaleX(0);
      }
    }

    @media (max-width: 768px) {
      .toast-container {
        top: var(--spacing-md);
        right: var(--spacing-md);
        left: var(--spacing-md);
        max-width: none;
      }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription?: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscription = this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getToastClasses(toast: Toast): string {
    return `toast-${toast.type}`;
  }

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}
