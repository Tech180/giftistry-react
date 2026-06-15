export interface ApiUser {
  Id: string;
  Username: string;
  Email: string;
  FirstName: string;
  LastName: string;
  CreatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  User: ApiUser;
  Token: string;
}
