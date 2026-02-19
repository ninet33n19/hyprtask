export type User = {
  id: string;
  email: string;
  password_hash: string;
  avatar_url: string | null;
  created_at: Date;
};
