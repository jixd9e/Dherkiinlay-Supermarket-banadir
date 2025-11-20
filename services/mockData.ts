import { Product, Category, Order } from '../types';

export const initialCategories: Category[] = [
  { id: 'cat_1', name: 'Fruits & Veg', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=300&h=300' },
  { id: 'cat_2', name: 'Dairy & Eggs', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=300&h=300' },
  { id: 'cat_3', name: 'Beverages', image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&q=80&w=300&h=300' },
  { id: 'cat_4', name: 'Snacks', image: 'https://images.unsplash.com/photo-1621939514649-28b12e81658b?auto=format&fit=crop&q=80&w=300&h=300' },
  { id: 'cat_5', name: 'Household', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=300&h=300' },
];

export const initialProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'Fresh Bananas',
    description: 'Sweet organic bananas from local farms.',
    price: 1.50,
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=400&h=400',
    category: 'Fruits & Veg',
    stock: 50,
    rating: 4.5
  },
  {
    id: 'prod_2',
    name: 'Whole Milk',
    description: 'Farm fresh whole milk, 1 gallon.',
    price: 3.20,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=400&h=400',
    category: 'Dairy & Eggs',
    stock: 20,
    rating: 4.8
  },
  {
    id: 'prod_3',
    name: 'Orange Juice',
    description: '100% pure squeezed orange juice with pulp.',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=400&h=400',
    category: 'Beverages',
    stock: 15,
    rating: 4.2
  },
  {
    id: 'prod_4',
    name: 'Potato Chips',
    description: 'Classic salted potato chips, family size.',
    price: 2.50,
    image: 'https://images.unsplash.com/photo-1566478988047-b8f0660d6380?auto=format&fit=crop&q=80&w=400&h=400',
    category: 'Snacks',
    stock: 100,
    rating: 4.0
  },
  {
    id: 'prod_5',
    name: 'Red Apples',
    description: 'Crisp and sweet red apples, 1kg bag.',
    price: 3.00,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=400&h=400',
    category: 'Fruits & Veg',
    stock: 40,
    rating: 4.6
  },
  {
    id: 'prod_6',
    name: 'Laundry Detergent',
    description: 'Powerful stain remover detergent, 2L.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1585833552500-50199a1561b9?auto=format&fit=crop&q=80&w=400&h=400',
    category: 'Household',
    stock: 10,
    rating: 4.9
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-1709301',
    userId: 'user_1',
    customerName: 'Mohamed Ali',
    items: [
      { ...initialProducts[0], quantity: 2 },
      { ...initialProducts[1], quantity: 1 }
    ],
    total: 6.20,
    status: 'delivered',
    paymentMethod: 'EVC',
    createdAt: '2024-03-10T10:00:00Z',
    deliveryDetails: {
      address: '123 Wadnaha St',
      city: 'Mogadishu',
      phone: '+252 61 555 0101'
    }
  },
  {
    id: 'ORD-1709302',
    userId: 'user_2',
    customerName: 'Amina Yusuf',
    items: [
      { ...initialProducts[2], quantity: 1 }
    ],
    total: 4.99,
    status: 'pending',
    paymentMethod: 'Sahal',
    createdAt: '2024-03-11T14:30:00Z',
    deliveryDetails: {
      address: '456 Maka Al Mukarama',
      city: 'Mogadishu',
      phone: '+252 61 555 0102'
    }
  },
  {
    id: 'ORD-1709303',
    userId: 'user_3',
    customerName: 'Hassan Nur',
    items: [
      { ...initialProducts[3], quantity: 3 },
      { ...initialProducts[5], quantity: 1 }
    ],
    total: 20.49,
    status: 'processing',
    paymentMethod: 'COD',
    createdAt: '2024-03-12T09:15:00Z',
    deliveryDetails: {
      address: '789 Taleex',
      city: 'Mogadishu',
      phone: '+252 61 555 0103'
    }
  }
];