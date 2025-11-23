import React from 'react';
import { useStore } from '../StoreContext';
import { Tag, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const DiscountsPage: React.FC = () => {
  const { t, products } = useStore();

  // Mock discounted products
  const discountedProducts = products.slice(0, 3).map(p => ({
    ...p,
    originalPrice: p.price * 1.2,
    discount: '20%'
  }));

  const offers = [
    { title: "Weekend Special", desc: "Get 10% off all fruits & vegetables this weekend!", code: "FRESH10", color: "bg-green-100 text-green-800" },
    { title: "Bulk Buy Bonus", desc: "Buy 1 get 1 50% off on all bakery items.", code: "BREAD50", color: "bg-orange-100 text-orange-800" },
    { title: "New User Offer", desc: "Flat $5 off on your first order above $20.", code: "WELCOME5", color: "bg-blue-100 text-blue-800" }
  ];

  return (
    <div className="space-y-10">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.discounts} & Offers</h1>
        <p className="text-gray-500">Save big with our latest deals and coupons.</p>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer, idx) => (
          <div key={idx} className={`rounded-xl p-6 border-2 border-dashed ${offer.color} relative overflow-hidden`}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Tag size={100} />
            </div>
            <div className="relative z-10">
              <h3 className="font-bold text-xl mb-2">{offer.title}</h3>
              <p className="text-sm opacity-90 mb-4">{offer.desc}</p>
              <div className="bg-white/50 inline-block px-3 py-1 rounded font-mono font-bold border border-current">
                Code: {offer.code}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Discounted Items */}
      <div>
         <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
           <Clock className="text-red-500" /> Limited Time Deals
         </h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {discountedProducts.map(product => (
             <div key={product.id} className="bg-white rounded-xl border shadow-sm p-4 relative">
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {product.discount} OFF
                </span>
                <img src={product.image} alt={product.name} className="w-full h-40 object-contain mb-4 mix-blend-multiply" />
                <h3 className="font-bold text-gray-900">{product.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                   <span className="font-bold text-xl text-red-600">${product.price.toFixed(2)}</span>
                   <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                </div>
                <Link to={`/product/${product.id}`} className="mt-4 block text-center bg-gray-900 text-white py-2 rounded-lg text-sm font-bold hover:bg-gray-800">
                  View Deal
                </Link>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
};

export default DiscountsPage;