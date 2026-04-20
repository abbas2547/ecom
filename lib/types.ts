export interface User {
  _id?: string;
  name?: string;
  email: string;
  image?: string;
  role: 'admin' | 'user';
  createdAt: Date;
  lastLogin?: Date;
}

export interface Todo {
  id: string;
  name: string;
  completed?: boolean;
  created_at?: string;
  user_id?: string;
}

export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id?: string;
  userId: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentUsers: User[];
  recentOrders: Order[];
}
