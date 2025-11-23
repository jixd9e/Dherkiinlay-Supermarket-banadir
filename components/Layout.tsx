import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, LogOut, Bot, Heart, ChevronDown } from 'lucide-react';
import { useStore } from '../StoreContext';
import { getShoppingAdvice } from '../services/geminiService';
import { Logo } from './Logo';

const Layout: React.FC = () => {
  const { cart, user, logout, searchQuery, setSearchQuery, products, t, lang, setLang } = useStore();
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

  const handleSearchSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
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

  const openWhatsApp = () => {
    // Using the specific WhatsApp Business short link provided
    window.open('https://wa.me/message/4IOAGQLFIEKME1', '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* Top Info Bar */}
      <div className="bg-green-700 text-white text-xs py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <span className="hidden sm:inline animate-fade-in-up">Free Delivery for order above $50</span>
          <span className="sm:hidden">Free Delivery > $50</span>
          <div className="flex items-center gap-4">
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value as any)}
              className="bg-transparent border-none outline-none cursor-pointer hover:text-green-200 font-medium transition"
            >
              <option value="en" className="text-black">Eng</option>
              <option value="so" className="text-black">Som</option>
            </select>
            <span className="cursor-pointer hover:underline">USD</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-primary-600 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 md:gap-8">
            
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 hover:opacity-90 transition duration-300">
              <Logo variant="white" />
            </Link>

            {/* Search Bar - Centered & Wide */}
            <div className="flex-1 max-w-2xl relative hidden md:block group">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className="w-full pl-4 pr-12 py-3 rounded-lg bg-gray-100 text-gray-900 border-none focus:ring-2 focus:ring-yellow-400 outline-none transition-all shadow-inner group-hover:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
              />
              <button 
                onClick={handleSearchSubmit}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-600 p-1 transition"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-6">
              
              {/* Account */}
              {user ? (
                 <div className="flex items-center gap-2 cursor-pointer group relative">
                    <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center group-hover:bg-primary-800 transition transform group-hover:scale-110 duration-200">
                      <User size={20} />
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-xs text-green-100">{t.welcome}</p>
                      <p className="text-sm font-bold truncate max-w-[100px]">{user.name}</p>
                    </div>

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100 transform group-hover:translate-y-0 translate-y-2">
                      {user.role === 'admin' && (
                        <Link to="/admin" className="block px-4 py-2 hover:bg-gray-50">{t.adminDashboard}</Link>
                      )}
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 flex items-center gap-2">
                         <LogOut size={14}/> {t.logout}
                      </button>
                    </div>
                 </div>
              ) : (
                <Link to="/login" className="flex items-center gap-2 group">
                   <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center group-hover:bg-primary-800 transition transform group-hover:scale-110 duration-200">
                      <User size={20} />
                   </div>
                   <div className="hidden lg:block text-left">
                      <p className="text-xs text-green-100">{t.guest}</p>
                      <p className="text-sm font-bold">{t.myAccount}</p>
                   </div>
                </Link>
              )}

              {/* Wishlist (Mock) */}
              <div className="hidden sm:flex items-center gap-2 cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center group-hover:bg-primary-800 transition relative transform group-hover:scale-110 duration-200">
                    <Heart size={20} />
                    <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs text-green-100">{t.myWishlist}</p>
                    <p className="text-sm font-bold">View</p>
                  </div>
              </div>

              {/* Cart */}
              <Link to="/checkout" className="flex items-center gap-2 group">
                  <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center group-hover:bg-primary-800 transition relative transform group-hover:scale-110 duration-200">
                    <ShoppingCart size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs text-green-100">{t.myCart}</p>
                    <p className="text-sm font-bold">$ {cart.reduce((a,c) => a + c.price * c.quantity, 0).toFixed(2)}</p>
                  </div>
              </Link>
              
              {/* Mobile Menu Toggle */}
              <button className="md:hidden text-white active:scale-95 transition" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <Menu size={28} />
              </button>
            </div>
          </div>
          
           {/* Mobile Search */}
           <div className="mt-4 md:hidden">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-4 pr-10 py-2 rounded-lg bg-gray-100 text-gray-900 border-none outline-none focus:ring-2 focus:ring-yellow-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                />
                <button onClick={handleSearchSubmit}>
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                </button>
              </div>
           </div>
        </div>
      </header>
      
      {/* Navigation Strip */}
      <nav className="bg-white border-b shadow-sm hidden md:block z-40">
        <div className="container mx-auto px-4">
           <ul className="flex items-center gap-8 text-sm font-medium text-gray-700">
              <li><Link to="/" className="py-4 inline-block hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 transition duration-300">{t.home}</Link></li>
              <li><Link to="/shop" className="py-4 inline-block hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 transition duration-300">{t.shop}</Link></li>
              <li><Link to="/about" className="py-4 inline-block hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 transition duration-300">{t.about}</Link></li>
              <li><Link to="/privacy" className="py-4 inline-block hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 transition duration-300">{t.privacy}</Link></li>
              <li>
                <Link 
                  to="/search" 
                  onClick={() => setSearchQuery('')} 
                  className="py-4 inline-block hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 transition duration-300"
                >
                  {t.search}
                </Link>
              </li>
              <li><Link to="/discounts" className="py-4 inline-block hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 transition duration-300">{t.discounts}</Link></li>
           </ul>
        </div>
      </nav>
      
      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b p-4 animate-slide-in-bottom">
          <nav className="flex flex-col gap-2">
            <Link to="/" className="py-2 px-4 hover:bg-gray-50 rounded-md font-medium" onClick={() => setIsMenuOpen(false)}>{t.home}</Link>
            <Link to="/shop" className="py-2 px-4 hover:bg-gray-50 rounded-md font-medium" onClick={() => setIsMenuOpen(false)}>{t.shop}</Link>
            <Link to="/about" className="py-2 px-4 hover:bg-gray-50 rounded-md font-medium" onClick={() => setIsMenuOpen(false)}>{t.about}</Link>
            <Link to="/privacy" className="py-2 px-4 hover:bg-gray-50 rounded-md font-medium" onClick={() => setIsMenuOpen(false)}>{t.privacy}</Link>
            <Link to="/discounts" className="py-2 px-4 hover:bg-gray-50 rounded-md font-medium" onClick={() => setIsMenuOpen(false)}>{t.discounts}</Link>
            <Link to="/checkout" className="py-2 px-4 hover:bg-gray-50 rounded-md font-medium" onClick={() => setIsMenuOpen(false)}>{t.myCart}</Link>
            {!user && <Link to="/login" className="py-2 px-4 hover:bg-gray-50 rounded-md font-medium" onClick={() => setIsMenuOpen(false)}>Login</Link>}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="animate-fade-in-up">
              <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="text-green-500">Dherkiinlay</span> 
                  <span className="text-orange-500 text-sm uppercase tracking-wider">Supermarket</span>
              </h3>
              <p className="text-sm text-gray-400">Your one-stop shop for fresh groceries and daily essentials. Delivered to your doorstep.</p>
            </div>
            <div className="animate-fade-in-up delay-100">
              <h3 className="text-white text-lg font-bold mb-4">{t.quickLinks}</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white transition">{t.home}</Link></li>
                <li><Link to="/shop" className="hover:text-white transition">{t.shop}</Link></li>
                <li><Link to="/checkout" className="hover:text-white transition">Track Order</Link></li>
              </ul>
            </div>
            <div className="animate-fade-in-up delay-200">
              <h3 className="text-white text-lg font-bold mb-4">{t.contactUs}</h3>
              <p className="text-sm text-gray-400">Mogadishu, Somalia</p>
              <p className="text-sm text-gray-400">+252 61 5000000</p>
              <p className="text-sm text-gray-400">support@dherkiinlay.com</p>
            </div>
            
            {/* Map Section */}
            <div className="animate-fade-in-up delay-300">
               <h3 className="text-white text-lg font-bold mb-4">{t.ourLocation}</h3>
               <div className="h-40 w-full rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
                  <iframe 
                      width="100%" 
                      height="100%" 
                      title="Store Location"
                      src="https://maps.google.com/maps?q=Dharkenley+District+Mogadishu&t=&z=13&ie=UTF8&iwloc=&output=embed" 
                      frameBorder="0" 
                      scrolling="no" 
                      marginHeight={0} 
                      marginWidth={0}
                      className="filter grayscale hover:grayscale-0 transition duration-500"
                  ></iframe>
               </div>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500 border-t border-gray-800 pt-6">
            &copy; {new Date().getFullYear()} Dherkiinlay Supermarket. {t.rightsReserved}
          </div>
        </div>
      </footer>

      {/* Floating Buttons Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
         
         {/* WhatsApp Floating Button */}
         <button 
           onClick={openWhatsApp}
           className="bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center animate-bounce duration-[2000ms]"
           title="Chat on WhatsApp"
         >
           <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
           </svg>
         </button>

         {/* AI Chat Assistant Button */}
         {!isChatOpen && (
           <button 
             onClick={() => setIsChatOpen(true)}
             className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center animate-bounce duration-1000"
             title="AI Assistant"
           >
             <Bot size={28} />
           </button>
         )}
         
         {isChatOpen && (
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-80 sm:w-96 flex flex-col overflow-hidden animate-scale-in origin-bottom-right" style={{ height: '500px' }}>
              <div className="bg-primary-600 p-4 flex justify-between items-center text-white">
                 <div className="flex items-center gap-2">
                   <Bot size={20} />
                   <span className="font-semibold">Smart Assistant</span>
                 </div>
                 <button onClick={() => setIsChatOpen(false)} className="hover:text-gray-200 transition transform hover:rotate-90">
                   X
                 </button>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
                {chatHistory.length === 0 && (
                  <div className="text-center text-gray-500 mt-10 animate-fade-in-up">
                    <p className="text-sm">Hi! I can help you find products or suggest recipes.</p>
                  </div>
                )}
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in-bottom`}>
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
                  className="flex-1 bg-gray-100 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary-500 transition"
                  placeholder="Ask me anything..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                />
                <button type="submit" className="bg-primary-600 text-white p-2 rounded-md hover:bg-primary-700 transition active:scale-95">
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