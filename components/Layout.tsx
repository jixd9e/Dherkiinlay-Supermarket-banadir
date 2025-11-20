import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, LogOut, Bot } from 'lucide-react';
import { useStore } from '../StoreContext';
import { getShoppingAdvice } from '../services/geminiService';
import { Logo } from './Logo';

const Layout: React.FC = () => {
  const { cart, user, logout, searchQuery, setSearchQuery, products } = useStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // AI Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const response = await getShoppingAdvice(userMsg, products);
    
    setChatHistory(prev => [...prev, { role: 'ai', text: response }]);
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center hover:opacity-90 transition">
              <Logo />
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-md relative hidden md:block">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 sm:gap-6">
              <Link to="/checkout" className="relative text-gray-600 hover:text-primary-600 transition">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium hidden sm:block">Hi, {user.name}</span>
                  <button onClick={handleLogout} className="text-gray-500 hover:text-red-500" title="Logout">
                    <LogOut size={22} />
                  </button>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="bg-gray-900 text-white px-3 py-1 rounded-md text-sm">Admin</Link>
                  )}
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-primary-600">
                  <User size={22} />
                  <span className="hidden sm:block text-sm font-medium">Login</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Search & Menu */}
          {isMenuOpen && (
            <div className="mt-4 md:hidden pb-4 border-t pt-4">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 border border-gray-200 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
              <nav className="flex flex-col gap-2">
                <Link to="/" className="py-2 px-4 hover:bg-gray-50 rounded-md" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link to="/checkout" className="py-2 px-4 hover:bg-gray-50 rounded-md" onClick={() => setIsMenuOpen(false)}>My Cart</Link>
                {!user && <Link to="/login" className="py-2 px-4 hover:bg-gray-50 rounded-md" onClick={() => setIsMenuOpen(false)}>Login</Link>}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-green-500">Dherkiinlay</span> 
                <span className="text-orange-500 text-sm uppercase tracking-wider">Supermarket</span>
            </h3>
            <p className="text-sm text-gray-400">Your one-stop shop for fresh groceries and daily essentials. Delivered to your doorstep.</p>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/" className="hover:text-white">Products</Link></li>
              <li><Link to="/checkout" className="hover:text-white">Track Order</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
            <p className="text-sm text-gray-400">Mogadishu, Somalia</p>
            <p className="text-sm text-gray-400">+252 61 5000000</p>
            <p className="text-sm text-gray-400">support@dherkiinlay.com</p>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-500 border-t border-gray-800 pt-6">
          &copy; {new Date().getFullYear()} Dherkiinlay Supermarket. All rights reserved.
        </div>
      </footer>

      {/* AI Chat Assistant Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
         {!isChatOpen && (
           <button 
             onClick={() => setIsChatOpen(true)}
             className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
           >
             <Bot size={28} />
           </button>
         )}
         
         {isChatOpen && (
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-80 sm:w-96 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300" style={{ height: '500px' }}>
              <div className="bg-primary-600 p-4 flex justify-between items-center text-white">
                 <div className="flex items-center gap-2">
                   <Bot size={20} />
                   <span className="font-semibold">Smart Assistant</span>
                 </div>
                 <button onClick={() => setIsChatOpen(false)} className="hover:text-gray-200">
                   X
                 </button>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
                {chatHistory.length === 0 && (
                  <div className="text-center text-gray-500 mt-10">
                    <p className="text-sm">Hi! I can help you find products or suggest recipes.</p>
                  </div>
                )}
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      msg.role === 'user' ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 p-3 rounded-lg rounded-bl-none animate-pulse">...</div>
                  </div>
                )}
              </div>

              <form onSubmit={handleChatSubmit} className="p-3 border-t bg-white flex gap-2">
                <input 
                  className="flex-1 bg-gray-100 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Ask me anything..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                />
                <button type="submit" className="bg-primary-600 text-white p-2 rounded-md hover:bg-primary-700">
                  Send
                </button>
              </form>
            </div>
         )}
      </div>
    </div>
  );
};

export default Layout;
