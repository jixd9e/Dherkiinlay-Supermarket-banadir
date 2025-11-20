import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../StoreContext';
import { User } from '../types';
import { LogoIcon } from './Logo';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock Authentication Logic
    const mockUser: User = {
      id: email, // simple id
      name: name || (email.includes('admin') ? 'Admin User' : 'Customer'),
      email,
      role: email.includes('admin') ? 'admin' : 'user', // Simple hack for demo
    };
    
    login(mockUser);
    navigate(mockUser.role === 'admin' ? '/admin' : '/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 mb-4 bg-green-50 rounded-full flex items-center justify-center">
             <LogoIcon className="w-14 h-14" />
          </div>
          <h1 className="text-3xl font-bold text-green-700 mb-1">Dherkiinlay</h1>
          <span className="text-xs font-bold text-orange-500 tracking-widest uppercase mb-2">Supermarket</span>
          <p className="text-gray-500 text-sm">{isLogin ? 'Welcome back! Please login.' : 'Create your account today.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-primary-100">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-sm text-primary-600 hover:underline"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
