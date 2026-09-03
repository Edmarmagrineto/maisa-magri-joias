export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  stock: number;
  is_active: boolean;
  created_at: string;
};

export type Review = {
  id: string;
  product_id: string | null;
  user_id: string;
  author_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  status: string;
  payment_method: string;
  shipping_cep: string | null;
  shipping_cost: number;
  total: number;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
};

// Minimal shape used only to type the Supabase client generics.
export type Database = {
  public: {
    Tables: {
      products: { Row: Product; Insert: Partial<Product>; Update: Partial<Product> };
      reviews: { Row: Review; Insert: Partial<Review>; Update: Partial<Review> };
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      orders: { Row: Order; Insert: Partial<Order>; Update: Partial<Order> };
      order_items: { Row: OrderItem; Insert: Partial<OrderItem>; Update: Partial<OrderItem> };
    };
  };
};
