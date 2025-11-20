import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useStore } from '../StoreContext';
import { useNavigate } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, placeOrder, user } = useStore();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'cart' | 'details' | 'success'>('cart');
  const [formData, setFormData] = useState({
    address: '',
    city: 'Mogadishu',
    phone: '',
    paymentMethod: 'EVC' as 'EVC' | 'Sahal' | 'COD'
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 50 ? 0 : 5;
  const total = subtotal + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        navigate('/login');
        return;
    }
    placeOrder({ address: formData.address, city: formData.city, phone: formData.phone }, formData.paymentMethod);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckIcon />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h2>
        <p className="text-gray-500 mb-8">Thank you for shopping with Dherkiinlay. Your order is being processed.</p>
        <button onClick={() => navigate('/')} className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800">
          Continue Shopping
        </button>
      </div>
    );
  }

  if (cart.length === 0 && step === 'cart') {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <button onClick={() => navigate('/')} className="bg-primary-600 text-white px-6 py-3 rounded-lg">Start Shopping</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Cart or Form */}
      <div className="lg:col-span-2 space-y-6">
        {step === 'cart' ? (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Shopping Cart ({cart.length})</h2>
            </div>
            <div className="divide-y">
              {cart.map((item) => (
                <div key={item.id} className="p-6 flex gap-4 items-center">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md bg-gray-50" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-primary-600 font-bold">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded-full hover:bg-gray-100"><Minus size={16} /></button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded-full hover:bg-gray-100"><Plus size={16} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-md"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form id="checkout-form" onSubmit={handleCheckout} className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
            <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" defaultValue={user?.name} disabled className="w-full p-3 bg-gray-50 border rounded-lg" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input 
                  required 
                  type="tel" 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                  placeholder="+252 61..."
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="col-span-full space-y-2">
                <label className="text-sm font-medium text-gray-700">Delivery Address</label>
                <textarea 
                  required 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                  rows={3} 
                  placeholder="District, Street, House details..."
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
            
            <h2 className="text-xl font-bold pt-4">Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['EVC', 'Sahal', 'COD'].map((method) => (
                <div 
                  key={method}
                  onClick={() => setFormData({...formData, paymentMethod: method as any})}
                  className={`cursor-pointer border rounded-lg p-4 text-center font-medium transition ${formData.paymentMethod === method ? 'border-primary-600 bg-primary-50 text-primary-700' : 'hover:border-gray-300'}`}
                >
                  {method === 'COD' ? 'Cash on Delivery' : `${method} Plus`}
                </div>
              ))}
            </div>
          </form>
        )}
      </div>

      {/* Right Column: Summary */}
      <div className="h-fit space-y-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-bold text-lg mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm text-gray-600 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-lg pt-3 border-t">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {step === 'cart' ? (
            <button 
              onClick={() => setStep('details')}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          ) : (
            <button 
              type="submit"
              form="checkout-form"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold"
            >
              Place Order
            </button>
          )}
          
           {step === 'details' && (
             <button onClick={() => setStep('cart')} className="w-full mt-2 text-gray-500 text-sm hover:text-gray-800">
               Back to Cart
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default CheckoutPage;