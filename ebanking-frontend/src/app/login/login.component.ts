import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formLogin!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;
  returnUrl: string = '/customers';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      username: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required]),
    });

    // Get return url from route parameters or default to '/customers'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/customers';

    // Check if already authenticated and redirect if needed
    if (this.authService.isAuthenticated) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  handleLogin() {
    if (this.formLogin.invalid) {
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    const username = this.formLogin.value.username;
    const pwd = this.formLogin.value.password;

    this.authService.login(username, pwd).subscribe({
      next: (data) => {
        this.authService.loadProfile(data);
        this.isLoading = false;
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 0) {
          this.errorMessage =
            'Server is not responding. Please check your backend service.';
        } else if (err.status === 401) {
          this.errorMessage = 'Invalid username or password';
        } else {
          this.errorMessage = 'An error occurred. Please try again.';
        }
        console.error(err);
      },
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  loginWithDemoCredentials() {
    // For demonstration purposes only
    this.formLogin.patchValue({
      username: 'demo',
      password: 'demo123',
    });
    this.handleLogin();
  }
}
