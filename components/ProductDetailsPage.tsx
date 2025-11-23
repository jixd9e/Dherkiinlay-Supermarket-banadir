import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Star } from 'lucide-react';
import { useStore } from '../StoreContext';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useStore();
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return <div className="text-center py-20 animate-fade-in-up">Product not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto animate-enter">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center text-gray-500 hover:text-gray-900 transition hover:-translate-x-1 duration-200"
      >
        <ArrowLeft size={20} className="mr-2" /> Back to Shop
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-scale-in">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="aspect-square bg-gray-100 p-8 overflow-hidden group">
            <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply transition duration-700 group-hover:scale-110" 
            />
          </div>
          
          <div className="p-8 flex flex-col justify-center animate-slide-in-right delay-200 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <span className="text-primary-600 font-medium text-sm mb-2">{product.category}</span>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-gray-400 text-sm">(120 reviews)</span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              {product.stock > 0 ? (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold animate-pulse">In Stock</span>
              ) : (
                 <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">Out of Stock</span>
              )}
            </div>

            <button 
              onClick={() => addToCart(product)}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-200 hover:shadow-xl hover:-translate-y-1 active:scale-95 duration-200"
            >
              <ShoppingBag size={20} />
              Add to Cart
            </button>
            
            <div className="mt-6 space-y-2 border-t pt-6 text-sm text-gray-500">
                <p className="flex items-center gap-2"><span className="text-xl">🚚</span> Free delivery on orders over $50</p>
                <p className="flex items-center gap-2"><span className="text-xl">🛡️</span> 100% Money back guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Placeholder */}
      <div className="mt-12 animate-fade-in-up delay-300 opacity-0" style={{ animationFillMode: 'forwards' }}>
        <h3 className="text-xl font-bold mb-4">You might also like</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.filter(p => p.category === product.category && p.id !== product.id).slice(0,4).map((p, idx) => (
                 <div 
                    key={p.id} 
                    onClick={() => navigate(`/product/${p.id}`)} 
                    className="cursor-pointer bg-white p-3 rounded-lg border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                 >
                    <div className="overflow-hidden rounded-md mb-2 bg-gray-50 h-32">
                        <img src={p.image} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition duration-500" alt={p.name}/>
                    </div>
                    <p className="font-medium text-sm truncate group-hover:text-primary-600 transition">{p.name}</p>
                    <p className="text-primary-600 font-bold text-sm">${p.price}</p>
                 </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;