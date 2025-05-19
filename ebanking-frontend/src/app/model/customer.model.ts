export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt?: Date;
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}
