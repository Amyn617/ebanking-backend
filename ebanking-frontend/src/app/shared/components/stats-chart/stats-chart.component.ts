import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

@Component({
  selector: 'app-stats-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-chart">
      <div class="chart-header" *ngIf="title">
        <h3 class="chart-title">{{ title }}</h3>
        <p class="chart-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
      </div>

      <!-- Graphique en barres -->
      <div *ngIf="type === 'bar'" class="bar-chart">
        <div *ngFor="let item of chartData" class="bar-item">
          <div class="bar-label">{{ item.label }}</div>
          <div class="bar-container">
            <div 
              class="bar-fill" 
              [style.width.%]="getPercentage(item.value)"
              [style.background-color]="item.color || '#3b82f6'"
            ></div>
          </div>
          <div class="bar-value">{{ formatValue(item.value) }}</div>
        </div>
      </div>

      <!-- Graphique en secteurs (donut) -->
      <div *ngIf="type === 'donut'" class="donut-chart">
        <div class="donut-container">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle
              *ngFor="let item of chartData; let i = index"
              cx="100"
              cy="100"
              r="80"
              fill="none"
              [attr.stroke]="item.color || getDefaultColor(i)"
              stroke-width="20"
              [attr.stroke-dasharray]="getStrokeDashArray(item.value)"
              [attr.stroke-dashoffset]="getStrokeDashOffset(i)"
              [attr.transform]="'rotate(-90 100 100)'"
            />
            <text x="100" y="100" text-anchor="middle" dy="0.3em" class="donut-center-text">
              {{ getTotalValue() }}
            </text>
          </svg>
        </div>
        <div class="donut-legend">
          <div *ngFor="let item of chartData; let i = index" class="legend-item">
            <div 
              class="legend-color" 
              [style.background-color]="item.color || getDefaultColor(i)"
            ></div>
            <span class="legend-label">{{ item.label }}</span>
            <span class="legend-value">{{ formatValue(item.value) }}</span>
          </div>
        </div>
      </div>

      <!-- Graphique linéaire simple -->
      <div *ngIf="type === 'line'" class="line-chart">
        <div class="line-container">
          <svg width="100%" height="200" viewBox="0 0 400 200">
            <polyline
              [attr.points]="getLinePoints()"
              fill="none"
              stroke="#3b82f6"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle
              *ngFor="let point of getLinePointsArray(); let i = index"
              [attr.cx]="point.x"
              [attr.cy]="point.y"
              r="4"
              fill="#3b82f6"
            />
          </svg>
        </div>
        <div class="line-labels">
          <div *ngFor="let item of chartData" class="line-label">
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-chart {
      background-color: var(--bg-card);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
    }

    .chart-header {
      margin-bottom: var(--spacing-lg);
    }

    .chart-title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--spacing-xs);
    }

    .chart-subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    /* Graphique en barres */
    .bar-chart {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .bar-item {
      display: grid;
      grid-template-columns: 1fr 2fr auto;
      align-items: center;
      gap: var(--spacing-md);
    }

    .bar-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      font-weight: 500;
    }

    .bar-container {
      height: 20px;
      background-color: var(--bg-secondary);
      border-radius: var(--radius-sm);
      overflow: hidden;
      position: relative;
    }

    .bar-fill {
      height: 100%;
      border-radius: var(--radius-sm);
      transition: width 0.8s ease-out;
      position: relative;
    }

    .bar-value {
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--text-primary);
      min-width: 60px;
      text-align: right;
    }

    /* Graphique donut */
    .donut-chart {
      display: flex;
      align-items: center;
      gap: var(--spacing-xl);
    }

    .donut-container {
      flex-shrink: 0;
    }

    .donut-center-text {
      font-size: 18px;
      font-weight: 600;
      fill: var(--text-primary);
    }

    .donut-legend {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .legend-label {
      flex: 1;
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .legend-value {
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--text-primary);
    }

    /* Graphique linéaire */
    .line-chart {
      display: flex;
      flex-direction: column;
    }

    .line-container {
      margin-bottom: var(--spacing-md);
    }

    .line-labels {
      display: flex;
      justify-content: space-between;
      padding: 0 var(--spacing-sm);
    }

    .line-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      text-align: center;
    }

    @media (max-width: 768px) {
      .donut-chart {
        flex-direction: column;
        gap: var(--spacing-lg);
      }
      
      .bar-item {
        grid-template-columns: 1fr;
        gap: var(--spacing-sm);
      }
    }
  `]
})
export class StatsChartComponent implements OnInit {
  @Input() type: 'bar' | 'donut' | 'line' = 'bar';
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() data: ChartData[] = [];
  @Input() valueFormat: 'number' | 'currency' | 'percentage' = 'number';

  chartData: ChartData[] = [];
  maxValue = 0;
  totalValue = 0;

  private defaultColors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
  ];

  ngOnInit(): void {
    this.chartData = [...this.data];
    this.calculateValues();
  }

  private calculateValues(): void {
    this.maxValue = Math.max(...this.chartData.map(item => item.value));
    this.totalValue = this.chartData.reduce((sum, item) => sum + item.value, 0);
  }

  getPercentage(value: number): number {
    return this.maxValue > 0 ? (value / this.maxValue) * 100 : 0;
  }

  formatValue(value: number): string {
    switch (this.valueFormat) {
      case 'currency':
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR'
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString('fr-FR');
    }
  }

  getTotalValue(): string {
    return this.formatValue(this.totalValue);
  }

  getDefaultColor(index: number): string {
    return this.defaultColors[index % this.defaultColors.length];
  }

  // Méthodes pour le graphique donut
  getStrokeDashArray(value: number): string {
    const circumference = 2 * Math.PI * 80; // r = 80
    const percentage = this.totalValue > 0 ? (value / this.totalValue) : 0;
    const strokeLength = circumference * percentage;
    return `${strokeLength} ${circumference}`;
  }

  getStrokeDashOffset(index: number): number {
    const circumference = 2 * Math.PI * 80;
    let offset = 0;
    for (let i = 0; i < index; i++) {
      const percentage = this.totalValue > 0 ? (this.chartData[i].value / this.totalValue) : 0;
      offset += circumference * percentage;
    }
    return -offset;
  }

  // Méthodes pour le graphique linéaire
  getLinePoints(): string {
    const width = 400;
    const height = 200;
    const padding = 20;
    
    return this.chartData.map((item, index) => {
      const x = padding + (index * (width - 2 * padding)) / (this.chartData.length - 1);
      const y = height - padding - ((item.value / this.maxValue) * (height - 2 * padding));
      return `${x},${y}`;
    }).join(' ');
  }

  getLinePointsArray(): {x: number, y: number}[] {
    const width = 400;
    const height = 200;
    const padding = 20;
    
    return this.chartData.map((item, index) => {
      const x = padding + (index * (width - 2 * padding)) / (this.chartData.length - 1);
      const y = height - padding - ((item.value / this.maxValue) * (height - 2 * padding));
      return { x, y };
    });
  }
}
