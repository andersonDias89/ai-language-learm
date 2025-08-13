export interface JwtPayload {
  email: string;
  sub: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface RegisterResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}
