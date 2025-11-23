export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating?: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'EVC' | 'Sahal' | 'COD';
  createdAt: string;
  deliveryDetails: {
    address: string;
    city: string;
    phone: string;
  };
}

export interface StoreContextType {
  user: User | null;
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  orders: Order[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  placeOrder: (details: any, method: 'EVC' | 'Sahal' | 'COD') => Order;
  login: (user: User) => void;
  logout: () => void;
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  addCategory: (c: Category) => void;
  updateCategory: (c: Category) => void;
  deleteCategory: (id: string) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  setCategories: (c: Category[]) => void;
  
  // Language Support
  lang: 'en' | 'so';
  setLang: (lang: 'en' | 'so') => void;
  t: any; // Translation object
}