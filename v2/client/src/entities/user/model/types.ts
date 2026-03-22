export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'tenant' | 'landlord';
  fullName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
}

export interface UserState {
  data: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
