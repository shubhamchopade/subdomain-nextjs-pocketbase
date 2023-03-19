export interface Auth {
  email: string;
  login_at: string;
  token: {
    access: string;
    refresh: string;
  };
  user_id: number;
  user_name: string;
  isAdmin?: unknown;
}
