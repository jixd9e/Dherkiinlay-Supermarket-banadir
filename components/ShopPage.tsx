import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check } from 'lucide-react';
import { useStore } from '../StoreContext';
import { Product } from '../types';

const ShopPage: React.FC = () => {
  const { products, categories, addToCart, searchQuery, cart } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const isInCart = (id: string) => cart.some(item => item.id === id);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-primary-900 text-white h-64 md:h-80 flex items-center px-6 md:px-16 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
        <img 
          src="https://picsum.photos/seed/supermarket/1200/400" 
          alt="Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-20 max-w-xl space-y-4">
          <span className="inline-block bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">New Arrival</span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">Fresh Groceries Delivered Fast</h1>
          <p className="text-lg text-gray-200">Shop your daily essentials at the best prices. Free delivery on orders over $50.</p>
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Shop Now
          </button>
        </div>
      </div>

      {/* Categories */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Shop by Category</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <button
             onClick={() => setActiveCategory('All')}
             className={`flex-shrink-0 px-6 py-2 rounded-full border transition ${
               activeCategory === 'All' 
                 ? 'bg-primary-600 text-white border-primary-600' 
                 : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400'
             }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex-shrink-0 px-6 py-2 rounded-full border transition ${
                activeCategory === cat.name 
                  ? 'bg-primary-600 text-white border-primary-600' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {activeCategory === 'All' ? 'Featured Products' : activeCategory}
          </h2>
          <span className="text-sm text-gray-500">{filteredProducts.length} items found</span>
        </div>

        {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No products found matching your criteria.</p>
            </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAdd={() => addToCart(product)}
                isAdded={isInCart(product.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product; onAdd: () => void; isAdded: boolean }> = ({ product, onAdd, isAdded }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col group">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
         <Link to={`/product/${product.id}`}>
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
         </Link>
         {product.stock < 5 && (
           <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
             Low Stock
           </span>
         )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">{product.category}</p>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-gray-900 mb-1 hover:text-primary-600 transition line-clamp-1">{product.name}</h3>
          </Link>
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
            <span className="text-xs text-gray-400 line-through">${(product.price * 1.2).toFixed(2)}</span>
          </div>
        </div>
        
        <button 
          onClick={onAdd}
          disabled={isAdded}
          className={`mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
            isAdded 
              ? 'bg-primary-50 text-primary-700 border border-primary-200' 
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {isAdded ? (
            <>
              <Check size={16} /> Added
            </>
          ) : (
            <>
              <Plus size={16} /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ShopPage;