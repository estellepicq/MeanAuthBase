export class ApiResponse {
  success?: boolean;
  msg?: string;
  user?: {
    id: string;
    name: string;
    firstname: string;
    username: string;
    email: string;
    password?: string;
    birthday?: string;
    gender?: string;
  };
  token?: string;
}
