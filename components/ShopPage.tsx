import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, LayoutGrid, List, ChevronRight, Star, ChevronDown, Filter } from 'lucide-react';
import { useStore } from '../StoreContext';
import { Product } from '../types';

const ShopPage: React.FC = () => {
  const { products, categories, addToCart, searchQuery, cart, t } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  const isInCart = (id: string) => cart.some(item => item.id === id);

  return (
    <div className="space-y-6 animate-enter">
      
      {/* Header: Categories Title */}
      <h2 className="text-2xl font-bold text-gray-900">{t.categories}</h2>

      {/* Category Pills Row */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        <button
            onClick={() => setActiveCategory('All')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full border transition whitespace-nowrap active:scale-95 duration-200 ${
              activeCategory === 'All' 
                ? 'bg-primary-600 text-white border-primary-600 shadow-md' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary-400 hover:shadow-sm'
            }`}
        >
          <LayoutGrid size={18} /> {t.allProducts}
        </button>
        {categories.map((cat, idx) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full border transition whitespace-nowrap active:scale-95 duration-200 animate-fade-in-up opacity-0 ${
              activeCategory === cat.name 
                ? 'bg-primary-600 text-white border-primary-600 shadow-md' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary-400 hover:shadow-sm'
            }`}
            style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'forwards' }}
          >
            <img src={cat.image} alt="" className="w-5 h-5 rounded-full object-cover" />
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 pt-4">
        
        {/* Left Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-6 flex-shrink-0 animate-fade-in-up delay-200">
          
          {/* Categories Filter */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
             <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-900">{t.categories}</h3>
                <ChevronDown size={16} className="text-gray-500" />
             </div>
             <div className="p-2">
                <button 
                  onClick={() => setActiveCategory('All')} 
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex justify-between items-center transition ${activeCategory === 'All' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {t.allProducts} <ChevronRight size={14} className="text-gray-400" />
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name)} 
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex justify-between items-center transition ${activeCategory === cat.name ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {cat.name} <ChevronRight size={14} className="text-gray-400" />
                  </button>
                ))}
             </div>
          </div>

          {/* Price Filter (Mock) */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
             <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-900">{t.price}</h3>
                <ChevronDown size={16} className="text-gray-500" />
             </div>
             <div className="p-4 space-y-2 text-sm text-gray-600">
                <label className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition">
                  <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" /> Under $5
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition">
                  <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" /> $5 - $20
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-primary-600 transition">
                  <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" /> $20 - $50
                </label>
             </div>
          </div>

           {/* Rating Filter (Mock) */}
           <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
             <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-900">{t.rating}</h3>
                <ChevronDown size={16} className="text-gray-500" />
             </div>
             <div className="p-4 space-y-2 text-sm text-gray-600">
                {[5, 4, 3].map(star => (
                  <label key={star} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition">
                     <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" />
                     <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                           <Star key={i} size={14} fill={i < star ? "currentColor" : "none"} className={i >= star ? "text-gray-300" : ""} />
                        ))}
                     </div>
                     <span className="text-xs">& Up</span>
                  </label>
                ))}
             </div>
          </div>

        </aside>

        {/* Main Product Grid */}
        <div className="flex-1">
           
           {/* Toolbar */}
           <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-lg font-bold text-gray-800 animate-fade-in-up">
                 {t.allProducts} <span className="text-gray-500 text-base font-normal">- {filteredProducts.length} {t.items}</span>
              </h2>
              
              <div className="flex items-center gap-3 animate-fade-in-up delay-100">
                 <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{t.sortBy}:</span>
                    <select 
                       className="bg-white border border-gray-300 rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-primary-500 transition hover:border-primary-400"
                       value={sortBy}
                       onChange={(e) => setSortBy(e.target.value)}
                    >
                       <option value="name">Name (A-Z)</option>
                       <option value="price-low">Price (Low to High)</option>
                       <option value="price-high">Price (High to Low)</option>
                    </select>
                 </div>
                 
                 <div className="flex bg-white border border-gray-300 rounded-md overflow-hidden">
                    <button 
                       onClick={() => setViewMode('grid')}
                       className={`p-2 transition ${viewMode === 'grid' ? 'bg-gray-100 text-primary-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                       <LayoutGrid size={18} />
                    </button>
                    <div className="w-[1px] bg-gray-300"></div>
                    <button 
                       onClick={() => setViewMode('list')}
                       className={`p-2 transition ${viewMode === 'list' ? 'bg-gray-100 text-primary-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                       <List size={18} />
                    </button>
                 </div>
              </div>
           </div>

           {/* Products */}
           {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 animate-scale-in">
                 <Filter className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                 <p className="text-gray-500 font-medium">No products found.</p>
                 <p className="text-sm text-gray-400">Try changing your filters or search query.</p>
              </div>
           ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                 {filteredProducts.map((product, index) => (
                    viewMode === 'grid' ? (
                       <ProductCard 
                          key={product.id} 
                          product={product} 
                          onAdd={() => addToCart(product)}
                          isAdded={isInCart(product.id)}
                          t={t}
                          index={index}
                       />
                    ) : (
                       <ProductListItem 
                          key={product.id} 
                          product={product} 
                          onAdd={() => addToCart(product)}
                          isAdded={isInCart(product.id)}
                          t={t}
                          index={index}
                       />
                    )
                 ))}
              </div>
           )}
        </div>

      </div>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product; onAdd: () => void; isAdded: boolean; t: any; index: number }> = ({ product, onAdd, isAdded, t, index }) => {
  return (
    <div 
        className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group h-full animate-scale-in opacity-0"
        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100 p-4">
         <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain group-hover:scale-110 transition duration-500 mix-blend-multiply"
          />
         </Link>
         {product.stock < 5 && (
           <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm animate-pulse">
             {t.lowStock}
           </span>
         )}
         {product.rating && (
           <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <Star size={10} className="text-yellow-400" fill="currentColor" /> {product.rating}
           </div>
         )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col border-t border-gray-50 bg-white z-10">
        <div className="flex-1">
          <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">{product.category}</p>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-gray-800 mb-1 hover:text-primary-600 transition leading-snug line-clamp-2">{product.name}</h3>
          </Link>
          <div className="flex items-end gap-2 mt-2">
            <span className="font-bold text-lg text-gray-900">${product.price.toFixed(2)}</span>
            <span className="text-xs text-gray-400 line-through mb-1">${(product.price * 1.2).toFixed(2)}</span>
          </div>
        </div>
        
        <button 
          onClick={(e) => {
             // Animate button click
             const btn = e.currentTarget;
             btn.classList.add('scale-95');
             setTimeout(() => btn.classList.remove('scale-95'), 100);
             onAdd();
          }}
          disabled={isAdded}
          className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 active:scale-95 ${
            isAdded 
              ? 'bg-green-50 text-green-700 border border-green-200 cursor-default' 
              : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-lg hover:-translate-y-0.5'
          }`}
        >
          {isAdded ? (
            <span className="flex items-center gap-2 animate-scale-in">
              <Check size={16} /> {t.added}
            </span>
          ) : (
            <>
              <Plus size={16} /> {t.addToCart}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

const ProductListItem: React.FC<{ product: Product; onAdd: () => void; isAdded: boolean; t: any; index: number }> = ({ product, onAdd, isAdded, t, index }) => {
   return (
      <div 
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-all duration-300 animate-slide-in-right opacity-0"
        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
      >
         <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 group">
             <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply p-2 group-hover:scale-110 transition duration-500" />
         </div>
         <div className="flex-1">
             <div className="flex justify-between items-start">
                <div>
                   <span className="text-xs text-gray-500 uppercase font-bold">{product.category}</span>
                   <h3 className="font-bold text-gray-900 text-lg hover:text-primary-600 cursor-pointer transition">{product.name}</h3>
                   <p className="text-sm text-gray-500 line-clamp-1 mt-1">{product.description}</p>
                </div>
                <div className="text-right">
                   <div className="font-bold text-xl text-gray-900">${product.price.toFixed(2)}</div>
                   <div className="text-xs text-gray-400 line-through">${(product.price * 1.2).toFixed(2)}</div>
                </div>
             </div>
             <div className="mt-4 flex justify-end">
                <button 
                  onClick={onAdd}
                  disabled={isAdded}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 active:scale-95 ${
                    isAdded 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-gray-900 text-white hover:bg-gray-800 shadow hover:shadow-lg'
                  }`}
                >
                  {isAdded ? <><Check size={16}/> {t.added}</> : <><Plus size={16}/> {t.addToCart}</>}
                </button>
             </div>
         </div>
      </div>
   )
}

export default ShopPage;