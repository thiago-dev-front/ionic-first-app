export enum AuthProvider {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Email,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Facebook,
}

export interface User {
  name?: string;
  email: string;
  password: string;
}

export interface AuthOptions {
  isSignIn: boolean;
  provider: AuthProvider;
  user: User;
}
