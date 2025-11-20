import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Product, Category, CartItem, Order, User, StoreContextType } from './types';
import { initialProducts, initialCategories, initialOrders } from './services/mockData';
import Layout from './components/Layout';
import ShopPage from './components/ShopPage';
import AdminDashboard from './components/AdminDashboard';
import AuthPage from './components/AuthPage';
import ProductDetailsPage from './components/ProductDetailsPage';
import CheckoutPage from './components/CheckoutPage';
import { StoreContext } from './StoreContext';

// Helper for Route Protection
interface ProtectedRouteProps {
  children?: React.ReactNode;
  role: 'admin' | 'user';
  user: User | null;
}

const ProtectedRoute = ({ children, role, user }: ProtectedRouteProps) => {
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  // --- State ---
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Actions ---

  // Force initialization of orders if empty (Fixes hot-reload/persistence issue)
  useEffect(() => {
    if (orders.length === 0 && initialOrders.length > 0) {
      setOrders(initialOrders);
    }
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const placeOrder = (deliveryDetails: any, paymentMethod: 'EVC' | 'Sahal' | 'COD') => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      userId: user?.id || 'guest',
      customerName: user?.name || 'Guest Customer',
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'pending',
      paymentMethod,
      createdAt: new Date().toISOString(),
      deliveryDetails
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);

  // Admin Actions
  const addProduct = (product: Product) => setProducts([...products, product]);
  const updateProduct = (product: Product) => setProducts(products.map(p => p.id === product.id ? product : p));
  const deleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));
  
  const addCategory = (category: Category) => setCategories([...categories, category]);
  const updateCategory = (category: Category) => setCategories(categories.map(c => c.id === category.id ? category : c));
  const deleteCategory = (id: string) => setCategories(categories.filter(c => c.id !== id));

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const contextValue: StoreContextType = {
    user,
    products,
    categories,
    cart,
    orders,
    searchQuery,
    setSearchQuery,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    placeOrder,
    login,
    logout,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    updateOrderStatus,
    setCategories
  };

  return (
    <StoreContext.Provider value={contextValue}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute role="admin" user={user}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Customer Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </StoreContext.Provider>
  );
};

export default App;