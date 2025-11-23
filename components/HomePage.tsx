import React from 'react';
import { useStore } from '../StoreContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';

const HomePage: React.FC = () => {
  const { t, products, categories } = useStore();

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-primary-600 rounded-3xl overflow-hidden text-white shadow-xl relative animate-enter">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200" 
          alt="Supermarket Aisle" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 transform hover:scale-105 transition duration-[20s]"
        />
        <div className="relative z-20 p-12 md:p-20 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight animate-fade-in-up delay-100 opacity-0" style={{ animationFillMode: 'forwards' }}>
            {t.welcome}
          </h1>
          <p className="text-green-50 text-lg mb-8 animate-fade-in-up delay-200 opacity-0" style={{ animationFillMode: 'forwards' }}>
             Your one-stop destination for fresh groceries, daily essentials, and household items. Delivered straight to your doorstep in Mogadishu.
          </p>
          <Link 
            to="/shop" 
            className="bg-white text-primary-700 px-8 py-3 rounded-full font-bold inline-flex items-center gap-2 hover:bg-yellow-300 hover:text-primary-800 transition shadow-lg animate-fade-in-up delay-300 opacity-0"
            style={{ animationFillMode: 'forwards' }}
          >
            {t.shop} Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="animate-enter delay-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.categories}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, index) => (
            <Link 
              key={cat.id} 
              to="/shop" 
              className="group block animate-fade-in-up opacity-0"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className="bg-white rounded-xl shadow-sm border p-4 text-center hover:shadow-md transition group-hover:border-primary-400 transform group-hover:-translate-y-1 duration-300">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 mb-3 overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="animate-enter delay-400">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/shop" className="text-primary-600 hover:underline font-medium hover:text-primary-800 transition">View All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
             <Link 
                key={product.id} 
                to={`/product/${product.id}`} 
                className="bg-white rounded-xl border hover:shadow-lg transition group animate-scale-in opacity-0"
                style={{ animationDelay: `${index * 100 + 300}ms`, animationFillMode: 'forwards' }}
             >
                <div className="aspect-square bg-gray-50 rounded-t-xl overflow-hidden p-4 relative">
                   <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition duration-500 mix-blend-multiply" />
                   <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold shadow-sm opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0">
                      <Star size={10} className="text-yellow-400" fill="currentColor" /> {product.rating || 4.5}
                   </div>
                </div>
                <div className="p-4">
                   <p className="text-xs text-gray-500 uppercase font-bold mb-1 tracking-wider">{product.category}</p>
                   <h3 className="font-bold text-gray-900 mb-2 truncate group-hover:text-primary-600 transition">{product.name}</h3>
                   <div className="flex items-center justify-between">
                      <span className="font-bold text-lg text-primary-700">${product.price.toFixed(2)}</span>
                      <span className="text-xs text-blue-600 font-medium group-hover:underline">View Details</span>
                   </div>
                </div>
             </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;