export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  location?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  captcha?: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  captcha?: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}
