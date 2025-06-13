export interface Geo {
  lat: string;
  lng: string;
}

export interface Address {
  id?: number;
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
  created_at?: Date;
  updated_at?: Date;
}

export interface Company {
  id?: number;
  name: string;
  catchPhrase: string;
  bs: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface User {
  id?: number;
  name: string;
  username: string;
  email: string;
  address?: Address;
  address_id?: number;
  phone: string;
  website: string;
  company?: Company;
  company_id?: number;
  role?: 'user' | 'admin';
  created_at?: Date;
  updated_at?: Date;
}

export interface Auth {
  id?: number;
  user_id: number;
  password_hash: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserWithAuth extends User {
  password?: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
} 