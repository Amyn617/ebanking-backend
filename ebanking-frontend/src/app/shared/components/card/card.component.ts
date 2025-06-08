import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.card-hover]="hover">
      <div *ngIf="title || hasHeaderContent" class="card-header">
        <h3 *ngIf="title" class="card-title">{{ title }}</h3>
        <ng-content select="[slot=header]"></ng-content>
      </div>
      
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      
      <div *ngIf="hasFooterContent" class="card-footer">
        <ng-content select="[slot=footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card-title {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-primary);
    }

    .card-hover {
      transition: all var(--transition-normal);
      cursor: pointer;
    }

    .card-hover:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
  `]
})
export class CardComponent {
  @Input() title?: string;
  @Input() hover = false;

  // Ces propriétés seront utilisées pour détecter si du contenu est projeté
  hasHeaderContent = false;
  hasFooterContent = false;

  ngAfterContentInit() {
    // Dans une implémentation complète, on pourrait détecter le contenu projeté
    // Pour l'instant, on assume que le contenu existe si les slots sont utilisés
  }
}
