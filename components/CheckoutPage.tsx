import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useStore } from '../StoreContext';
import { useNavigate } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, placeOrder, user, orders } = useStore();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'cart' | 'details' | 'success'>('cart');
  const [lastOrder, setLastOrder] = useState<any>(null);
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
    const order = placeOrder({ address: formData.address, city: formData.city, phone: formData.phone }, formData.paymentMethod);
    setLastOrder(order);
    setStep('success');
  };

  const sendOrderToWhatsApp = () => {
    if (!lastOrder) return;

    // Using the specific business link provided by the user
    // Attempting to append text to the short link, though short links often have pre-configured behavior.
    const itemsList = lastOrder.items.map((item: any) => `- ${item.name} (x${item.quantity}): $${(item.price * item.quantity).toFixed(2)}`).join('\n');
    
    const message = `*New Order from ${lastOrder.customerName}* 🛒\n\n` +
      `*Order ID:* ${lastOrder.id}\n` +
      `--------------------------------\n` +
      `${itemsList}\n` +
      `--------------------------------\n` +
      `*Total: $${lastOrder.total.toFixed(2)}*\n\n` +
      `*Payment:* ${lastOrder.paymentMethod}\n` +
      `*Address:* ${lastOrder.deliveryDetails.address}, ${lastOrder.deliveryDetails.city}\n` +
      `*Phone:* ${lastOrder.deliveryDetails.phone}`;

    window.open(`https://wa.me/message/4IOAGQLFIEKME1?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto text-center py-16 animate-enter">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckIcon />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h2>
        <p className="text-gray-500 mb-6">Thank you for shopping with Dherkiinlay. Your order is being processed.</p>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
           <p className="text-green-800 font-medium mb-3">Want to speed up delivery?</p>
           <button 
             onClick={sendOrderToWhatsApp}
             className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition transform hover:scale-105 shadow-md"
           >
             <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
               <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
             </svg>
             Send Order via WhatsApp
           </button>
        </div>

        <button onClick={() => navigate('/')} className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800">
          Continue Shopping
        </button>
      </div>
    );
  }

  if (cart.length === 0 && step === 'cart') {
    return (
      <div className="text-center py-20 animate-enter">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <button onClick={() => navigate('/')} className="bg-primary-600 text-white px-6 py-3 rounded-lg">Start Shopping</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-enter">
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
          <form id="checkout-form" onSubmit={handleCheckout} className="bg-white rounded-xl shadow-sm border p-6 space-y-6 animate-fade-in-up">
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