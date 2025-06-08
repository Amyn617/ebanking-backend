export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  roles: string[];
}

export interface AuthResponse {
  'access-token': string;
}

export interface UserProfile {
  sub: string;
  exp: number;
  iat: number;
  userId: number;
  scope: string;
}
