import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../StoreContext';
import { Search as SearchIcon, ShoppingCart, Star } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { t, products, addToCart, setSearchQuery } = useStore();

  // Sync URL query to global search input state
  useEffect(() => {
    setSearchQuery(query);
  }, [query, setSearchQuery]);

  const results = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.description.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-enter">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
           <SearchIcon className="text-primary-600 w-10 h-10" strokeWidth={3} />
           <h1 
             className="text-3xl font-bold text-gray-900 border-b-4 border-primary-600 inline-block pb-1 leading-none"
             style={{ borderColor: '#059669' }} // Force green border matches screenshot
           >
             {t.search} Results
           </h1>
        </div>
        <p className="text-gray-500 font-medium ml-1">
          {query ? (
             <>Showing {results.length} results for <span className="font-bold text-gray-900">"{query}"</span></>
          ) : (
             <>Showing all {results.length} products</>
          )}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed animate-scale-in">
          <p className="text-gray-500 text-lg">No products found matching your search.</p>
          <Link to="/shop" className="mt-4 inline-block text-primary-600 font-bold hover:underline">
            Browse all products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((product, index) => (
            <div 
                key={product.id} 
                className="bg-white rounded-xl border shadow-sm hover:shadow-md transition overflow-hidden flex flex-col animate-fade-in-up opacity-0"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
            >
              <Link to={`/product/${product.id}`} className="block h-48 bg-gray-50 p-4 relative group">
                 <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition duration-500" />
                 {product.rating && (
                   <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold shadow-sm">
                      <Star size={10} className="text-yellow-400" fill="currentColor" /> {product.rating}
                   </div>
                 )}
              </Link>
              <div className="p-4 flex-1 flex flex-col">
                 <div className="flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">{product.category}</p>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-bold text-gray-900 hover:text-primary-600 transition mb-2">{product.name}</h3>
                    </Link>
                    <p className="font-bold text-lg text-gray-900">${product.price.toFixed(2)}</p>
                 </div>
                 <button 
                   onClick={() => addToCart(product)}
                   className="mt-4 w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center justify-center gap-2 active:scale-95 transition"
                 >
                   <ShoppingCart size={16} /> {t.addToCart}
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;