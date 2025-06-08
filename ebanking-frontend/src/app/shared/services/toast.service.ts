import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toasts.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  show(toast: Omit<Toast, 'id'>): void {
    const newToast: Toast = {
      ...toast,
      id: this.generateId(),
      duration: toast.duration ?? 5000,
      dismissible: toast.dismissible ?? true,
    };

    const currentToasts = this.toasts.value;
    this.toasts.next([...currentToasts, newToast]);

    // Auto-dismiss after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.dismiss(newToast.id);
      }, newToast.duration);
    }
  }

  success(message: string, title?: string, duration?: number): void {
    this.show({
      type: 'success',
      title,
      message,
      duration,
    });
  }

  error(message: string, title?: string, duration?: number): void {
    this.show({
      type: 'error',
      title,
      message,
      duration: duration ?? 7000, // Erreurs restent plus longtemps
    });
  }

  warning(message: string, title?: string, duration?: number): void {
    this.show({
      type: 'warning',
      title,
      message,
      duration,
    });
  }

  info(message: string, title?: string, duration?: number): void {
    this.show({
      type: 'info',
      title,
      message,
      duration,
    });
  }

  dismiss(id: string): void {
    const currentToasts = this.toasts.value;
    this.toasts.next(currentToasts.filter((toast) => toast.id !== id));
  }

  clear(): void {
    this.toasts.next([]);
  }
}
