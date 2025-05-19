# Digital Banking Platform Frontend

A modern, feature-rich Angular application for digital banking services. This frontend application connects to a Spring Boot backend API to provide a comprehensive banking platform.

![Digital Banking Platform](https://via.placeholder.com/800x400?text=Digital+Banking+Platform)

## Overview

The Digital Banking Platform is a web application that allows users to manage bank accounts, customers, and transactions. It features a responsive design with modern UI components built on Angular 19 and Bootstrap 5.

### Key Features

- **Authentication System**: Secure login with JWT authentication
- **Customer Management**:
  - List all customers with search functionality
  - Create new customers with reactive form validation
  - Edit existing customer information
  - Delete customers with confirmation
- **Account Management**:
  - View customer bank accounts with details
  - View transaction history
  - Perform banking operations:
    - Debit/withdraw funds
    - Credit/deposit funds
    - Transfer between accounts
- **Responsive UI**: Modern interface that works on desktop and mobile devices
- **Security**: Route guards and HTTP interceptors for protected resources

## Architecture

### Frontend Architecture

The application follows Angular's recommended architecture:

```
src/
├── app/                   # Main application code
│   ├── components/        # Shared components
│   ├── guards/            # Route guards for authentication
│   ├── interceptors/      # HTTP interceptors (auth token)
│   ├── model/             # Data models/interfaces
│   ├── services/          # API services and business logic
│   ├── feature modules/   # Feature-based components (customers, accounts)
│   └── app.module.ts      # Main application module
├── assets/                # Static assets
└── environments/          # Environment configuration
```

### Backend Communication

The frontend connects to a Spring Boot REST API running at `http://localhost:8085` with these main endpoints:

- `/auth/login` - Authentication
- `/customers` - Customer management (GET, POST, PUT, DELETE)
- `/accounts` - Account management
- `/accounts/{accountId}/operations` - Account operations (debit/credit/transfer)

### Technical Stack

- **Framework**: Angular 19
- **UI Library**: Bootstrap 5 with Bootstrap Icons
- **Form Handling**: Reactive Forms with validation
- **State Management**: Services with RxJS
- **HTTP Communication**: Angular HttpClient with interceptors
- **Authentication**: JWT (JSON Web Tokens)
- **CSS Preprocessing**: SCSS
- **Build Tool**: Angular CLI

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Angular CLI 19.x

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/digital-banking-front.git
   cd digital-banking-front
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   ng serve
   ```

4. Navigate to `http://localhost:4200/` in your browser

### Backend API Connection

The application is configured to connect to a Spring Boot backend at `http://localhost:8085`. If your backend runs on a different address, update the API URL in:

```typescript
// src/app/services/auth.service.ts
private readonly API_URL = 'http://localhost:8085';
```

### API Authentication Flow

1. The user enters credentials in the login form
2. Credentials are sent to `/auth/login` endpoint
3. Upon successful authentication, the backend returns a JWT token
4. The token is stored in local storage
5. All subsequent API requests include the token in an Authorization header
6. The `AuthInterceptor` automatically attaches the token to all HTTP requests

### Backend API Structure

The frontend expects the following API endpoints to be available:

#### Authentication

- `POST /auth/login` - Authenticate user and return JWT token

#### Customers

- `GET /customers?keyword=search` - Search customers by keyword
- `GET /customers/{id}` - Get customer details
- `POST /customers` - Create a new customer
- `PUT /customers/{id}` - Update customer information
- `DELETE /customers/{id}` - Delete a customer

#### Accounts

- `GET /accounts` - Get all accounts
- `GET /accounts/{id}` - Get account details
- `GET /customers/{customerId}/accounts` - Get accounts for a specific customer

#### Operations

- `POST /accounts/{accountId}/debit` - Debit an account
- `POST /accounts/{accountId}/credit` - Credit an account
- `POST /accounts/transfer` - Transfer between accounts
- `GET /accounts/{accountId}/operations` - Get account operations history

## Development

### Code Scaffolding

To generate a new component:

```bash
ng generate component component-name
```

For a complete list of available schematics:

```bash
ng generate --help
```

### Building for Production

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

### Running Unit Tests

```bash
ng test
```

### Code Linting

```bash
ng lint
```

## Deployment

To deploy the application to a production server:

1. Build the production version

   ```bash
   ng build --configuration production
   ```

2. Deploy the contents of the `dist/digital-banking-frontend/browser` directory to your web server

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- Spring Boot backend developers
- Angular team for the excellent framework
- Bootstrap team for the UI components
