import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'ebanking-theme';
  private themeSubject = new BehaviorSubject<Theme>('dark');
  
  public theme$ = this.themeSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    const theme = savedTheme || 'dark'; // Mode sombre par défaut
    this.setTheme(theme);
  }

  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }

  toggleTheme(): void {
    const currentTheme = this.themeSubject.value;
    const newTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    
    if (theme === 'light') {
      // Variables pour le thème clair
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8fafc');
      root.style.setProperty('--bg-tertiary', '#e2e8f0');
      root.style.setProperty('--bg-card', '#ffffff');
      root.style.setProperty('--bg-hover', '#f1f5f9');
      
      root.style.setProperty('--text-primary', '#0f172a');
      root.style.setProperty('--text-secondary', '#475569');
      root.style.setProperty('--text-muted', '#64748b');
      root.style.setProperty('--text-inverse', '#f8fafc');
      
      root.style.setProperty('--border-primary', '#e2e8f0');
      root.style.setProperty('--border-secondary', '#cbd5e1');
      
      root.style.setProperty('--success-bg', '#f0fdf4');
      root.style.setProperty('--warning-bg', '#fffbeb');
      root.style.setProperty('--error-bg', '#fef2f2');
      root.style.setProperty('--info-bg', '#eff6ff');
    } else {
      // Variables pour le thème sombre (par défaut)
      root.style.setProperty('--bg-primary', '#0f172a');
      root.style.setProperty('--bg-secondary', '#1e293b');
      root.style.setProperty('--bg-tertiary', '#334155');
      root.style.setProperty('--bg-card', '#1e293b');
      root.style.setProperty('--bg-hover', '#334155');
      
      root.style.setProperty('--text-primary', '#f8fafc');
      root.style.setProperty('--text-secondary', '#cbd5e1');
      root.style.setProperty('--text-muted', '#94a3b8');
      root.style.setProperty('--text-inverse', '#0f172a');
      
      root.style.setProperty('--border-primary', '#334155');
      root.style.setProperty('--border-secondary', '#475569');
      
      root.style.setProperty('--success-bg', '#064e3b');
      root.style.setProperty('--warning-bg', '#78350f');
      root.style.setProperty('--error-bg', '#7f1d1d');
      root.style.setProperty('--info-bg', '#1e3a8a');
    }
  }
}
