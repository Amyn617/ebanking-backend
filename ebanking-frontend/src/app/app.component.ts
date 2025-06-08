import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'ebanking-frontend';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Le service de thème s'initialise automatiquement
    // et applique le thème sombre par défaut
  }
}
