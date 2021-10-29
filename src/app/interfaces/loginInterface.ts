export interface Root {
  data: Data;
}

export interface Data {
  user: User;
  tokens: Tokens;
}

export interface User {
  id: number;
  role_id: number;
  name: string;
  email: string;
  avatar: string;
  email_verified_at: any;
  settings: Settings;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  locale: string;
}

export interface Tokens {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}
