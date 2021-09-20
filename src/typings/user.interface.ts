export interface BaseUser {
  first_name: string;
  last_name: string;
  email: string;
}

export interface User extends BaseUser {
  id: string;
}
