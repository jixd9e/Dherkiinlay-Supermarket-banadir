import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, ShoppingBag, Users, DollarSign, Trash2, Edit, Plus, X, Upload, Layers, User } from 'lucide-react';
import { Product, Category } from '../types';

const AdminDashboard: React.FC = () => {
  const { products, categories, orders, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory, updateOrderStatus, user } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'orders'>('overview');

  // --- Stats Calculation ---
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  
  // Mock Data for Chart
  const data = [
    { name: 'Mon', sales: 400 },
    { name: 'Tue', sales: 300 },
    { name: 'Wed', sales: 600 },
    { name: 'Thu', sales: 200 },
    { name: 'Fri', sales: 900 },
    { name: 'Sat', sales: 1200 },
    { name: 'Sun', sales: 850 },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 md:min-h-screen flex-shrink-0">
        <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
        </div>
        <nav className="mt-4">
            <NavButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<DollarSign size={18} />} label="Overview" />
            <NavButton active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={<Package size={18} />} label="Products" />
            <NavButton active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} icon={<Layers size={18} />} label="Categories" />
            <NavButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingBag size={18} />} label="Orders" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={<DollarSign />} label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} color="text-green-600" bg="bg-green-100" />
              <StatCard icon={<ShoppingBag />} label="Total Orders" value={orders.length} color="text-blue-600" bg="bg-blue-100" />
              <StatCard icon={<Package />} label="Products" value={products.length} color="text-purple-600" bg="bg-purple-100" />
              <StatCard icon={<Users />} label="Categories" value={categories.length} color="text-orange-600" bg="bg-orange-100" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-bold mb-6">Weekly Sales</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
           <ProductManager 
             products={products} 
             categories={categories} 
             onAdd={addProduct} 
             onUpdate={updateProduct} 
             onDelete={deleteProduct} 
           />
        )}

        {activeTab === 'categories' && (
            <CategoryManager
                categories={categories}
                onAdd={addCategory}
                onUpdate={updateCategory}
                onDelete={deleteCategory}
            />
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-gray-900">Customer Orders</h1>
            <div className="space-y-4">
                {orders.length === 0 ? (
                    <div className="text-center p-10 bg-white rounded-xl border border-dashed">
                        <p className="text-gray-500">No orders yet.</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition">
                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4 pb-4 border-b">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-lg text-gray-900">{order.id}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                                            order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <User size={14} />
                                        <span>{order.customerName}</span>
                                        <span className="text-gray-300">|</span>
                                        <span>{order.deliveryDetails.phone}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="text-2xl font-bold text-primary-600">${order.total.toFixed(2)}</div>
                                    <select 
                                        value={order.status}
                                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-primary-500 outline-none cursor-pointer"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Items Ordered</h4>
                                <div className="space-y-2">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover border" />
                                                <div>
                                                    <p className="font-medium text-sm text-gray-900">{item.name}</p>
                                                    <p className="text-xs text-gray-500">${item.price} x {item.quantity}</p>
                                                </div>
                                            </div>
                                            <div className="font-bold text-gray-700 text-sm">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 text-sm text-gray-600">
                                    <span className="font-semibold">Delivery To: </span>
                                    {order.deliveryDetails.address}, {order.deliveryDetails.city}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- Reusable Components ---

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full text-left px-6 py-3 font-medium flex items-center gap-3 transition ${active ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
  >
    {icon}
    {label}
  </button>
);

const StatCard = ({ icon, label, value, color, bg }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
    <div className={`p-3 rounded-lg ${bg} ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
    </div>
  </div>
);

const ImageUploader = ({ currentImage, onImageSelected, label }: { currentImage: string, onImageSelected: (url: string) => void, label?: string }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          onImageSelected(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
  
    return (
      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">{label || "Upload Image"}</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition relative h-40 flex items-center justify-center bg-gray-50/50">
          <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          {currentImage ? (
              <div className="relative h-full w-full flex justify-center">
                  <img src={currentImage} alt="Preview" className="h-full object-contain rounded-md" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition rounded-md text-white font-medium z-20 pointer-events-none">
                      Replace Image
                  </div>
              </div>
          ) : (
              <div className="flex flex-col items-center text-gray-500">
                  <Upload size={24} className="mb-2" />
                  <p className="text-xs">Click or Drag to upload</p>
              </div>
          )}
        </div>
      </div>
    );
}

interface CategoryManagerProps {
    categories: Category[];
    onAdd: (c: Category) => void;
    onUpdate: (c: Category) => void;
    onDelete: (id: string) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    
    const initialFormState: Category = {
        id: '',
        name: '',
        image: '',
        description: ''
    };

    const [formData, setFormData] = useState<Category>(initialFormState);

    const openAddModal = () => {
        setEditingId(null);
        setFormData({ ...initialFormState, image: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (cat: Category) => {
        setEditingId(cat.id);
        setFormData({ ...cat });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = { ...formData };
        
        if(!finalData.image) finalData.image = 'https://picsum.photos/seed/newcat/300/300';

        if (editingId) {
            onUpdate(finalData);
        } else {
            onAdd({ ...finalData, id: `cat_${Date.now()}` });
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
                <button type="button" onClick={openAddModal} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 shadow-lg shadow-primary-200">
                    <Plus size={18} /> Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-white rounded-xl border shadow-sm overflow-hidden group hover:shadow-md transition">
                        <div className="h-32 bg-gray-100 relative">
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-900">{cat.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description || 'No description provided.'}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => openEditModal(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition">
                                        <Edit size={16} />
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            if(window.confirm(`Are you sure you want to delete category "${cat.name}"? This action cannot be undone.`)) {
                                                onDelete(cat.id);
                                            }
                                        }} 
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Category Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-lg font-bold">{editingId ? 'Edit Category' : 'Add New Category'}</h3>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <ImageUploader 
                                currentImage={formData.image} 
                                onImageSelected={(url) => setFormData({...formData, image: url})} 
                                label="Category Icon/Image"
                            />
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Category Name</label>
                                <input 
                                    required 
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                                <textarea 
                                    rows={3}
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                                    value={formData.description || ''} 
                                    onChange={e => setFormData({...formData, description: e.target.value})} 
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">{editingId ? 'Update' : 'Add'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

interface ProductManagerProps {
    products: Product[];
    categories: Category[];
    onAdd: (p: Product) => void;
    onUpdate: (p: Product) => void;
    onDelete: (id: string) => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({ products, categories, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialFormState = {
    name: '', 
    price: 0, 
    category: categories[0]?.name || 'General', 
    image: '', 
    description: '', 
    stock: 0
  };

  const [formData, setFormData] = useState<Partial<Product>>(initialFormState);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = { ...formData };
    if (!finalData.image) finalData.image = 'https://picsum.photos/seed/new/400/400';

    if (editingId) {
      onUpdate({ ...finalData, id: editingId } as Product);
    } else {
      onAdd({ ...finalData, id: `prod_${Date.now()}` } as Product);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <button type="button" onClick={openAddModal} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 shadow-lg shadow-primary-200">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
         {products.map((product: Product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg border shadow-sm flex items-center justify-between transition hover:shadow-md">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border">
                    <img src={product.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-900">${product.price}</span> • Stock: {product.stock} • {product.category}
                    </p>
                  </div>
               </div>
               <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => openEditModal(product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition" 
                    title="Edit Product"
                  >
                    <Edit size={18}/>
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      if(window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
                        onDelete(product.id);
                      }
                    }} 
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition" 
                    title="Delete Product"
                  >
                    <Trash2 size={18}/>
                  </button>
               </div>
            </div>
         ))}
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
                <h3 className="text-lg font-bold">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                  <X size={20} />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
               <ImageUploader 
                  currentImage={formData.image || ''} 
                  onImageSelected={(url) => setFormData({...formData, image: url})} 
               />

               <div>
                 <label className="block text-xs font-medium text-gray-700 mb-1">Product Name</label>
                 <input 
                    required 
                    placeholder="e.g. Fresh Milk" 
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                 />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Price ($)</label>
                    <input 
                        required 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                        value={formData.price || ''} 
                        onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} 
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Stock</label>
                    <input 
                        required 
                        type="number" 
                        placeholder="0" 
                        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                        value={formData.stock || ''} 
                        onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} 
                    />
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                 <select 
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                 >
                   {categories.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
                 </select>
               </div>

               <div>
                 <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                 <textarea 
                    rows={3} 
                    placeholder="Product description..." 
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                 />
               </div>
               
               <div className="flex justify-end gap-3 pt-4 border-t">
                 <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                 >
                    Cancel
                 </button>
                 <button 
                    type="submit" 
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 shadow-lg shadow-primary-200"
                 >
                    {editingId ? 'Update Product' : 'Save Product'}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;