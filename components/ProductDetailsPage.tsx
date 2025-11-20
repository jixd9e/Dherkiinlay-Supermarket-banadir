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
    return <div className="text-center py-20">Product not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center text-gray-500 hover:text-gray-900 transition"
      >
        <ArrowLeft size={20} className="mr-2" /> Back to Shop
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="aspect-square bg-gray-100">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          
          <div className="p-8 flex flex-col justify-center">
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
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">In Stock</span>
              ) : (
                 <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">Out of Stock</span>
              )}
            </div>

            <button 
              onClick={() => addToCart(product)}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-primary-200"
            >
              <ShoppingBag size={20} />
              Add to Cart
            </button>
            
            <div className="mt-6 space-y-2 border-t pt-6 text-sm text-gray-500">
                <p>🚚 Free delivery on orders over $50</p>
                <p>🛡️ 100% Money back guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Placeholder */}
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4">You might also like</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.filter(p => p.category === product.category && p.id !== product.id).slice(0,4).map(p => (
                 <div key={p.id} onClick={() => navigate(`/product/${p.id}`)} className="cursor-pointer bg-white p-3 rounded-lg border hover:shadow-md transition">
                    <img src={p.image} className="w-full h-32 object-cover rounded-md mb-2" alt={p.name}/>
                    <p className="font-medium text-sm">{p.name}</p>
                    <p className="text-primary-600 font-bold text-sm">${p.price}</p>
                 </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;