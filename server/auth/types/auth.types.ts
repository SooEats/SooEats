export interface AuthActionResult {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

export interface AuthCredentials {
  email: string;
  password: string;
  username?: string;
}
